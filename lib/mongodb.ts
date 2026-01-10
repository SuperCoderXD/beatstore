import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const uri = process.env.MONGODB_URI

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to keep track of client
  // This prevents client from being recreated on every request
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Creating new MongoDB client for development...')
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  console.log('Creating new MongoDB client for production...')
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

// Database helper functions
export interface BeatRecord {
  _id?: string;
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
  whopProductIds: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  whopPurchaseUrls?: {
    basic?: string;
    premium?: string;
    unlimited?: string;
  };
  prices: {
    basic: number;
    premium: number;
    unlimited: number;
  };
  licenses: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  assets: {
    basicFiles: string[];
    premiumFiles: string[];
    unlimitedFiles: string[];
  };
  createdAt: string;
  listed?: boolean;
}

export async function getBeatsCollection(): Promise<any> {
  const client = await clientPromise
  const db = client.db('beatstore')
  return db.collection('beats')
}

export async function getBeats(): Promise<BeatRecord[]> {
  try {
    const collection = await getBeatsCollection()
    const beats = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return beats
  } catch (error) {
    console.error('Error fetching beats:', error)
    return []
  }
}

export async function getBeat(id: string): Promise<BeatRecord | null> {
  try {
    const collection = await getBeatsCollection()
    const beat = await collection.findOne({ id })
    return beat
  } catch (error) {
    console.error('Error fetching beat:', error)
    return null
  }
}

export async function createBeat(beat: Omit<BeatRecord, '_id'>): Promise<BeatRecord> {
  try {
    console.log('Connecting to MongoDB...')
    const client = await clientPromise
    console.log('Connected to MongoDB successfully')
    
    const db = client.db('beatstore')
    const collection = db.collection('beats')
    
    console.log('Inserting beat:', beat.id)
    const result = await collection.insertOne(beat as any)
    console.log('Beat inserted successfully:', result.insertedId)
    
    return { ...beat, _id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creating beat in MongoDB:', error)
    console.error('MongoDB error details:', JSON.stringify(error, null, 2))
    throw error
  }
}

export async function updateBeat(id: string, updates: Partial<BeatRecord>): Promise<BeatRecord | null> {
  try {
    const collection = await getBeatsCollection()
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    )
    if (!result) {
      return null
    }
    return result
  } catch (error) {
    console.error('Error updating beat:', error)
    throw error
  }
}

export async function deleteBeat(id: string): Promise<boolean> {
  try {
    const collection = await getBeatsCollection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting beat:', error)
    throw error
  }
}
