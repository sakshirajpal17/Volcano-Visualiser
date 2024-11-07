import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
    try {
        // Read the CSV file from public/assets
        const filePath = path.join(process.cwd(), 'public', 'assets', 'volcano-events.csv');
        const fileContents = fs.readFileSync(filePath, 'utf-8');

        // Set the appropriate headers for CSV download
        const headers = new Headers();
        headers.append('Content-Type', 'text/csv');
        headers.append('Content-Disposition', 'attachment; filename="volcano-events.csv"');

        return new NextResponse(fileContents, {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error('Export data error:', error);
        return NextResponse.json(
            { error: 'Failed to export volcano event data' }, 
            { status: 500 }
        );
    }
} 