"use client";

import React, { useState } from "react";
import { Search, Send, MessageSquare, Check, CheckCheck, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "customer" | "admin";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: "Online" | "Offline";
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Amira",
    status: "Online",
    lastMessage: "Kamu Mantep Masssss",
    time: "12:13",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Halo Harvesta! Paket sayurnya baru aja nyampe nih, seger banget gila. Makasih yaa!",
        time: "10:45 AM",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Halo Kak Amira! Alhamdulillah kalo suka, makasih banyak ya ulasannya!",
        time: "10:50 AM",
        status: "read",
      },
      {
        id: "m3",
        sender: "customer",
        text: "Kamu Mantep Masssss",
        time: "12:13 PM",
      },
    ],
  },
  {
    id: "2",
    name: "Zulfan Falah",
    status: "Online",
    lastMessage: "masuk",
    time: "08:13",
    unreadCount: 0,
    messages: [
      {
        id: "m4_1",
        sender: "customer",
        text: "test",
        time: "08:10 AM",
      },
      {
        id: "m4_2",
        sender: "admin",
        text: "ya ada",
        time: "08:11 AM",
        status: "read",
      },
      {
        id: "m4_3",
        sender: "admin",
        text: "tes lagi",
        time: "08:12 AM",
        status: "read",
      },
      {
        id: "m4_4",
        sender: "customer",
        text: "masuk",
        time: "08:13 AM",
      },
    ],
  },
  {
    id: "3",
    name: "Raihan Tani",
    status: "Offline",
    lastMessage: "Aman kak, ntar malem gw kirim datanya ya.",
    time: "Kemarin",
    unreadCount: 0,
    messages: [
      {
        id: "m5",
        sender: "admin",
        text: "Bisa tolong siapin data panen buat tomat besok?",
        time: "04:10 PM",
        status: "read",
      },
      {
        id: "m6",
        sender: "customer",
        text: "Aman kak, ntar malem gw kirim datanya ya.",
        time: "04:15 PM",
      },
    ],
  },
  {
    id: "4",
    name: "Pak Aruna",
    status: "Offline",
    lastMessage: "Pupuk organiknya udah dikirim ya kak, ditunggu nyampenya.",
    time: "20/07",
    unreadCount: 0,
    messages: [
      {
        id: "m7",
        sender: "customer",
        text: "Pupuk organiknya udah dikirim ya kak, ditunggu nyampenya.",
        time: "11:20 AM",
      },
    ],
  },
];

const quickReplies = [
  "Makasih masukannya ya!",
  "Sorry banget atas ketidaknyamanannya.",
  "Pesanan langsung kita kirim kok.",
];

export default function ChatPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  // Filter contacts based on search and unread filter
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnread = !filterUnread || contact.unreadCount > 0;
    return matchesSearch && matchesUnread;
  });

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    // Mark as read when selected
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedContactId) return;

    const newMessage: Message = {
      id: `m-new-${Date.now()}`,
      sender: "admin",
      text: messageText,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: "read",
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: messageText,
            time: "Baru saja",
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setMessageText("");
  };

  const handleQuickReply = (text: string) => {
    if (!selectedContactId) return;
    const newMessage: Message = {
      id: `m-new-${Date.now()}`,
      sender: "admin",
      text: text,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: "read",
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: text,
            time: "Baru saja",
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="w-full h-[calc(100vh-160px)] min-h-[500px] grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* ── Left Sidebar: Chat Contacts List ─────────────────────── */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col h-full space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kontak, petani, dan pesan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Selection Tabs */}
        <div className="bg-[#eefcf4] p-1 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1 self-start">
          <button
            onClick={() => setFilterUnread(false)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
              !filterUnread
                ? "bg-[#1B4332] text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterUnread(true)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1 ${
              filterUnread
                ? "bg-[#1B4332] text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Unread
            {contacts.some((c) => c.unreadCount > 0) && (
              <span className="w-2 h-2 rounded-full bg-[#d40005] animate-pulse" />
            )}
          </button>
        </div>

        {/* Contacts Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filteredContacts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-4 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-40 text-emerald-800" />
              <p className="text-xs font-semibold">Tidak ada percakapan</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                className={`w-full flex items-center gap-3.5 p-3 transition-all cursor-pointer text-left ${
                  selectedContactId === contact.id
                    ? "bg-[#eefcf4] border-l-4 border-[#1B4332] rounded-r-xl rounded-l-none shadow-2xs"
                    : "hover:bg-gray-50 rounded-xl border-l-4 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.status === "Online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-800 truncate">
                      {contact.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                      {contact.time}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-1 ${
                    contact.unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-500"
                  }`}>
                    {contact.lastMessage}
                  </p>
                </div>

                {/* Unread count badge */}
                {contact.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#1B4332] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    {contact.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right Content Area: Active Chat Conversation ────────── */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 lg:col-span-2 flex flex-col h-full overflow-hidden relative">
        
        {/* Subtle Decorative Arc Overlay */}
        <div className="absolute -top-16 -right-16 w-60 h-60 pointer-events-none opacity-20 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 240 240" fill="none">
            <circle cx="240" cy="0" r="200" fill="url(#chatArc)" opacity="0.4" />
            <circle cx="240" cy="0" r="130" fill="url(#chatArc)" opacity="0.6" />
            <defs>
              <linearGradient id="chatArc" x1="240" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#52b788" />
                <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {selectedContact ? (
          <>
            {/* Header info */}
            <div className="border-b border-gray-100 pb-3 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {selectedContact.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  {selectedContact.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedContact.status === "Online" ? "bg-emerald-500" : "bg-gray-400"
                  }`} />
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {selectedContact.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar relative z-10">
              {selectedContact.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "admin" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "admin"
                        ? "bg-[#1B4332] text-white shadow-2xs rounded-tr-xs"
                        : "bg-gray-100 text-gray-800 rounded-tl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-semibold px-1">
                    <span>{msg.time}</span>
                    {msg.sender === "admin" && (
                      <span className="text-emerald-600">
                        {msg.status === "read" ? (
                          <CheckCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies templates */}
            <div className="flex flex-wrap items-center gap-2 pt-2 pb-3 border-t border-gray-100 relative z-10">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-emerald-100/60 transition cursor-pointer shadow-3xs"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Message Reply Form */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 relative z-10"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ketik balasan..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-[#f3f4f6] text-xs text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1B4332] hover:bg-[#05543c] text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Empty Chat Welcome State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1B4332] shadow-2xs relative">
              <MessageSquare className="w-8 h-8" />
              <Sparkles className="w-4 h-4 text-emerald-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h2 className="text-base font-bold text-gray-800">
                Kotak Pesan Pembeli
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                Kelola seluruh percakapan dan pertanyaan dari pembeli
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
