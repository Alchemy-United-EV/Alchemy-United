// Airtable-only storage for Alchemy United forms

import express, { type Request, type Response, type NextFunction } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { clientAuth } from "./mw/clientAuth";

dotenv.config();

console.log('[DEPLOYMENT] Starting server with Airtable storage...');

// Airtable configuration
const AIR = {
  token: process.env.AIRTABLE_TOKEN!,
  base: process.env.AIRTABLE_BASE_ID!,
  signups: process.env.AIRTABLE_SIGNUPS_TABLE || "signups",
  hosts: process.env.AIRTABLE_HOSTS_TABLE || "host_applications",
};

async function airWrite(table: string, fields: any) {
  const url = `https://api.airtable.com/v0/${AIR.base}/${encodeURIComponent(table)}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIR.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }] }),
  });
  return r;
}

const app = express();
app.set('trust proxy', 1);  // For correct req.ip in autoscale

// CORS configuration
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    database: "airtable",
    timestamp: new Date().toISOString(),
  });
});

// Signups endpoint
app.post('/api/signups', async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body || {};
    if (!email) return res.status(400).json({ ok: false, error: "Email required" });
    
    const r = await airWrite(AIR.signups, { first_name, last_name, email, phone });
    if (!r.ok) return res.status(r.status).json({ ok: false, error: await r.text() });
    
    console.log(`[SIGNUPS] New signup saved to Airtable: ${email}`);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error("[signups]", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Host applications endpoint
app.post('/api/host-applications', async (req, res) => {
  try {
    const fields = req.body || {};
    if (!fields?.email) return res.status(400).json({ ok: false, error: "Email required" });
    
    const r = await airWrite(AIR.hosts, fields);
    if (!r.ok) return res.status(r.status).json({ ok: false, error: await r.text() });
    
    console.log(`[HOST-APPS] New host application saved to Airtable: ${fields.email}`);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error("[host-applications]", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Client Dashboard API Routes (Protected) - Note: These will need Airtable read API implementation
app.get('/api/client/signups', clientAuth, async (req, res) => {
  res.status(503).json({ 
    error: 'Client dashboard requires Airtable read API implementation' 
  });
});

app.get('/api/client/host-applications', clientAuth, async (req, res) => {
  res.status(503).json({ 
    error: 'Client dashboard requires Airtable read API implementation' 
  });
});

app.get('/api/client/export/signups.csv', clientAuth, async (req, res) => {
  res.status(503).json({ 
    error: 'CSV export requires Airtable read API implementation' 
  });
});

app.get('/api/client/export/host-applications.csv', clientAuth, async (req, res) => {
  res.status(503).json({ 
    error: 'CSV export requires Airtable read API implementation' 
  });
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