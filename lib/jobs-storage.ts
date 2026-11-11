import fs from 'fs';
import path from 'path';
import { INITIAL_JOBS, INITIAL_NOTIFICATIONS, JobPost, JobNotification } from './jobs-data';

const DATA_FILE_PATH = path.join(process.cwd(), 'scratch', 'jobs_data.json');

export interface StoredJobsData {
  jobs: JobPost[];
  notifications: JobNotification[];
}

export function getStoredJobsData(): StoredJobsData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.jobs)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Jobs Data] Error reading persistent file, using in-memory defaults:', err);
  }

  // Ensure scratch directory exists
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify({ jobs: INITIAL_JOBS, notifications: INITIAL_NOTIFICATIONS }, null, 2),
      'utf-8'
    );
  } catch {
    // ignore
  }

  return { jobs: INITIAL_JOBS, notifications: INITIAL_NOTIFICATIONS };
}

export function saveStoredJobsData(data: StoredJobsData): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Jobs Data] Failed to write persistent jobs file:', err);
    return false;
  }
}
