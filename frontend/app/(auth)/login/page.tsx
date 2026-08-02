"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Email atau password salah.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        alert("Login Berhasil!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Gagal terhubung ke server backend. Pastikan server Laravel menyala.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/bg-auth.jpg"
        alt="Background"
        fill
        priority
        className="object-cover object-center -z-10"
      />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-10 z-10 inline-flex items-center gap-1 text-white font-medium text-base sm:text-lg hover:opacity-80 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        Kembali
      </Link>

      {/* Login Card */}
      <Card className="w-full max-w-[480px] bg-[#F7F8F7] rounded-[28px] border-none shadow-2xl p-7 sm:p-10 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight">
            <span className="text-[#48C764]">Login</span>{" "}
            <span className="text-[#0D382A]">Harvesta</span>
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-2 leading-relaxed font-normal">
            Buat akun untuk mulai terhubung dengan petani dan pembeli dalam satu platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 sm:h-12 rounded-xl bg-[#E6E9E6] border border-gray-200/60 px-4 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0D382A]/20 focus-visible:border-[#0D382A] shadow-none"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-gray-900">
                Password
              </Label>
              {/* Tombol teks alternatif buat toggle intip password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] sm:text-xs text-[#0D382A] font-medium hover:underline focus:outline-none"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 sm:h-12 rounded-xl bg-[#E6E9E6] border border-gray-200/60 pl-4 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0D382A]/20 focus-visible:border-[#0D382A] shadow-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 sm:h-12 mt-2 rounded-full bg-[#0D382A] hover:bg-[#08261C] text-white font-semibold text-sm sm:text-base shadow-sm transition-all"
          >
            Login
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3 sm:my-4">
          <div className="w-full border-t border-gray-300/80" />
          <span className="px-3 text-xs text-gray-400 font-medium bg-transparent">or</span>
          <div className="w-full border-t border-gray-300/80" />
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 sm:h-12 rounded-full border border-gray-800 bg-transparent hover:bg-black/5 text-gray-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
        >
          <GoogleIcon className="w-5 h-5" />
          Sign Up dengan Google
        </Button>

        {/* Bottom Text */}
        <div className="text-center pt-1">
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-[#0D382A] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}