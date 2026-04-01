import { query } from './src/db/index.js';

async function clearVisits() {
  try {
    await query('DELETE FROM visits');
    console.log('Visits cleared successfully.');
  } catch (err) {
    console.error('Error clearing visits:', err);
  }
  process.exit(0);
}

clearVisits();
