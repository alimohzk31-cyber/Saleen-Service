import fs from 'fs';
import path from 'path';

const MOCK_DB_PATH = path.join(process.cwd(), 'mock-db.json');

try {
  if (fs.existsSync(MOCK_DB_PATH)) {
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    const mockStore = JSON.parse(data);
    mockStore.visits = [];
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(mockStore, null, 2));
    console.log('Visits cleared in mock-db.json');
  }
} catch (e) {
  console.error('Failed to clear visits:', e);
}
