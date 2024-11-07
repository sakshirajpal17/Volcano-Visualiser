import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        const db = await connectDB();
        const collection = (db as any).connection.db.collection('volcano_events');

        if (!query) {
            return NextResponse.json({ events: [] });
        }

        // Check if query is a year or year range
        const yearPattern = /^(\d{1,4})(?:-(\d{1,4}))?$/;
        const yearMatch = query.match(yearPattern);

        let searchQuery;
        if (yearMatch) {
            if (yearMatch[2]) { // Year range (e.g., "1900-2000")
                searchQuery = {
                    Year: {
                        $gte: parseInt(yearMatch[1]),
                        $lte: parseInt(yearMatch[2])
                    }
                };
            } else { // Exact year
                searchQuery = { Year: parseInt(yearMatch[1]) };
            }
        } else {
            searchQuery = {
                $or: [
                    { Name: { $regex: query, $options: 'i' } },
                    { Location: { $regex: query, $options: 'i' } },
                    { Country: { $regex: query, $options: 'i' } },
                    { Type: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const events = await collection.find(searchQuery).limit(20).toArray();
        return NextResponse.json({ events });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Failed to search volcano events' }, { status: 500 });
    }
} 