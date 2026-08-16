import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiUser } from "./api";

interface User {
  id: number;
  name: string;
  no_hp: string;
  role: "petani" | "umkm";
  latitude?: number;
  longitude?: number;
  alamat?: string;
  email?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: "Laki-laki" | "Perempuan";
  nama_usaha?: string;
  deskripsi_usaha?: string;
  tahun_berdiri?: string;
  pengalaman?: number;
  provinsi?: string;
  kota?: string;
  jam_buka?: string;
  jam_tutup?: string;
  status_operasional?: "Buka" | "Tutup";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (partialUser: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),
      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "harvesta-auth", // key di localStorage
    }
  )
);
