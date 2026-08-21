"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { History, Search, MessageCircle, Calendar, ChevronRight, ArrowLeft, Clock, MessageSquare, AlertCircle } from "lucide-react";
import { fetchSessions, fetchSessionMessages, ChatSession, ChatMessage } from "@/lib/api/chat-history";

export default function ChatHistoryPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Loading and search states
  const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat sessions on mount or when userId is available
  useEffect(() => {
    if (userId) {
      loadSessions();
    }
  }, [userId]);

  // Load messages when a session is selected
  useEffect(() => {
    if (userId && selectedSessionId) {
      loadMessages();
    }
  }, [userId, selectedSessionId]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessions = async () => {
    if (!userId) return;
    setLoadingSessions(true);
    const data = await fetchSessions(userId);
    // Sort sessions by updated_at desc (newest first)
    const sorted = [...data].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    setSessions(sorted);
    setLoadingSessions(false);
  };

  const loadMessages = async () => {
    if (!userId || !selectedSessionId) return;
    setLoadingMessages(true);
    const data = await fetchSessionMessages(userId, selectedSessionId);
    // Sort messages chronologically (oldest to newest)
    const sorted = [...data].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    setMessages(sorted);
    setLoadingMessages(false);
  };

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
  };

  const handleBackToList = () => {
    setSelectedSessionId(null);
    setMessages([]);
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  // Formatter helpers
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#241F35]">
      {/* Background clouds and gradient vignette */}
      <Image
        src="/images/background.png"
        alt="Atmospheric Background"
        fill
        priority
        className="object-cover object-center pointer-events-none select-none opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#100720]/60 to-[#100720]/90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-20 pb-6 md:pl-72 md:pr-8">
        
        {/* Title Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <History className="text-amber-400" size={32} />
            Chat History
          </h1>
          <p className="text-slate-300 mt-2">Browse your past conversations and reflections with Buddy.</p>
        </header>

        {/* Dynamic single-panel layout toggled by selectedSessionId */}
        <div className="flex-grow flex items-center justify-center">
          
          {!selectedSessionId ? (
            /* PANEL 1: Sessions List View (Initial State) */
            <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 overflow-hidden h-[70vh] lg:h-[calc(100vh-200px)] flex flex-col gap-4 animate-in fade-in duration-300">
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Your Conversations</h2>
                <span className="text-xs font-mono text-slate-400">Total: {filteredSessions.length}</span>
              </div>

              {/* Search input */}
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved chat titles..."
                  className="w-full bg-slate-950/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>

              {/* Sessions list wrapper */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                {loadingSessions ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                    <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
                    <span className="text-xs font-medium">Retrieving timeline logs...</span>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 px-4 bg-slate-800/10 rounded-xl border border-white/5 text-center">
                    <MessageSquare className="text-slate-500 mb-2" size={28} />
                    <p className="text-slate-400 text-sm">
                      {searchQuery ? "No matching conversations found." : "No saved chat logs found."}
                    </p>
                  </div>
                ) : (
                  filteredSessions.map((sessionItem) => (
                    <button
                      key={sessionItem.id}
                      type="button"
                      onClick={() => handleSelectSession(sessionItem.id)}
                      className="w-full text-left p-4 rounded-xl border bg-slate-950/30 border-white/5 hover:bg-slate-950/50 hover:border-white/10 hover:scale-[1.005] transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors truncate block">
                            {sessionItem.title}
                          </span>
                          {sessionItem.is_active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Active session" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Calendar size={11} className="shrink-0" />
                          <span>Started on {formatDate(sessionItem.created_at)}</span>
                        </div>
                      </div>

                      <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* PANEL 2: Active Chat Messages Detail View (Rendered after selecting a session) */
            selectedSession && (
              <div className="w-full max-w-3xl bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-[70vh] lg:h-[calc(100vh-200px)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header detail with Back Button */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/20">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBackToList}
                      className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                          {selectedSession.title}
                        </h2>
                        {selectedSession.is_active ? (
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-500/10 text-slate-400 border border-slate-500/25 rounded-md">
                            Closed
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        Logged on {formatDate(selectedSession.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Resume chat action */}
                  {selectedSession.is_active && (
                    <Link
                      href="/buddy"
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/15"
                    >
                      <MessageCircle size={14} />
                      Resume
                    </Link>
                  )}
                </div>

                {/* Message logs */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 custom-scrollbar">
                  {loadingMessages ? (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
                      <span className="text-sm">Recalling memories...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-65 text-center px-4">
                      <AlertCircle size={32} className="text-slate-500" />
                      <h4 className="font-bold text-white">Empty Session</h4>
                      <p className="text-xs text-slate-300 max-w-xs">There are no messages logged for this session.</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={msg.id}
                          className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex flex-col gap-1 max-w-[82%] sm:max-w-[70%] ${
                              isUser ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isUser
                                  ? "bg-indigo-600/35 border border-indigo-500/20 text-white rounded-tr-none shadow-md"
                                  : "bg-white/10 border border-white/10 text-white rounded-tl-none shadow-sm"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            
                            <span className="text-[10px] text-slate-500 font-mono px-1">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

              </div>
            )
          )}

        </div>
      </div>
    </main>
  );
}
