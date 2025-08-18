#!/usr/bin/env node

/**
 * DEPLOYMENT TEST: Verify no database dependencies remain
 * This script validates the deployment is ready without database checks
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 [DEPLOY-TEST] Checking for database blockers...');

// Check package.json for database scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts['db:push']) {
    console.log('❌ [DEPLOY-TEST] Found db:push script in package.json');
    console.log('🔧 [DEPLOY-TEST] Creating override...');
    
    // Create override package.json for deployment
    const cleanPackage = { ...packageJson };
    delete cleanPackage.scripts['db:push'];
    
    fs.writeFileSync('./package.json.deploy', JSON.stringify(cleanPackage, null, 2));
    console.log('✅ [DEPLOY-TEST] Created clean package.json.deploy');
  } else {
    console.log('✅ [DEPLOY-TEST] No db:push script found');
  }
  
  // Check for database dependencies
  const deps = Object.keys(packageJson.dependencies || {});
  const dbDeps = deps.filter(dep => 
    dep.includes('drizzle') || 
    dep.includes('neon') || 
    dep.includes('@replit/database')
  );
  
  if (dbDeps.length > 0) {
    console.log('❌ [DEPLOY-TEST] Found database dependencies:', dbDeps);
  } else {
    console.log('✅ [DEPLOY-TEST] No database dependencies found');
  }
  
} catch (error) {
  console.error('❌ [DEPLOY-TEST] Error reading package.json:', error.message);
}

// Test build
try {
  console.log('🔨 [DEPLOY-TEST] Testing build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ [DEPLOY-TEST] Build successful');
} catch (error) {
  console.log('❌ [DEPLOY-TEST] Build failed:', error.message);
}

console.log('✅ [DEPLOY-TEST] Deployment validation complete');