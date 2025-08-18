// Supabase Postgres integration with fallback to in-memory storage

import express, { type Request, type Response, type NextFunction } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();

console.log('[DEPLOYMENT] Starting server with Supabase Postgres...');

// Create Postgres pool if DATABASE_URL is available
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log('[DEPLOYMENT] Supabase Postgres pool initialized');
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
      console.error('[SIGNUPS] No database connection available');
      return res.status(500).json({ ok: false, error: 'Database not available' });
    }

    await pool.query(
      'INSERT INTO public.signups(first_name, last_name, email, phone) VALUES($1, $2, $3, $4)',
      [first_name, last_name, email, phone]
    );

    console.log(`[SIGNUPS] New signup: ${email}`);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('[SIGNUPS] Database error:', error);
    res.status(500).json({ ok: false, error: 'Server error' });
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
