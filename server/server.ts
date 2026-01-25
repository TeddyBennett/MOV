import './utils/env';


import app from './app';
import prisma from './utils/prisma'; // Import the shared Prisma client

const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown for Prisma Client
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
