import { MongoClient, Db } from 'mongodb';

export function getMongoUri(): string {
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rnd_cadd';
}

export function getMongoDbName(): string {
  if (process.env.MONGODB_DB && process.env.MONGODB_DB.trim() !== '') {
    return process.env.MONGODB_DB.trim();
  }
  const uri = getMongoUri();
  // Extract database name from URI if present e.g. mongodb+srv://.../dbname?retryWrites=true
  const match = uri.match(/mongodb(?:\+srv)?:\/\/[^\/]+\/([^?]+)/);
  if (match && match[1] && match[1].trim() !== '') {
    return match[1].trim();
  }
  return 'rnd_cadd';
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = getMongoUri();

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export async function connectToDatabase(): Promise<{
  client: MongoClient | null;
  db: Db | null;
  isConnected: boolean;
  dbName: string;
}> {
  const dbName = getMongoDbName();
  try {
    const connectedClient = await getMongoClient();
    const db = connectedClient.db(dbName);
    return { client: connectedClient, db, isConnected: true, dbName };
  } catch (error) {
    console.warn('[MongoDB] Running in standalone fallback mode without live MongoDB instance:', error);
    return { client: null, db: null, isConnected: false, dbName };
  }
}

export async function testMongoConnection(): Promise<{
  connected: boolean;
  dbName: string;
  pingMs?: number;
  collections?: string[];
  error?: string;
}> {
  const startTime = Date.now();
  const dbName = getMongoDbName();
  try {
    const connectedClient = await getMongoClient();
    const db = connectedClient.db(dbName);
    await db.command({ ping: 1 });
    const pingMs = Date.now() - startTime;
    const collectionsList = await db.listCollections().toArray();
    return {
      connected: true,
      dbName,
      pingMs,
      collections: collectionsList.map((c) => c.name),
    };
  } catch (error: any) {
    return {
      connected: false,
      dbName,
      error: error?.message || 'Failed to connect to MongoDB',
    };
  }
}
