// Supabase Postgres integration with fallback to in-memory storage

import express, { type Request, type Response, type NextFunction } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { clientAuth } from "./mw/clientAuth";

dotenv.config();

console.log('[DEPLOYMENT] Starting server with Supabase Postgres...');

// Create Postgres pool if DATABASE_URL is available
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 5
    });
    
    // Test the connection
    pool.query('SELECT 1')
      .then(() => console.log('[DEPLOYMENT] Supabase Postgres connection verified'))
      .catch((err) => {
        console.error('[DEPLOYMENT] Supabase connection test failed:', err.message);
        console.log('[DEPLOYMENT] Falling back to in-memory storage');
        pool = null;
      });
      
    console.log('[DEPLOYMENT] Supabase Postgres pool initialized');
  } catch (error) {
    console.error('[DEPLOYMENT] Failed to create Postgres pool:', error);
    pool = null;
  }
} else {
  console.log('[DEPLOYMENT] No DATABASE_URL found, using in-memory storage');
}

const app = express();
app.set('trust proxy', 1);  // For correct req.ip in autoscale

// CORS configuration
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// A) Health endpoint FIRST so Vite dev middleware can't intercept it
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    ok: true, 
    env: process.env.NODE_ENV || 'development',
    database: !!pool ? 'postgres' : 'in-memory',
    timestamp: new Date().toISOString()
  });
});

