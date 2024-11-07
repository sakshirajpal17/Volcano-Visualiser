import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const db = await connectDB();
        const collection = (db as any).connection.db.collection('volcano_events');

        // Insert the new volcano event
        await collection.insertOne(data);

        return NextResponse.json({ 
            message: 'Volcano event data imported successfully' 
        });

    } catch (error) {
        console.error('Import data error:', error);
        return NextResponse.json(
            { error: 'Failed to import volcano event data' }, 
            { status: 500 }
        );
    }
} 