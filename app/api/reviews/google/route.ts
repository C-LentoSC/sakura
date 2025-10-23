import { NextRequest, NextResponse } from 'next/server';

interface GoogleReview {
  author_name: string;
  rating: number;
  text?: string;
  time: number;
  relative_time_description?: string;
  profile_photo_url?: string;
  author_url?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.max(1, Math.min(10, Number(limitParam))) : 3;

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { total: 0, reviews: [], note: 'Google reviews unconfigured' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const fields = 'rating,reviews,user_ratings_total';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&reviews_no_translations=true&key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
    clearTimeout(timeout);

    if (!res.ok) {
      // Fail soft: return empty list
      return NextResponse.json(
        { total: 0, reviews: [] },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const data = await res.json();

    const reviews: GoogleReview[] = data?.result?.reviews ?? [];

    const mapped = reviews
      .filter(r => !!r.text)
      .slice(0, limit)
      .map((r, idx) => ({
        id: `${r.time}-${idx}`,
        name: r.author_name,
        rating: r.rating,
        text: r.text || '',
        relativeTime: r.relative_time_description || '',
        authorUrl: r.author_url || '',
        photoUrl: r.profile_photo_url || ''
      }));

    return NextResponse.json(
      { total: data?.result?.user_ratings_total ?? 0, reviews: mapped },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' } }
    );
  } catch {
    // Fail soft: return empty list in case of network/timeouts
    return NextResponse.json(
      { total: 0, reviews: [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
