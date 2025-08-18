#!/bin/bash

# AGGRESSIVE DATABASE REMOVAL SCRIPT
# This script completely disables all database functionality for deployment

echo "🚫 [DISABLE-DB] Aggressively removing all database traces..."

# Override environment variables at runtime
export DATABASE_URL=""
export PGUSER=""
export PGDATABASE=""
export PGHOST=""
export PGPASSWORD=""
export PGPORT=""
export NEON_DATABASE_URL=""
export DRIZZLE_DATABASE_URL=""

# Create empty database stub files to satisfy any remaining checks
mkdir -p tmp
echo '{"status":"disabled","message":"database functionality removed"}' > tmp/db-status.json

# Override any database commands in package scripts
if [ -f package.json ]; then
    # Create backup and clean version
    cp package.json package.json.original
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.scripts && pkg.scripts['db:push']) {
        delete pkg.scripts['db:push'];
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        console.log('✅ Removed db:push script');
    }
    "
fi

# Start application with database checks completely disabled
echo "✅ [DISABLE-DB] Database functionality completely disabled"
echo "🚀 [DISABLE-DB] Starting application..."

exec npm run start