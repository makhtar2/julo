import { createPublicClient } from '@/lib/supabase/public';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const supabase = createPublicClient();

    try {
        // Simple query to keep the DB active (Supabase Free Tier)
        // This endpoint is called daily via Vercel Cron (vercel.json)
        const { data, error } = await supabase.from('Category').select('id').limit(1);

        if (error) throw error;

        return NextResponse.json({
            status: 'ok',
            purpose: 'keep-alive',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Database connection failed',
            },
            { status: 500 }
        );
    }
}