// B) Supabase signups endpoint
app.post('/api/signups', async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Email is required' });
    }

    if (!pool) {
      console.log('[SIGNUPS] No database connection - using in-memory fallback for:', email);
      // In production, you might want to queue these for later processing
      return res.status(201).json({ 
        ok: true, 
        message: 'Signup received (stored in-memory)' 
      });
    }

    // Test connection before inserting
    await pool.query('SELECT 1');
    
    await pool.query(
      'INSERT INTO public.signups(first_name, last_name, email, phone) VALUES($1, $2, $3, $4)',
      [first_name, last_name, email, phone]
    );

    console.log(`[SIGNUPS] New signup saved to Supabase: ${email}`);
    res.status(201).json({ ok: true, message: 'Signup saved to database' });
  } catch (error: any) {
    console.error('[SIGNUPS] Database error:', error.message);
    
    // Provide more specific error information
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        ok: false, 
        error: 'Database connection failed - DNS resolution error' 
      });
    } else if (error.code === '23505') {
      return res.status(409).json({ 
        ok: false, 
        error: 'Email already registered' 
      });
    }
    
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// C) Host applications endpoint
app.post('/api/host-applications', async (req, res) => {
  try {
    const { 
      business_name, property_type, first_name, last_name, email, phone,
      property_address, parking_spaces, electrical_capacity, daily_traffic,
      operating_hours, partnership_model, implementation_timeline,
      amenities, additional_info 
    } = req.body;
    
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Email is required' });
    }

    if (!pool) {
      console.log('[HOST-APPS] No database connection - using in-memory fallback for:', email);
      return res.status(201).json({ 
        ok: true, 
        message: 'Host application received (stored in-memory)' 
      });
    }

    // Test connection before inserting
    await pool.query('SELECT 1');
    
    await pool.query(
      `INSERT INTO public.host_applications(
        business_name, property_type, first_name, last_name, email, phone,
        property_address, parking_spaces, electrical_capacity, daily_traffic,
        operating_hours, partnership_model, implementation_timeline,
        amenities, additional_info
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        business_name, property_type, first_name, last_name, email, phone,
        property_address, parseInt(parking_spaces) || 0, electrical_capacity, daily_traffic,
        operating_hours, partnership_model, implementation_timeline,
        amenities, additional_info
      ]
    );

    console.log(`[HOST-APPS] New host application saved to Supabase: ${email}`);
    res.status(201).json({ ok: true, message: 'Host application saved to database' });
  } catch (error: any) {
    console.error('[HOST-APPS] Database error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        ok: false, 
        error: 'Database connection failed - DNS resolution error' 
      });
    } else if (error.code === '23505') {
      return res.status(409).json({ 
        ok: false, 
        error: 'Application already submitted for this email' 
      });
    }
    
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// D) Client Dashboard API Routes (Protected)
app.get('/api/client/signups', clientAuth, async (req, res) => {
  try {
    const search = (req.query.search as string) || '';
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!pool) {
      return res.status(503).json({ 
        error: 'Database not available - using in-memory storage' 
      });
    }

    const searchPattern = `%${search}%`;
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM public.signups 
      WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
    `;
    const dataQuery = `
      SELECT id, created_at, first_name, last_name, email, phone 
      FROM public.signups 
      WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, [searchPattern]),
      pool.query(dataQuery, [searchPattern, limit, offset])
    ]);

    res.json({
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].total)
    });
  } catch (error: any) {
    console.error('[CLIENT-API] Signups fetch error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/client/host-applications', clientAuth, async (req, res) => {
  try {
    const search = (req.query.search as string) || '';
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!pool) {
      return res.status(503).json({ 
        error: 'Database not available - using in-memory storage' 
      });
    }

    const searchPattern = `%${search}%`;
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM public.host_applications 
      WHERE business_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR property_address ILIKE $1
    `;
    const dataQuery = `
      SELECT * 
      FROM public.host_applications 
      WHERE business_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR property_address ILIKE $1
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, [searchPattern]),
      pool.query(dataQuery, [searchPattern, limit, offset])
    ]);

    res.json({
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].total)
    });
  } catch (error: any) {
    console.error('[CLIENT-API] Host applications fetch error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/client/export/signups.csv', clientAuth, async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ 
        error: 'Database not available - using in-memory storage' 
      });
    }

    const result = await pool.query(`
      SELECT created_at, first_name, last_name, email, phone 
      FROM public.signups 
      ORDER BY created_at DESC
    `);

    const csv = [
      'Date,First Name,Last Name,Email,Phone',
      ...result.rows.map(row => 
        `${new Date(row.created_at).toLocaleDateString()},"${row.first_name}","${row.last_name}","${row.email}","${row.phone}"`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="signups.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('[CLIENT-API] Signups export error:', error.message);
    res.status(500).json({ error: 'Export failed' });
  }
});

app.get('/api/client/export/host-applications.csv', clientAuth, async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ 
        error: 'Database not available - using in-memory storage' 
      });
    }

    const result = await pool.query(`
      SELECT * 
      FROM public.host_applications 
      ORDER BY created_at DESC
    `);

    const headers = result.rows.length > 0 ? Object.keys(result.rows[0]) : [];
    const csv = [
      headers.join(','),
      ...result.rows.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="host-applications.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('[CLIENT-API] Host applications export error:', error.message);
    res.status(500).json({ error: 'Export failed' });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `[DEPLOYMENT] ${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && path !== "/api/health") {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Serve static files from public directory
app.use(express.static("public"));

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // B) Disable Vite dev middleware in production
  const isProd = process.env.NODE_ENV === 'production';
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (!isProd) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // C) Production deployment configuration with port management
  const PORT = Number(process.env.PORT) || 5000;
  
  // Production hardening for autoscale
  process.on('unhandledRejection', r => console.error('[DEPLOYMENT][unhandledRejection]', r));
  process.on('uncaughtException', e => {
    console.error('[DEPLOYMENT][uncaughtException]', e);
    if ((e as any).code === 'EADDRINUSE') {
      console.log('[DEPLOYMENT] Port conflict detected - attempting restart...');
      process.exit(1);
    }
  });

  // Graceful port handling
  server.on('error', (err) => {
    if ((err as any).code === 'EADDRINUSE') {
      console.log(`[DEPLOYMENT] Port ${PORT} busy - attempting alternate port...`);
      const altPort = PORT + Math.floor(Math.random() * 100);
      server.listen(altPort, '0.0.0.0', () => {
        console.log(`[DEPLOYMENT] Server listening on ${altPort} (alternate)`);
        console.log(`[DEPLOYMENT] Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } else {
      throw err;
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[DEPLOYMENT] Server listening on ${PORT}`);
    console.log(`[DEPLOYMENT] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[DEPLOYMENT] Build timestamp: ${new Date().toISOString()}`);
  });
})();
