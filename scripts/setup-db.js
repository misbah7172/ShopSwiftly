#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Push database schema
    console.log('📋 Pushing database schema...');
    await execAsync('npx drizzle-kit push --force');
    console.log('✅ Database schema pushed successfully!');
    
    // Add any additional setup logic here
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };