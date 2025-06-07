import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('search') || 'Catan';

  if (!searchQuery.trim()) {
    return NextResponse.json({ error: 'Missing search parameter' }, { status: 400 });
  }

  const url = `https://boardgamegeek.com/xmlapi/search?search=${encodeURIComponent(searchQuery)}`;
  const res = await fetch(url);
  const xmlData = await res.text();

  const parsed = parser.parse(xmlData);
  const boardgames = parsed.boardgames?.boardgame || [];
  const items = Array.isArray(boardgames) ? boardgames : [boardgames];

  const results = items.map((item: any) => ({
    id: item['@_objectid'],
    name:
      typeof item.name === 'string'
        ? item.name
        : item.name?.['#text'] || item.name?.['@_value'] || 'Unknown',
    yearPublished: item.yearpublished ? parseInt(item.yearpublished) : undefined,
  }));

  return NextResponse.json({
    data: results,
    total: results.length,
  });
}