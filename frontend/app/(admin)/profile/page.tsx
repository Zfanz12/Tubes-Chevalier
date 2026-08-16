"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Edit2, LogOut, Eye, EyeOff, Calendar, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";
import { showToast } from "@/lib/custom-toast";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, updateUser, clearAuth } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<"pribadi" | "usaha">("pribadi");

  // Dialog States
  const [showSignOut, setShowSignOut] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  
  // Pending actions for discard
  const [pendingTab, setPendingTab] = useState<"pribadi" | "usaha" | null>(null);
  const [pendingAction, setPendingAction] = useState<"back" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);

  // --- Pribadi State ---
  const defaultPribadi = {
    name: user?.name || "",
    email: user?.email || "",
    no_hp: user?.no_hp || "",
    tanggal_lahir: user?.tanggal_lahir || "",
    jenis_kelamin: user?.jenis_kelamin || "Laki-laki",
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
  const [pribadiData, setPribadiData] = useState(defaultPribadi);
  const [pribadiErrors, setPribadiErrors] = useState<Record<string, string>>({});
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Usaha State ---
  const defaultUsaha = {
    nama_usaha: user?.nama_usaha || "",
    deskripsi_usaha: user?.deskripsi_usaha || "",
    email_usaha: user?.email || "",
    no_hp_usaha: user?.no_hp || "",
    tahun_berdiri: user?.tahun_berdiri || "",
    pengalaman: user?.pengalaman?.toString() || "",
    provinsi: user?.provinsi || "",
    kota: user?.kota || "",
    alamat: user?.alamat || "",
    jam_buka: user?.jam_buka || "",
    jam_tutup: user?.jam_tutup || "",
    status_operasional: user?.status_operasional || "Buka",
  };
  const [usahaData, setUsahaData] = useState(defaultUsaha);
  const [usahaErrors, setUsahaErrors] = useState<Record<string, string>>({});

  // Sync form data with current user state
  useEffect(() => {
    if (user) {
      setPribadiData({
        name: user.name || "",
        email: user.email || "",
        no_hp: user.no_hp || "",
        tanggal_lahir: user.tanggal_lahir || "",
        jenis_kelamin: user.jenis_kelamin || "Laki-laki",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setUsahaData({
        nama_usaha: user.nama_usaha || "",
        deskripsi_usaha: user.deskripsi_usaha || "",
        email_usaha: user.email || "",
        no_hp_usaha: user.no_hp || "",
        tahun_berdiri: user.tahun_berdiri || "",
        pengalaman: user.pengalaman?.toString() || "",
        provinsi: user.provinsi || "",
        kota: user.kota || "",
        alamat: user.alamat || "",
        jam_buka: user.jam_buka || "",
        jam_tutup: user.jam_tutup || "",
        status_operasional: user.status_operasional || "Buka",
      });
      if (user.avatar) setAvatarUrl(user.avatar);
    }
  }, [user]);

  // --- Phone Number Change & Verification States ---
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState("");
  const [inputPhoneOtp, setInputPhoneOtp] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");

  const isPhoneChanged = (user?.no_hp || "").trim() !== pribadiData.no_hp.trim();

  // Reset phone verification state when phone number is edited
  const handlePhoneInputChange = (newVal: string) => {
    setPribadiData((prev) => ({ ...prev, no_hp: newVal }));
    if (newVal.trim() === (user?.no_hp || "").trim()) {
      setIsPhoneVerified(true);
    } else {
      setIsPhoneVerified(false);
    }
  };

  const handleStartPhoneVerification = () => {
    if (!pribadiData.no_hp.trim() || pribadiData.no_hp.trim().length < 8) {
      setPribadiErrors((prev) => ({ ...prev, no_hp: "Nomor telepon minimal 8 digit." }));
      return;
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setPhoneOtpCode(otp);
    setInputPhoneOtp("");
    setPhoneOtpError("");
    setShowPhoneOtpModal(true);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPhoneOtp.trim() === phoneOtpCode) {
      setIsPhoneVerified(true);
      setShowPhoneOtpModal(false);
      setPribadiErrors((prev) => {
        const copy = { ...prev };
        delete copy.no_hp;
        return copy;
      });
      showToast(`Nomor WhatsApp ${pribadiData.no_hp} berhasil diverifikasi!`, "success");
    } else {
      setPhoneOtpError("Kode OTP salah. Masukkan kode 6 digit yang tertera.");
    }
  };

  // --- Dirty Tracking ---
  const isPribadiDirty = JSON.stringify(pribadiData) !== JSON.stringify(defaultPribadi) || (activeTab === "pribadi" && isAvatarDirty);
  const isUsahaDirty = JSON.stringify(usahaData) !== JSON.stringify(defaultUsaha) || (activeTab === "usaha" && isAvatarDirty);

  // --- Validation Logic ---
  const validatePribadi = () => {
    const errs: Record<string, string> = {};
    if (!pribadiData.name.trim()) errs.name = "Nama Lengkap wajib diisi.";
    if (pribadiData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pribadiData.email)) {
      errs.email = "Format email tidak valid.";
    }
    if (!pribadiData.no_hp.trim()) {
      errs.no_hp = "Nomor Telepon wajib diisi.";
    } else if (isPhoneChanged && !isPhoneVerified) {
      errs.no_hp = "Nomor telepon baru harus diverifikasi via OTP terlebih dahulu. Klik tombol 'Verifikasi'.";
    }
    
    if (pribadiData.new_password) {
      if (pribadiData.new_password.length < 6) {
        errs.new_password = "Password minimal 6 karakter.";
      }
      if (pribadiData.new_password !== pribadiData.confirm_password) {
        errs.confirm_password = "Konfirmasi password tidak cocok.";
      }
      if (!pribadiData.current_password) {
        errs.current_password = "Password saat ini wajib diisi untuk mengubah password.";
      }
    }
    setPribadiErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateUsaha = () => {
    const errs: Record<string, string> = {};
    if (!usahaData.nama_usaha.trim()) errs.nama_usaha = "Nama Usaha Tani wajib diisi.";
    if (usahaData.email_usaha && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usahaData.email_usaha)) {
      errs.email_usaha = "Format email tidak valid.";
    }
    if (usahaData.pengalaman && isNaN(Number(usahaData.pengalaman))) {
      errs.pengalaman = "Pengalaman harus berupa angka.";
    }
    setUsahaErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --- Handlers ---
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran foto maksimal 2MB", "error");
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setIsAvatarDirty(true);
    }
  };

  const attemptChangeTab = (tab: "pribadi" | "usaha") => {
    if (tab === activeTab) return;
    if ((activeTab === "pribadi" && isPribadiDirty) || (activeTab === "usaha" && isUsahaDirty)) {
      setPendingTab(tab);
      setShowDiscardConfirm(true);
    } else {
      setActiveTab(tab);
    }
  };

  const attemptGoBack = () => {
    if ((activeTab === "pribadi" && isPribadiDirty) || (activeTab === "usaha" && isUsahaDirty)) {
      setPendingAction("back");
      setShowDiscardConfirm(true);
    } else {
      router.back();
    }
  };

  const confirmDiscard = () => {
    if (activeTab === "pribadi") {
      setPribadiData(defaultPribadi);
      setPribadiErrors({});
    } else {
      setUsahaData(defaultUsaha);
      setUsahaErrors({});
    }
    setAvatarUrl(user?.avatar || "");
    setIsAvatarDirty(false);
    setShowDiscardConfirm(false);

    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    } else if (pendingAction === "back") {
      router.back();
    }
  };

  const handleSaveClick = () => {
    if (activeTab === "pribadi") {
      if (validatePribadi()) setShowSaveConfirm(true);
    } else {
      if (validateUsaha()) setShowSaveConfirm(true);
    }
  };

  const executeSave = async () => {
    setShowSaveConfirm(false);
    showToast("Menyimpan profil...", "hello");

    const oldNoHp = (user?.no_hp || "").trim();
    const newNoHp = pribadiData.no_hp.trim();
    let updatedPayload: Record<string, any> = {};

    if (activeTab === "pribadi") {
      updatedPayload = {
        name: pribadiData.name,
        email: pribadiData.email,
        no_hp: newNoHp,
        tanggal_lahir: pribadiData.tanggal_lahir,
        jenis_kelamin: pribadiData.jenis_kelamin as any,
        avatar: avatarUrl,
      };
      setIsAvatarDirty(false);
      setPribadiData((prev) => ({ ...prev, current_password: "", new_password: "", confirm_password: "" }));
    } else {
      updatedPayload = {
        nama_usaha: usahaData.nama_usaha,
        deskripsi_usaha: usahaData.deskripsi_usaha,
        tahun_berdiri: usahaData.tahun_berdiri,
        pengalaman: usahaData.pengalaman ? parseInt(usahaData.pengalaman) : undefined,
        provinsi: usahaData.provinsi,
        kota: usahaData.kota,
        alamat: usahaData.alamat,
        jam_buka: usahaData.jam_buka,
        jam_tutup: usahaData.jam_tutup,
        status_operasional: usahaData.status_operasional as any,
        avatar: avatarUrl,
      };
      setIsAvatarDirty(false);
    }

    // 1. Update Zustand store
    updateUser(updatedPayload);

    // 2. Persist per-phone-number profile cache in localStorage & migrate key if phone number changed!
    if (typeof window !== "undefined") {
      const oldKey = oldNoHp ? `harvesta_user_profile_${oldNoHp}` : null;
      const newKey = `harvesta_user_profile_${newNoHp}`;
      
      const existingStr = oldKey ? localStorage.getItem(oldKey) : null;
      const existingObj = existingStr ? JSON.parse(existingStr) : {};
      const merged = { ...user, ...existingObj, ...updatedPayload, no_hp: newNoHp };

      localStorage.setItem(newKey, JSON.stringify(merged));

      if (oldKey && oldKey !== newKey) {
        localStorage.removeItem(oldKey);
      }
    }

    // 3. Sync to backend API if authenticated
    if (token) {
      try {
        await apiFetch("/petani/profile", {
          method: "POST",
          body: {
            nama: usahaData.nama_usaha || pribadiData.name,
            alamat: usahaData.alamat,
          },
        });
      } catch {
        // Silently handle if backend route doesn't match role
      }
    }

    showToast(
      activeTab === "pribadi"
        ? `Informasi pribadi berhasil disimpan! Nomor akun: ${newNoHp}`
        : "Informasi usaha berhasil disimpan!",
      "success"
    );
  };

  const handleSignOut = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Header Mobile / Back Nav */}
      <div className="flex items-center gap-3">
        <button 
          onClick={attemptGoBack} 
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Profile</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR CARD */}
        <div className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col shrink-0 min-h-[520px]">
          {/* Avatar Section */}
          <div className="flex flex-col items-center pt-2">
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#1B4332] bg-gray-100">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-emerald-200 text-4xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-8 h-8 bg-[#1B4332] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-[#0f2a1f] transition shadow-md"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>
            
            {/* Nama: Wrap ke bawah (new line) jika kelebihan */}
            <h2 className="mt-4 text-lg font-bold text-gray-900 text-center break-words w-full px-2 leading-snug">
              {user?.name || "User"}
            </h2>

            {/* Email: Auto Horizontal Scroll (Marquee) Otomatis jika kelebihan */}
            <div className="w-full overflow-hidden text-center mt-1 px-2">
              <div
                className={`inline-block whitespace-nowrap ${
                  (user?.email || "").length > 22 ? "animate-email-scroll" : ""
                }`}
              >
                <p
                  className="text-sm text-gray-500 font-medium inline-block"
                  title={user?.email || "Email belum diatur"}
                >
                  {user?.email || "Email belum diatur"}
                </p>
              </div>
            </div>

            <style jsx>{`
              @keyframes emailScroll {
                0%, 15% { transform: translateX(0%); }
                50%, 65% { transform: translateX(-45%); }
                85%, 100% { transform: translateX(0%); }
              }
              .animate-email-scroll {
                display: inline-block;
                animation: emailScroll 8s ease-in-out infinite;
              }
              .animate-email-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col gap-2 mt-8 w-full">
            <button 
              onClick={() => attemptChangeTab("pribadi")}
              className={`text-left px-5 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                activeTab === "pribadi" 
                  ? "bg-[#d5ebe1] text-[#1B4332]" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Profil Pribadi
            </button>
            <button 
              onClick={() => attemptChangeTab("usaha")}
              className={`text-left px-5 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                activeTab === "usaha" 
                  ? "bg-[#d5ebe1] text-[#1B4332]" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Profil Usaha
            </button>
          </div>

          <div className="mt-auto pt-8">
            <button 
              onClick={() => setShowSignOut(true)}
              className="flex items-center gap-2 text-red-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-red-50 transition cursor-pointer w-full"
            >
              <LogOut className="w-5 h-5 rotate-180" />
              Sign Out
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 w-full">
          {activeTab === "pribadi" ? (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">Informasi Pribadi</h3>
              
              <div className="space-y-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text"
                    value={pribadiData.name}
                    onChange={(e) => setPribadiData({...pribadiData, name: e.target.value})}
                    className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  />
                  {pribadiErrors.name && <p className="text-red-500 text-xs mt-1">{pribadiErrors.name}</p>}
                </div>

                {/* Email & No Telp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                    <input 
                      type="email"
                      value={pribadiData.email}
                      onChange={(e) => setPribadiData({...pribadiData, email: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                    />
                    {pribadiErrors.email && <p className="text-red-500 text-xs mt-1">{pribadiErrors.email}</p>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">Nomor Telepon (WhatsApp)</label>
                      {isPhoneChanged && isPhoneVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" /> Terverifikasi
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        type="text"
                        value={pribadiData.no_hp}
                        onChange={(e) => handlePhoneInputChange(e.target.value)}
                        className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl pl-4 pr-24 py-2.5 text-sm outline-none transition"
                        placeholder="08xxxxxxxxxx"
                      />
                      {isPhoneChanged && !isPhoneVerified && (
                        <button
                          type="button"
                          onClick={handleStartPhoneVerification}
                          className="absolute right-2 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#0f2a1f] px-3 py-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                        >
                          Verifikasi
                        </button>
                      )}
                    </div>
                    {isPhoneChanged && !isPhoneVerified && (
                      <p className="text-amber-600 text-[11px] font-medium mt-1">
                        ⚠️ Nomor diubah. Klik <strong>"Verifikasi"</strong> untuk konfirmasi via OTP.
                      </p>
                    )}
                    {pribadiErrors.no_hp && <p className="text-red-500 text-xs mt-1">{pribadiErrors.no_hp}</p>}
                  </div>
                </div>

                {/* Tgl Lahir & Jenis Kelamin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Lahir</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={pribadiData.tanggal_lahir}
                        onChange={(e) => setPribadiData({...pribadiData, tanggal_lahir: e.target.value})}
                        className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none transition appearance-none"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2.5">Jenis Kelamin</label>
                    <div className="flex items-center gap-6 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                        <input 
                          type="radio" 
                          name="jk" 
                          value="Laki-laki"
                          checked={pribadiData.jenis_kelamin === "Laki-laki"}
                          onChange={(e) => setPribadiData({...pribadiData, jenis_kelamin: e.target.value as any})}
                          className="accent-[#1B4332] w-4 h-4"
                        />
                        Laki-laki
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                        <input 
                          type="radio" 
                          name="jk" 
                          value="Perempuan"
                          checked={pribadiData.jenis_kelamin === "Perempuan"}
                          onChange={(e) => setPribadiData({...pribadiData, jenis_kelamin: e.target.value as any})}
                          className="accent-[#1B4332] w-4 h-4"
                        />
                        Perempuan
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keamanan Section */}
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5 mt-8">Keamanan</h3>
              
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password Saat Ini</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      value={pribadiData.current_password}
                      onChange={(e) => setPribadiData({...pribadiData, current_password: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none transition font-sans placeholder-gray-300"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pribadiErrors.current_password && <p className="text-red-500 text-xs mt-1">{pribadiErrors.current_password}</p>}
                </div>
                
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password Baru</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      value={pribadiData.new_password}
                      onChange={(e) => setPribadiData({...pribadiData, new_password: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none transition placeholder-gray-300"
                      placeholder="Minimal 6 karakter"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pribadiErrors.new_password && <p className="text-red-500 text-xs mt-1">{pribadiErrors.new_password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={pribadiData.confirm_password}
                      onChange={(e) => setPribadiData({...pribadiData, confirm_password: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none transition placeholder-gray-300"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pribadiErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{pribadiErrors.confirm_password}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 border-t border-gray-100 pt-6">
                <Button 
                  variant="outline" 
                  onClick={attemptGoBack}
                  className="rounded-xl px-8 h-10 font-bold bg-[#e2e2e2] text-gray-600 hover:bg-[#d1d1d1] border-transparent transition"
                >
                  Batal
                </Button>
                <Button 
                  disabled={!isPribadiDirty}
                  onClick={handleSaveClick}
                  className="rounded-xl px-8 h-10 font-bold bg-[#014c32] hover:bg-[#023c28] text-white shadow-sm transition disabled:opacity-50"
                >
                  Simpan
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">Informasi Usaha</h3>
              
              <div className="space-y-4">
                {/* Nama Usaha Tani */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Usaha Tani</label>
                  <input 
                    type="text"
                    value={usahaData.nama_usaha}
                    onChange={(e) => setUsahaData({...usahaData, nama_usaha: e.target.value})}
                    className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  />
                  {usahaErrors.nama_usaha && <p className="text-red-500 text-xs mt-1">{usahaErrors.nama_usaha}</p>}
                </div>

                {/* Deskripsi Usaha */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Deskripsi Usaha</label>
                  <textarea 
                    rows={4}
                    value={usahaData.deskripsi_usaha}
                    onChange={(e) => setUsahaData({...usahaData, deskripsi_usaha: e.target.value})}
                    className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-3 text-sm outline-none transition resize-none leading-relaxed"
                  />
                </div>

                {/* Email & No Telp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                    <input 
                      type="email"
                      value={usahaData.email_usaha}
                      onChange={(e) => setUsahaData({...usahaData, email_usaha: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                    />
                    {usahaErrors.email_usaha && <p className="text-red-500 text-xs mt-1">{usahaErrors.email_usaha}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nomor Telepon</label>
                    <input 
                      type="text"
                      value={usahaData.no_hp_usaha}
                      onChange={(e) => setUsahaData({...usahaData, no_hp_usaha: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                </div>

                {/* Tahun Berdiri & Pengalaman */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tahun Berdiri</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={usahaData.tahun_berdiri}
                        onChange={(e) => setUsahaData({...usahaData, tahun_berdiri: e.target.value})}
                        className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none transition appearance-none"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pengalaman</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        min="0"
                        value={usahaData.pengalaman}
                        onChange={(e) => setUsahaData({...usahaData, pengalaman: e.target.value})}
                        className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                      />
                      <span className="text-sm font-semibold text-gray-800 shrink-0">Tahun</span>
                    </div>
                    {usahaErrors.pengalaman && <p className="text-red-500 text-xs mt-1">{usahaErrors.pengalaman}</p>}
                  </div>
                </div>

                {/* Provinsi & Kota */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Provinsi</label>
                    <input 
                      type="text"
                      value={usahaData.provinsi}
                      onChange={(e) => setUsahaData({...usahaData, provinsi: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kota/Kabupaten</label>
                    <input 
                      type="text"
                      value={usahaData.kota}
                      onChange={(e) => setUsahaData({...usahaData, kota: e.target.value})}
                      className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alamat Lengkap</label>
                  <textarea 
                    rows={3}
                    value={usahaData.alamat}
                    onChange={(e) => setUsahaData({...usahaData, alamat: e.target.value})}
                    className="w-full bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-3 text-sm outline-none transition resize-none leading-relaxed"
                  />
                </div>

                {/* Operasional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jam Operasional</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="time" 
                        value={usahaData.jam_buka}
                        onChange={(e) => setUsahaData({...usahaData, jam_buka: e.target.value})}
                        className="flex-1 bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2 text-sm outline-none transition"
                      />
                      <span className="text-gray-500 font-bold">-</span>
                      <input 
                        type="time" 
                        value={usahaData.jam_tutup}
                        onChange={(e) => setUsahaData({...usahaData, jam_tutup: e.target.value})}
                        className="flex-1 bg-[#f9fafb] border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-2 text-sm outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Operasional Usaha</label>
                    <div className="inline-flex bg-[#e2e2e2] rounded-full p-1 border border-gray-200">
                      <button 
                        onClick={() => setUsahaData({...usahaData, status_operasional: "Buka"})}
                        className={`px-5 py-1.5 text-xs font-bold rounded-full transition shadow-xs ${usahaData.status_operasional === "Buka" ? "bg-white text-[#1B4332]" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        Buka
                      </button>
                      <button 
                        onClick={() => setUsahaData({...usahaData, status_operasional: "Tutup"})}
                        className={`px-5 py-1.5 text-xs font-bold rounded-full transition shadow-xs ${usahaData.status_operasional === "Tutup" ? "bg-white text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 border-t border-gray-100 pt-6">
                <Button 
                  variant="outline" 
                  onClick={attemptGoBack}
                  className="rounded-xl px-8 h-10 font-bold bg-[#e2e2e2] text-gray-600 hover:bg-[#d1d1d1] border-transparent transition"
                >
                  Batal
                </Button>
                <Button 
                  disabled={!isUsahaDirty}
                  onClick={handleSaveClick}
                  className="rounded-xl px-8 h-10 font-bold bg-[#014c32] hover:bg-[#023c28] text-white shadow-sm transition disabled:opacity-50"
                >
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Dialogs --- */}
      {/* 1. Save Confirmation Dialog (Matches Figma precisely) */}
      <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#d5ebe1] rounded-full flex items-center justify-center border-[1.5px] border-[#1B4332] mb-3">
            <Edit2 className="w-7 h-7 text-[#014c32]" fill="#014c32" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Simpan Perubahan?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Pilih <span className="font-bold text-gray-700">Simpan</span> untuk menyimpan perubahan informasi {activeTab === "pribadi" ? "pribadi" : "bisnis"}
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSaveConfirm(false)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm"
            >
              Batal
            </Button>
            <Button 
              onClick={executeSave}
              className="flex-1 rounded-xl h-11 bg-[#014c32] hover:bg-[#023c28] text-white font-bold text-sm"
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Sign Out Dialog (Matches Figma precisely) */}
      <Dialog open={showSignOut} onOpenChange={setShowSignOut}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#fdd8d8] rounded-full flex items-center justify-center border-[1.5px] border-red-500 mb-3">
            {/* Custom Logout SVG resembling figma */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H15" stroke="#ff0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 12H20M20 12L16 8M20 12L16 16" stroke="#ff0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Keluar dari Akun?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Tindakan ini akan membuat Anda keluar dari Harvesta
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSignOut(false)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm"
            >
              Batal
            </Button>
            <Button 
              onClick={handleSignOut}
              className="flex-1 rounded-xl h-11 bg-[#f00000] hover:bg-[#d00000] text-white font-bold text-sm"
            >
              Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Discard Changes Dialog */}
      <Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center border-[1.5px] border-amber-400 mb-3">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Buang Perubahan?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Ada perubahan yang belum disimpan. Yakin ingin membuangnya?
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDiscardConfirm(false)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm"
            >
              Batal
            </Button>
            <Button 
              onClick={confirmDiscard}
              className="flex-1 rounded-xl h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-sm"
            >
              Buang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Phone Change OTP Verification Dialog */}
      <Dialog open={showPhoneOtpModal} onOpenChange={setShowPhoneOtpModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-[1.5px] border-emerald-300 mb-2">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">
            Verifikasi Nomor WhatsApp Baru
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 mb-3 font-medium leading-relaxed">
            Kode OTP 6 digit telah dikirimkan ke nomor WhatsApp <strong className="text-gray-800">{pribadiData.no_hp}</strong>
          </DialogDescription>

          {/* MOCK OTP DEBUG BANNER (Matches Login Page Debug Style) */}
          <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 mb-4 text-xs text-left">
            <p className="font-semibold text-emerald-900 mb-0.5">💬 [ MOCK OTP DEBUG ]</p>
            <p>Kode OTP Anda adalah: <strong className="text-sm tracking-widest text-[#1B4332] font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 ml-1">{phoneOtpCode}</strong></p>
          </div>

          <form onSubmit={handleVerifyPhoneOtp} className="w-full space-y-3">
            <div>
              <input
                type="text"
                maxLength={6}
                value={inputPhoneOtp}
                onChange={(e) => setInputPhoneOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Masukkan 6 Digit OTP"
                className="w-full bg-[#f9fafb] border border-gray-200 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest outline-none transition"
              />
              {phoneOtpError && <p className="text-red-500 text-xs font-semibold mt-1.5">{phoneOtpError}</p>}
            </div>

            <div className="flex w-full gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPhoneOtpModal(false)}
                className="flex-1 rounded-xl h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl h-11 bg-[#1B4332] hover:bg-[#0f2a1f] text-white font-bold text-sm"
              >
                Verifikasi OTP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
