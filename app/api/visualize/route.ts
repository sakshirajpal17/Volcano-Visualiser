import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await connectDB();
        const collection = (db as any).connection.db.collection('volcano_events');

        // Get total events count
        const totalEvents = await collection.countDocuments();

        // Get average VEI
        const veiStats = await collection.aggregate([
            { $match: { VEI: { $ne: null } } },
            { $group: { _id: null, avgVEI: { $avg: "$VEI" } } }
        ]).toArray();

        // Get events by VEI distribution
        const veiDistribution = await collection.aggregate([
            { $match: { VEI: { $ne: null } } },
            { $group: { _id: "$VEI", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        // Get events by type
        const typeDistribution = await collection.aggregate([
            { $match: { Type: { $ne: null } } },
            { $group: { _id: "$Type", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();

        // Get events by century
        const eventsByTime = await collection.aggregate([
            { $match: { Year: { $ne: null } } },
            { $group: { 
                _id: { 
                    $subtract: [
                        { $floor: { $divide: ["$Year", 100] } },
                        { $cond: [{ $lt: ["$Year", 0] }, 1, 0] }
                    ]
                },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]).toArray();

        // Get total deaths
        const deathStats = await collection.aggregate([
            { $match: { Deaths: { $ne: null } } },
            { $group: { _id: null, totalDeaths: { $sum: "$Deaths" } } }
        ]).toArray();

        // Get events by elevation ranges
        const elevationDistribution = await collection.aggregate([
            { $match: { "Elevation (m)": { $ne: null } } },
            {
                $bucket: {
                    groupBy: "$Elevation (m)",
                    boundaries: [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
                    default: "7000+",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]).toArray();

        // Get top 10 deadliest events
        const deadliestEvents = await collection.aggregate([
            { $match: { Deaths: { $ne: null, $gt: 0 } } },
            { $sort: { Deaths: -1 } },
            { $limit: 10 },
            { $project: { Name: 1, Year: 1, Deaths: 1, Location: 1 } }
        ]).toArray();

        // Get events by region/continent
        const regionDistribution = await collection.aggregate([
            { $match: { Country: { $ne: null } } },
            { $group: { _id: "$Country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]).toArray();

        // Get monthly distribution
        const monthlyDistribution = await collection.aggregate([
            { $match: { Month: { $ne: null } } },
            { $group: { _id: "$Month", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        return NextResponse.json({
            totalEvents,
            averageVEI: veiStats[0]?.avgVEI || 0,
            veiDistribution: veiDistribution.map((item: any) => ({
                vei: item._id,
                count: item.count
            })),
            typeDistribution: typeDistribution.map((item: any) => ({
                type: item._id,
                count: item.count
            })),
            eventsByTime: eventsByTime.map((item: any) => ({
                century: item._id,
                count: item.count
            })),
            totalDeaths: deathStats[0]?.totalDeaths || 0,
            elevationDistribution: elevationDistribution.map((item: any) => ({
                range: item._id === "7000+" ? "7000+" : `${item._id}-${item._id + 999}`,
                count: item.count
            })),
            deadliestEvents,
            regionDistribution: regionDistribution.map((item: any) => ({
                country: item._id,
                count: item.count
            })),
            monthlyDistribution: monthlyDistribution.map((item: any) => ({
                month: new Date(2024, item._id - 1).toLocaleString('default', { month: 'short' }),
                count: item.count
            }))
        });

    } catch (error) {
        console.error('Visualization data fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch visualization data' }, 
            { status: 500 }
        );
    }
} 