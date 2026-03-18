// src/warmup.ts
export function startWarmUp() {
  setInterval(async () => {
    try {
      const res = await fetch('https://your-app.onrender.com/health');
      console.log('Warm up:', res.status);
    } catch (err) {
      console.error('Warm up failed:', err);
    }
  }, 10 * 60 * 1000);
}