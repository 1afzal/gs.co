// CommonJS wrapper: dynamically import the real ESM entry (index.mjs).
// This ensures `node index.js` works even if the environment doesn't treat .js files as ESM.

(async () => {
  try {
    const mod = await import('./index.mjs');
    if (mod && typeof mod.startServer === 'function') {
      await mod.startServer();
    }
  } catch (err) {
    console.error('Failed to load or start ESM entry ./index.mjs', err);
    process.exit(1);
  }
})();
