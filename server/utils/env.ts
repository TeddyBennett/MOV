import dotenv from 'dotenv';
import path from 'path';

// Only load dotenv in development
// Vercel handles env vars in production
if (process.env.NODE_ENV !== 'production') {
    const envFile = process.env.NODE_ENV === 'local'
        ? '.env.local'
        : '.env.development';

    dotenv.config({
        path: path.resolve(__dirname, '..', envFile)
    });
}

dotenv.config();
console.log('Environment variables loaded dburl + betterauthurl', process.env.DATABASE_URL, process.env.BETTER_AUTH_URL);
export { }; 