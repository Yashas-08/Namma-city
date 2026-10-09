const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure DATABASE_URL is available for prisma generate in CI/build environments
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
console.log('[DATABASE] Generating Prisma Client with schema:', schemaPath);

try {
  execSync(`npx prisma generate --schema="${schemaPath}"`, {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('[DATABASE] Prisma Client generated successfully.');
} catch (err) {
  // Check if client is already generated (e.g. file locked by local dev server on Windows)
  const clientExists =
    fs.existsSync(path.resolve(__dirname, '../../../node_modules/.prisma/client/index.js')) ||
    fs.existsSync(path.resolve(__dirname, '../../../node_modules/@prisma/client/index.js')) ||
    fs.existsSync(path.resolve(__dirname, '../node_modules/.prisma/client/index.js'));

  if (clientExists) {
    console.warn('[DATABASE] Prisma Client already generated; proceeding with build.');
  } else {
    console.error('[DATABASE] Failed to generate Prisma Client:', err);
    process.exit(1);
  }
}
