"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Clock, Plus, BrainCircuit, ArrowRight, X } from "lucide-react";
import { fetchTasks, createTask, predictTimeline } from "@/lib/api/timeline";
import { TimelineTask, PredictionResponse } from "@/types/timeline";

export default function AlternateTimelinePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // New task form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  useEffect(() => {
    // Set default date to today
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  const loadTasks = async () => {
    if (!userId) return;
    const data = await fetchTasks(userId);
    setTasks(data);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Combine date and time for ISO strings
    const startIso = new Date(`${date}T${startTime}:00`).toISOString();
    const endIso = new Date(`${date}T${endTime}:00`).toISOString();

    const success = await createTask({
      user_id: userId,
      title,
      description,
      date,
      start_time: startIso,
      end_time: endIso,
    });

    if (success) {
      setIsAdding(false);
      setTitle("");
      setDescription("");
      loadTasks();
    }
  };

  const handlePredict = async (task: TimelineTask) => {
    if (!userId) return;
    setSelectedTask(task);
    setIsPredicting(true);
    setPrediction(null);
    
    // Simulating "complete" scenario as requested by user's example
    const result = await predictTimeline(userId, task.task_id, "complete");
    setPrediction(result);
    setIsPredicting(false);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#241F35]">
      {/* Atmospheric Cloud Background */}
      <Image
        src="/images/background.png"
        alt="Atmospheric Background"
        fill
        priority
        className="object-cover object-center pointer-events-none select-none opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#100720]/60 to-[#100720]/90 pointer-events-none" />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-20 pb-8 md:pl-72 md:pr-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <Clock className="text-blue-400" size={32} />
            Alternate Timeline
          </h1>
          <p className="text-slate-300 mt-2">See how your daily choices ripple into the future.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full flex-grow">
          
          {/* Left Panel: Tasks */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Tasks</h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                {isAdding ? <X size={16} /> : <Plus size={16} />}
                {isAdding ? "Cancel" : "Add Task"}
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleCreateTask} className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col gap-3 animate-in fade-in zoom-in duration-300">
                <input 
                  required
                  placeholder="Task Title (e.g. Angry memories)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input 
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg mt-2 text-sm transition">
                  Save Task
                </button>
              </form>
            )}

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-10 custom-scrollbar max-h-[60vh] lg:max-h-[calc(100vh-200px)]">
              {tasks.length === 0 && !isAdding && (
                <div className="text-slate-400 text-sm p-4 bg-slate-800/30 rounded-xl border border-white/5 text-center">
                  No tasks planned yet. Add one to simulate its future!
                </div>
              )}
              {tasks.map(task => (
                <div 
                  key={task.task_id}
                  onClick={() => handlePredict(task)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${selectedTask?.task_id === task.task_id ? 'bg-blue-900/40 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-800/40 border-white/10 hover:bg-slate-800/60'}`}
                >
                  <h3 className="text-white font-bold text-lg">{task.title}</h3>
                  <div className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                    <span>{task.date}</span>
                    <span>•</span>
                    <span>{new Date(task.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(task.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Simulation */}
          <div className="lg:col-span-8 flex flex-col h-[60vh] lg:h-[calc(100vh-160px)] bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 lg:p-10 relative overflow-hidden">
            {!selectedTask ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center opacity-60">
                <BrainCircuit size={64} className="text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a task to simulate</h3>
                <p className="text-slate-300 max-w-sm">Tap on any task from the left to predict how it might ripple through your alternate timeline.</p>
              </div>
            ) : isPredicting ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Running Simulation...</h3>
                <p className="text-slate-400">Analyzing alternate realities based on your decision.</p>
              </div>
            ) : prediction ? (
              <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 lg:pr-4">
                
                {/* Header context */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    Scenario: {prediction.scenario.decision}
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-4">{selectedTask.title}</h2>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                      {prediction.baseline.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Events */}
                <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-10 mb-10 ml-2">
                  {prediction.events.map((ev, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[33px] md:-left-[41px] w-4 h-4 rounded-full bg-blue-500 border-4 border-[#1c162b] shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                      
                      <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 hover:bg-slate-800/80 transition-colors">
                        <span className="text-blue-400 font-bold text-sm tracking-wide">{ev.time}</span>
                        <h4 className="text-white font-semibold text-lg mt-1 mb-2 leading-snug">{ev.event}</h4>
                        <div className="flex gap-2 items-start text-sm mt-3">
                          <ArrowRight className="text-amber-400 shrink-0 mt-0.5" size={16} />
                          <p className="text-slate-300 leading-relaxed font-medium">{ev.likely_effect}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Footer */}
                <div className="mt-auto bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6">
                  <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                    <BrainCircuit size={18} />
                    Simulation Summary
                  </h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {prediction.summary}
                  </p>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
