import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/educadd_lms';
const dbName = process.env.MONGODB_DB || 'educadd_lms';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2000,
      });
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2000,
      });
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null; isConnected: boolean }> {
  try {
    const connectedClient = await getMongoClient();
    const db = connectedClient.db(dbName);
    return { client: connectedClient, db, isConnected: true };
  } catch (error) {
    console.warn('[MongoDB] Running in standalone fallback mode without live MongoDB instance:', error);
    return { client: null, db: null, isConnected: false };
  }
}
