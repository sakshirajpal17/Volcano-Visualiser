const { MongoClient } = require('mongodb');
const fs = require('fs');
const { parse } = require('csv-parse');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'sakshi';
const COLLECTION_NAME = 'volcano_events';

async function importVolcanoData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data');

    const records = [];
    
    // Read and parse CSV file
    const parser = fs
      .createReadStream('./data/volcano-events.csv')
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          // Convert numeric strings to numbers
          if (context.column === 'Year' || 
              context.column === 'Month' || 
              context.column === 'Day' || 
              context.column === 'Elevation (m)' || 
              context.column === 'VEI' ||
              context.column === 'Deaths' ||
              context.column === 'Latitude' ||
              context.column === 'Longitude') {
            return value === '' ? null : Number(value);
          }
          return value;
        }
      }));

    for await (const record of parser) {
      records.push(record);
    }

    // Insert all records
    const result = await collection.insertMany(records);
    console.log(`Successfully imported ${result.insertedCount} volcano events`);

    // Create indexes for better query performance
    await collection.createIndex({ Year: 1 });
    await collection.createIndex({ Location: 1 });
    await collection.createIndex({ Country: 1 });
    await collection.createIndex({ VEI: 1 });
    console.log('Created indexes');

  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

importVolcanoData().catch(console.error);
