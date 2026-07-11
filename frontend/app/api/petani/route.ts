
// Mock API
import { NextResponse } from 'next/server';

export async function GET() {
  const dummyPetani = [
    {
      id: "p1",
      nama: "Kelompok Tani Sukarno",
      komoditas: "Tomat Segar",
      stok: 50, // (dlm kg)
      harga: 12000,
      radius: "1.2 km",
      rating: 4.9,
      logistik: "Tersedia (Kurir Internal)"
    },

    {
      id: "p2",
      nama: "Tani Makmur Sragen",
      komoditas: "Cabai Rawit",
      stok: 25,
      harga: 35000,
      radius: "3.5 km",
      rating: 4.7,
      logistik: "Tersedia (Kurir Internal)"
    }
  ];

  return NextResponse.json(dummyPetani);
}