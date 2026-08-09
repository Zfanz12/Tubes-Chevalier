"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Star,
    MessageSquareReply,
    CheckCircle2,
    Clock,
    TrendingUp,
    ChevronDown,
    Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FeedbackReply {
    author: string;
    text: string;
    date: string;
}

interface FeedbackItem {
    id: string;
    customer: string;
    avatar: string;
    rating: number;
    product: string;
    productCategory: string;
    comment: string;
    date: string;
    replied: boolean;
    reply?: FeedbackReply;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const dummyFeedbacks: FeedbackItem[] = [
    {
        id: "FB-001",
        customer: "Elena Martinez",
        avatar: "",
        rating: 4,
        product: "Tomat Mantep",
        productCategory: "Sayuran",
        comment:
            "Bayam yang diterima masih sangat segar dan daunnya tidak layu. Pengemasan juga rapi sehingga produk sampai dalam kondisi baik. Akan membeli kembali.",
        date: "2 jam yang lalu",
        replied: false,
    },
    {
        id: "FB-002",
        customer: "Budi Santoso",
        avatar: "",
        rating: 5,
        product: "Kangkung Segar",
        productCategory: "Sayuran",
        comment:
            "Produknya luar biasa! Sangat segar, aromanya wangi, dan harganya terjangkau. Sudah order 3 kali dan selalu memuaskan. Penjual responsif dan ramah. Highly recommended!",
        date: "5 jam yang lalu",
        replied: true,
        reply: {
            author: "Harvesta Team",
            text: "Terima kasih atas ulasan positifnya, Pak Budi! Kami senang produk kami memenuhi ekspektasi Anda. Kami akan terus menjaga kualitas demi kepuasan pelanggan.",
            date: "4 jam yang lalu",
        },
    },
    {
        id: "FB-003",
        customer: "Siti Rahayu",
        avatar: "",
        rating: 3,
        product: "Cabai Merah Premium",
        productCategory: "Rempah",
        comment:
            "Cabainya cukup segar, tapi pengiriman agak terlambat dari jadwal. Kualitas produk masih oke, cuma harap pengiriman bisa lebih tepat waktu ke depannya.",
        date: "1 hari yang lalu",
        replied: false,
    },
    {
        id: "FB-004",
        customer: "Ahmad Fauzi",
        avatar: "",
        rating: 5,
        product: "Bayam Organik",
        productCategory: "Sayuran",
        comment:
            "Bayam organiknya top banget! Beda banget sama yang di pasar biasa, lebih segar dan rasanya lebih enak. Harga memang sedikit lebih mahal tapi worth it banget.",
        date: "1 hari yang lalu",
        replied: true,
        reply: {
            author: "Harvesta Team",
            text: "Terima kasih, Pak Ahmad! Kami bangga produk organik kami bisa memuaskan Anda. Kualitas dan kesegaran adalah prioritas utama kami.",
            date: "20 jam yang lalu",
        },
    },
    {
        id: "FB-005",
        customer: "Dewi Kusuma",
        avatar: "",
        rating: 2,
        product: "Wortel Baby",
        productCategory: "Sayuran",
        comment:
            "Wortelnya kurang segar, beberapa sudah layu. Packaging kurang melindungi produk. Semoga bisa diperbaiki untuk pengiriman selanjutnya.",
        date: "2 hari yang lalu",
        replied: false,
    },
    {
        id: "FB-006",
        customer: "Rizky Pratama",
        avatar: "",
        rating: 4,
        product: "Jahe Emprit",
        productCategory: "Rempah",
        comment:
            "Jahe empritnya berkualitas, aromanya kuat dan sudah dibersihkan dengan baik. Pengiriman cepat dan aman. Akan order lagi bulan depan untuk stok.",
        date: "3 hari yang lalu",
        replied: false,
    },
    {
        id: "FB-007",
        customer: "Nurul Hidayah",
        avatar: "",
        rating: 5,
        product: "Tomat Ceri",
        productCategory: "Buah",
        comment:
            "Tomat cerinya manis banget dan segar! Beli untuk salad dan hasilnya sempurna. Ukurannya seragam dan kondisi sangat baik. Pasti beli lagi!",
        date: "3 hari yang lalu",
        replied: true,
        reply: {
            author: "Harvesta Team",
            text: "Makasih banyak, Kak Nurul! Seneng banget produk kami bisa bikin saladnya makin enak. Ditunggu order berikutnya ya!",
            date: "2 hari yang lalu",
        },
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                />
            ))}
        </div>
    );
}

