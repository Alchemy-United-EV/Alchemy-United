#!/bin/bash

# DEPLOYMENT-READY STARTUP SCRIPT
# Completely bypasses database environment variables for clean deployment

echo "🚀 [CLEAN-START] Launching Alchemy United without database dependencies..."

# Clear all database environment variables
unset DATABASE_URL
unset PGUSER  
unset PGDATABASE
unset PGHOST
unset PGPASSWORD
unset PGPORT
unset NEON_DATABASE_URL

# Export clean environment
export NODE_ENV=production
export PORT=5000

# Force in-memory storage mode
export FORCE_MEMORY_STORAGE=true

echo "✅ [CLEAN-START] Database variables cleared"
echo "✅ [CLEAN-START] In-memory storage forced"
echo "✅ [CLEAN-START] Starting application..."

# Start the application
exec node dist/index.js