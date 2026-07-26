import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const response = await fetch(`${apiUrl}/petani`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching petani:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data dari backend Laravel' },
      { status: 500 }
    );
  }
}