// Rewrites the __BUILD_ID__ token in dist/sw.js with the current timestamp
// so each Netlify deploy invalidates the previous service-worker cache.
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/sw.js';
const buildId = process.env.COMMIT_REF || String(Date.now());
const src = readFileSync(path, 'utf8');
writeFileSync(path, src.replace('__BUILD_ID__', buildId));
console.log(`sw.js stamped with build id ${buildId}`);
