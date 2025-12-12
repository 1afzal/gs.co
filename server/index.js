// CommonJS wrapper: dynamically import the real ESM entry (index.mjs).
// This ensures `node index.js` works even if the environment doesn't treat .js files as ESM.

(async () => {
  try {
    await import('./index.mjs');
  } catch (err) {
    console.error('Failed to load ESM entry ./index.mjs', err);
    process.exit(1);
  }
})();
