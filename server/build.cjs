const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./server.ts', './vercel.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outdir: './dist',
    format: 'cjs', // CommonJS is most reliable for Vercel/Node deployments
    external: [
        '@prisma/client',
        'prisma'
    ],
    minify: true,
    sourcemap: true,
}).then(() => {
    console.log('✓ Server build complete');
}).catch(() => process.exit(1));