import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = 'http://127.0.0.1:8000/api/petani'; 
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server backend');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}