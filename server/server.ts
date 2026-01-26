import './utils/env.js';


import app from './app.js';
import prisma from './utils/prisma.js'; // Import the shared Prisma client

const PORT: number = parseInt(process.env.PORT || '5000', 10);
// server.ts
const envFlag = process.execArgv.find(arg => arg.startsWith('--env-file'));
console.log(`🛠️  Node loaded env via: ${envFlag || 'Default/None'}`);
console.log('--- SYSTEM STARTUP ---');
console.log('Mode:', process.env.NODE_ENV || 'not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Connected' : '❌ Missing');
console.log('TrendingMovie Model:', (prisma as any).trendingMovie ? '✅ Available' : '❌ Missing (Need Re-generation)');
console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL ? '✅ Configured' : '⚠️ Warning: Missing');
console.log('TMDB_AUTH_KEY:', process.env.TMDB_AUTH_KEY ? '✅ Configured' : '⚠️ Warning: Missing');
console.log('----------------------');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown for Prisma Client
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
