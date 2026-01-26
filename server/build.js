const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./server.ts', './vercel.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outdir: './dist',
    format: 'cjs',
    external: [
        '@prisma/client',
        'prisma',
        // Add any other dependencies that shouldn't be bundled
    ],
    minify: false, // Set to true for smaller builds
    sourcemap: true, // Helpful for debugging
}).then(() => {
    console.log('✓ Server build complete');
}).catch(() => process.exit(1));