function getRatingBadge(rating: number) {
    if (rating >= 5) return { label: "Sangat Puas", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (rating >= 4) return { label: "Puas", className: "bg-blue-50 text-blue-700 border-blue-200" };
    if (rating >= 3) return { label: "Cukup", className: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "Perlu Perbaikan", className: "bg-rose-50 text-rose-700 border-rose-200" };
}

function ReplyDialog({
    open,
    feedback,
    onOpenChange,
    onSubmit,
}: {
    open: boolean;
    feedback: FeedbackItem | null;
    onOpenChange: (open: boolean) => void;
    onSubmit: (id: string, reply: string) => void;
}) {
    const [replyText, setReplyText] = useState("");

    React.useEffect(() => {
        if (open) setReplyText("");
    }, [open, feedback?.id]);

    const handleSubmit = () => {
        if (!feedback || !replyText.trim()) return;
        onSubmit(feedback.id, replyText.trim());
        onOpenChange(false);
        toast.custom(
            (t) => (
                <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg px-4 border border-gray-100 min-w-[300px] max-w-[360px]" style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <img
                        src="/gif_success.gif"
                        alt="success"
                        style={{ width: 64, height: "auto", objectFit: "contain", flexShrink: 0, display: "block" }}
                    />
                    <p className="flex-1 text-sm font-semibold text-gray-800">Berhasil mengirim balasan</p>
                </div>
            ),
            { duration: 2500, className: "!bg-transparent !shadow-none !border-0 !p-0" }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {feedback && (
                <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                    <DialogHeader className="pb-3 border-b border-gray-100">
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            Balas Ulasan
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-500">
                            {feedback?.customer} · {feedback?.product}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-3 space-y-4 text-xs">
                        <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-100 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={feedback.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-xs font-bold">
                                            {feedback.customer.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900 leading-none">
                                            {feedback.customer}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{feedback.date}</p>
                                    </div>
                                </div>
                                <StarRating rating={feedback.rating} />
                            </div>
                            <div className="text-xs text-gray-500">
                                Produk: <span className="font-semibold text-emerald-700">{feedback.product}</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{feedback.comment}</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 block">
                                Balasan Anda
                            </label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                                placeholder="Tulis balasan yang ramah dan profesional..."
                                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
                            />
                            <div className="flex items-center justify-between text-[11px] text-gray-400">
                                <span>Balas dengan profesional dan responsif 😊</span>
                                <span>{replyText.length} karakter</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-3 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-10 px-5 rounded-xl font-semibold cursor-pointer text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            disabled={!replyText.trim()}
                            onClick={handleSubmit}
                            className="h-10 px-6 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold cursor-pointer text-xs shadow-xs"
                        >
                            <Send className="w-3.5 h-3.5 mr-1" />
                            Kirim Balasan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}

function FilterDropdown({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={(props) => (
                    <button
                        {...props}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition cursor-pointer outline-none shadow-xs"
                    >
                        <span>{value || label}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            />
            <DropdownMenuContent align="start" className="min-w-[160px]">
                {options.map((opt) => (
                    <DropdownMenuItem
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={value === opt ? "font-semibold text-[#1B4332]" : ""}
                    >
                        {opt}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function FeedbackCard({
    item,
    onReply,
}: {
    item: FeedbackItem;
    onReply: (item: FeedbackItem) => void;
}) {
    const badge = getRatingBadge(item.rating);

    return (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-[0_2px_12px_rgba(3,59,42,0.06)] overflow-hidden transition-shadow hover:shadow-[0_4px_20px_rgba(3,59,42,0.10)]">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <Avatar className="w-11 h-11 ring-2 ring-emerald-100 shrink-0">
                        <AvatarImage src={item.avatar} alt={item.customer} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-bold text-sm">
                            {item.customer.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {item.customer}
                                    </span>
                                    <span
                                        className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                                    >
                                        {badge.label}
                                    </span>
                                    {item.replied && (
                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Sudah Dibalas
                                        </span>
                                    )}
                                </div>
                                <StarRating rating={item.rating} />
                            </div>
                            <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                                {item.date}
                            </span>
                        </div>

                        <div className="mt-1.5 mb-2.5">
                            <span className="text-xs text-gray-500">
                                Produk :{" "}
                                <span className="font-semibold text-emerald-700">
                                    {item.product}
                                </span>
                                <span className="ml-1.5 text-gray-400">· {item.productCategory}</span>
                            </span>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">{item.comment}</p>

                        {!item.replied && (
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => onReply(item)}
                                    className="inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#164029] text-white rounded-full px-4.5 py-2 text-xs font-semibold transition cursor-pointer shadow-xs"
                                >
                                    <MessageSquareReply className="w-3.5 h-3.5" />
                                    Balas
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {item.replied && item.reply && (
                <div className="bg-emerald-50/60 border-t border-emerald-100 px-5 py-4 ml-14">
                    <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">H</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-emerald-800">
                                    {item.reply.author}
                                </span>
                                <span className="text-xs text-gray-400">{item.reply.date}</span>
                            </div>
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                                {item.reply.text}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(dummyFeedbacks);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [ratingFilter, setRatingFilter] = useState("Semua Rating");
    const [sortFilter, setSortFilter] = useState("Terbaru");
    const [productFilter, setProductFilter] = useState("Semua Produk");
    const [statusFilter, setStatusFilter] = useState("Semua Status");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;

    const unrepliedCount = feedbacks.filter((f) => !f.replied).length;
    const avgRating = (
        feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1)
    ).toFixed(1);

    const filtered = useMemo(() => {
        return feedbacks
            .filter((f) => {
                if (ratingFilter !== "Semua Rating" && f.rating !== parseInt(ratingFilter)) return false;
                if (productFilter !== "Semua Produk" && f.product !== productFilter) return false;
                if (statusFilter === "Belum Dibalas" && f.replied) return false;
                if (statusFilter === "Sudah Dibalas" && !f.replied) return false;
                return true;
            })
            .sort((a, b) => {
                if (sortFilter === "Rating Tertinggi") return b.rating - a.rating;
                if (sortFilter === "Rating Terendah") return a.rating - b.rating;
                return 0;
            });
    }, [feedbacks, ratingFilter, sortFilter, productFilter, statusFilter]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

    // L-08 FIX: Pagination out-of-bounds safety check
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedFeedbacks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage]);

    const handleReply = (id: string, replyText: string) => {
        setFeedbacks((prev) =>
            prev.map((f) =>
                f.id === id
                    ? {
                        ...f,
                        replied: true,
                        reply: {
                            author: "Harvesta Team",
                            text: replyText,
                            date: "Baru saja",
                        },
                    }
                    : f
            )
        );
    };

    const uniqueProducts = [
        "Semua Produk",
        ...Array.from(new Set(feedbacks.map((f) => f.product))),
    ];

    const dynamicStats = [
        {
            label: "Total Ulasan",
            value: `${feedbacks.length}`,
            sub: `+${feedbacks.length > 5 ? feedbacks.length - 5 : 0} minggu ini`,
            icon: MessageSquareReply,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
        },
        {
            label: "Rating Rata-rata",
            value: avgRating,
            sub: "Dari 5 bintang",
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-50",
            border: "border-amber-200",
        },
        {
            label: "Belum Dibalas",
            value: `${unrepliedCount}`,
            sub: unrepliedCount > 0 ? "Perlu segera dibalas" : "Semua ulasan sudah dibalas",
            icon: Clock,
            color: "text-rose-500",
            bg: "bg-rose-50",
            border: "border-rose-200",
        },
        {
            label: "Tingkat Balasan",
            value: `${Math.round(((feedbacks.length - unrepliedCount) / (feedbacks.length || 1)) * 100)}%`,
            sub: "Naik dari bulan lalu",
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
        },
    ];

    return (
        <div className="w-full space-y-6">
            {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dynamicStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-200 space-y-3"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-11 h-11 rounded-xl ${stat.bg} border ${stat.border} ${stat.color} flex items-center justify-center shrink-0`}
                            >
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium text-gray-500 block">
                                    {stat.label}
                                </span>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Main Content Card ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-[0_4px_20px_rgba(3,59,42,0.06)] overflow-hidden">
                {/* Filters Bar */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Filter by:
                        </span>
                        <FilterDropdown
                            label="Semua Rating"
                            options={["Semua Rating", "5", "4", "3", "2", "1"]}
                            value={ratingFilter}
                            onChange={(val) => {
                                setRatingFilter(val);
                                setCurrentPage(1);
                            }}
                        />
                        <FilterDropdown
                            label="Terbaru"
                            options={["Terbaru", "Rating Tertinggi", "Rating Terendah"]}
                            value={sortFilter}
                            onChange={(val) => {
                                setSortFilter(val);
                                setCurrentPage(1);
                            }}
                        />
                        <FilterDropdown
                            label="Semua Produk"
                            options={uniqueProducts}
                            value={productFilter}
                            onChange={(val) => {
                                setProductFilter(val);
                                setCurrentPage(1);
                            }}
                        />
                        <FilterDropdown
                            label="Semua Status"
                            options={["Semua Status", "Belum Dibalas", "Sudah Dibalas"]}
                            value={statusFilter}
                            onChange={(val) => {
                                setStatusFilter(val);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {unrepliedCount > 0 && (
                        <button
                            onClick={() => {
                                setStatusFilter("Belum Dibalas");
                                setCurrentPage(1);
                            }}
                            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0"
                        >
                            <Clock className="w-3.5 h-3.5" />
                            {unrepliedCount} ulasan belum dibalas
                        </button>
                    )}
                </div>

                {/* Feedback List */}
                <div className="p-5 space-y-4">
                    {paginatedFeedbacks.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <MessageSquareReply className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">Tidak ada ulasan ditemukan</p>
                            <p className="text-sm mt-1">
                                Coba ubah filter untuk melihat ulasan lainnya
                            </p>
                        </div>
                    ) : (
                        paginatedFeedbacks.map((item) => (
                            <FeedbackCard
                                key={item.id}
                                item={item}
                                onReply={(fb) => {
                                    setSelectedFeedback(fb);
                                    setDialogOpen(true);
                                }}
                            />
                        ))
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <span className="text-gray-400">
                        Menampilkan {paginatedFeedbacks.length} dari {filtered.length} ulasan
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="bg-[#1B4332] hover:bg-[#164029] disabled:opacity-40 text-white rounded-full px-4.5 py-2 font-medium transition cursor-pointer shadow-xs"
                        >
                            Sebelumnya
                        </button>
                        <div className="flex items-center gap-1.5 font-medium">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <span
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition ${
                                        pageNum === currentPage
                                            ? "bg-[#1B4332] text-white font-bold"
                                            : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    {pageNum}
                                </span>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="bg-[#1B4332] hover:bg-[#164029] disabled:opacity-40 text-white rounded-full px-4.5 py-2 font-medium transition cursor-pointer shadow-xs"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>

            {/* Reply Dialog */}
            <ReplyDialog
                open={dialogOpen}
                feedback={selectedFeedback}
                onOpenChange={(v) => {
                    setDialogOpen(v);
                    if (!v) setSelectedFeedback(null);
                }}
                onSubmit={handleReply}
            />
        </div>
    );
}
