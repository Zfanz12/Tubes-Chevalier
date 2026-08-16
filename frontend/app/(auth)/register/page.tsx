"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Phone, User, Loader2, ArrowRight, RotateCcw, Tractor, ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { showToast } from "@/lib/custom-toast";

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    no_hp: string;
    role: "petani" | "umkm";
  };
  otp_preview: string;
}

interface SendOtpResponse {
  message: string;
  no_hp: string;
  otp_preview: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    no_hp: string;
    role: "petani" | "umkm";
    alamat?: string;
    latitude?: number;
    longitude?: number;
  };
}

type Step = "form" | "otp";
type Role = "petani" | "umkm";

import { useAuthStore } from "@/lib/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [noHp, setNoHp] = useState("");
  const [role, setRole] = useState<Role>("umkm");
  const [otp, setOtp] = useState("");
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await apiFetch<RegisterResponse>("/register", {
        method: "POST",
        body: { name, no_hp: noHp, role },
      });

      setOtpPreview(res.otp_preview ?? null);
      setStep("otp");
      startCountdown();
      showToast("Registrasi berhasil! Silakan verifikasi OTP.", "success");
    } catch (err: unknown) {
      const error = err as ApiError;
      if (error?.errors) {
        setFieldErrors(error.errors);
      }
      setErrorMsg(error?.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await apiFetch<LoginResponse>("/login", {
        method: "POST",
        body: { no_hp: noHp, otp },
      });

      setAuth(res.user, res.access_token);
      showToast(`Selamat datang, ${res.user.name}!`, "party");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as ApiError;
      setErrorMsg(error?.message ?? "OTP salah atau sudah kedaluwarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setErrorMsg(null);
    setIsLoading(true);
    setOtp("");

    try {
      const res = await apiFetch<SendOtpResponse>("/send-otp", {
        method: "POST",
        body: { no_hp: noHp },
      });

      setOtpPreview(res.otp_preview ?? null);
      startCountdown();
      showToast("OTP baru berhasil dikirim!", "success");
    } catch (err: unknown) {
      const error = err as ApiError;
      setErrorMsg(error?.message ?? "Gagal mengirim ulang OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/bg4.jpg"
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

      {/* Register Card */}
      <Card className="w-full max-w-[480px] bg-[#F7F8F7] rounded-[28px] border-none shadow-2xl p-7 sm:p-10">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight">
            <span className="text-[#48C764]">Daftar</span>{" "}
            <span className="text-[#0D382A]">Harvesta</span>
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-2 leading-relaxed font-normal">
            {step === "form"
              ? "Buat akun untuk mulai terhubung dengan petani dan pembeli dalam satu platform."
              : `Masukkan kode OTP yang dikirim ke WhatsApp ${noHp}`}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1.5 flex-1 rounded-full bg-[#48C764]" />
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "otp" ? "bg-[#48C764]" : "bg-gray-200"}`} />
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
            {errorMsg}
            {Object.keys(fieldErrors).length > 0 && (
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                {Object.entries(fieldErrors).map(([, messages]) =>
                  messages.map((msg, i) => (
                    <li key={`${msg}-${i}`} className="text-xs">
                      {msg}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}

        {/* OTP Preview (for testing) */}
        {otpPreview && step === "otp" && (
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
            🔐 <span className="font-semibold">OTP (Testing):</span>{" "}
            <span className="tracking-widest font-mono text-base">{otpPreview}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === "form" && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-900">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 sm:h-12 rounded-xl bg-[#E6E9E6] border border-gray-200/60 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0D382A]/20 focus-visible:border-[#0D382A] shadow-none"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <Label htmlFor="no_hp" className="text-xs sm:text-sm font-semibold text-gray-900">
                Nomor WhatsApp
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="no_hp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="h-11 sm:h-12 rounded-xl bg-[#E6E9E6] border border-gray-200/60 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0D382A]/20 focus-visible:border-[#0D382A] shadow-none"
                  required
                  minLength={8}
                  maxLength={15}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm font-semibold text-gray-900">
                Saya adalah
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("petani")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === "petani"
                      ? "border-[#0D382A] bg-[#0D382A]/5 text-[#0D382A]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <Tractor className="w-6 h-6" />
                  <span className="text-sm font-semibold">Petani</span>
                  <span className="text-xs text-center leading-tight opacity-70">Jual hasil panen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("umkm")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === "umkm"
                      ? "border-[#0D382A] bg-[#0D382A]/5 text-[#0D382A]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span className="text-sm font-semibold">UMKM / Pembeli</span>
                  <span className="text-xs text-center leading-tight opacity-70">Beli produk petani</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 mt-2 rounded-full bg-[#0D382A] hover:bg-[#08261C] text-white font-semibold text-sm sm:text-base shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isLoading ? "Mendaftarkan..." : "Daftar & Kirim OTP"}
            </Button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="otp" className="text-xs sm:text-sm font-semibold text-gray-900">
                Kode OTP
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Masukkan 6 digit kode OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-11 sm:h-12 rounded-xl bg-[#E6E9E6] border border-gray-200/60 px-4 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0D382A]/20 focus-visible:border-[#0D382A] shadow-none tracking-widest text-center font-mono text-base"
                required
                maxLength={6}
                minLength={6}
              />
              <p className="text-xs text-gray-400 text-center">
                OTP berlaku selama 5 menit
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full h-11 sm:h-12 mt-2 rounded-full bg-[#0D382A] hover:bg-[#08261C] text-white font-semibold text-sm sm:text-base shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
            </Button>

            {/* Resend OTP */}
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setStep("form"); setOtp(""); setErrorMsg(null); setOtpPreview(null); }}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isLoading}
                className="text-[#0D382A] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-opacity"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {countdown > 0 ? `Kirim ulang (${countdown}s)` : "Kirim ulang OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Text */}
        <div className="text-center pt-1">
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-[#0D382A] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
