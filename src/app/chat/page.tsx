'use client';

import dynamic from 'next/dynamic';
import { MOCK_USER_PROFILE } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import {
    Activity, Moon,
    ChevronLeft, Share2, Mic
} from 'lucide-react';
import {
    AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHeyGenAvatar } from '@/hooks/useHeyGen';
import { HEYGEN_CONFIG } from '@/lib/config';
import { Sidebar } from '@/components/dashboard/Sidebar';

const AvatarStream = dynamic(
    () => import('@/components/chat/AvatarStream').then(mod => ({ default: mod.AvatarStream })),
    { ssr: false }
);

// --- Mock Data Generators for Graphs ---

const generateECGData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
        // Simulating a heartbeat pattern
        const base = 60;
        let val = base + Math.random() * 5;
        if (i % 10 === 0) val += 40; // R-wave peak
        if (i % 10 === 1) val -= 10; // S-wave dip
        data.push({ time: i, mv: val });
    }
    return data;
};

const sleepData = [
    { day: 'Mon', hours: 6.2 }, { day: 'Tue', hours: 5.5 },
    { day: 'Wed', hours: 7.1 }, { day: 'Thu', hours: 6.0 },
    { day: 'Fri', hours: 5.8 }, { day: 'Sat', hours: 8.2 },
    { day: 'Sun', hours: 5.5 }, // Current
];

const calorieData = [
    { day: 'Mon', cal: 2100 }, { day: 'Tue', cal: 1950 },
    { day: 'Wed', cal: 2300 }, { day: 'Thu', cal: 1800 },
    { day: 'Fri', cal: 2400 }, { day: 'Sat', cal: 2600 },
    { day: 'Sun', cal: 2050 },
];

const stepsData = [
    { name: 'Steps', value: 1200 },
    { name: 'Remaining', value: 3800 },
];
const STEPS_COLORS = ['#3b82f6', '#f1f5f9']; // Blue-500, Slate-100

// --- Components ---

const WIDGET_COLORS: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50",
    indigo: "text-indigo-600 bg-indigo-50",
    purple: "text-purple-600 bg-purple-50",
    yellow: "text-yellow-600 bg-yellow-50",
};

const SoftWidget = ({ title, icon: Icon, children, className = "", color = "blue" }: any) => (
    <div className={`bg-white rounded-[1.5rem] shadow-sm border border-slate-50 p-5 relative overflow-hidden flex flex-col ${className}`}>
        <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${WIDGET_COLORS[color] || WIDGET_COLORS.blue}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            </div>
        </div>
        <div className="flex-1 w-full min-h-0 relative">
            {children}
        </div>
    </div>
);

export default function ChatPage() {
    const router = useRouter();
    const userData = MOCK_USER_PROFILE.wearableData;
    const [ecgData, setEcgData] = useState(generateECGData());

    // Real Avatar Hooks
    const { session, isLoading, videoRef, avatar, startSession, endSession } = useHeyGenAvatar(HEYGEN_CONFIG.AVATAR_ID);
    const [hasJoined, setHasJoined] = useState(false);

    const handleJoin = async () => {
        setHasJoined(true);
        await startSession();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            endSession();
        };
    }, [endSession]);

    // Simulate live ECG movement
    useEffect(() => {
        const interval = setInterval(() => {
            setEcgData(prev => {
                const newData = [...prev.slice(1), prev[0]]; // Rotate array
                return newData;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="h-screen w-full bg-slate-50 grid grid-cols-[80px_minmax(0,1fr)_400px] overflow-hidden font-sans">

            {/* 1. SIDEBAR (Left) */}
            <div className="h-full">
                <Sidebar />
            </div>

            {/* 2. CENTER - VIDEO STREAM */}
            <section className="relative bg-slate-100 flex items-center justify-center p-6 min-w-0 overflow-hidden">
                {/* Tablet Frame Container */}
                <div className="relative w-full max-w-4xl h-[90%] bg-black rounded-[2rem] shadow-2xl overflow-hidden ring-4 ring-slate-200">
                    <AvatarStream
                        isLoading={isLoading && hasJoined}
                        isConnected={session?.status === 'connected'}
                        videoRef={videoRef}
                        avatar={avatar}
                        onEndSession={endSession}
                    />

                    {/* Join Overlay - Only show if not joined */}
                    {!hasJoined && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={handleJoin}
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                            >
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <Mic size={24} />
                                </div>
                                Start Session
                            </motion.button>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. RIGHT - PROFESSIONAL DASHBOARD */}
            <aside className="bg-[#F5F7FA] border-l border-slate-200 flex flex-col h-full overflow-hidden">

                {/* Header */}
                <header className="p-6 flex items-center justify-between bg-[#F5F7FA] z-10 shrink-0">
                    <button onClick={() => router.push('/')} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="text-center">
                        <h2 className="font-bold text-slate-800">Amit Cohen</h2>
                        <p className="text-xs text-green-500 font-medium flex items-center justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                        </p>
                    </div>
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-blue-600">
                        <Share2 className="w-5 h-5" />
                    </button>
                </header>

                {/* Content Grid */}
                <div className="flex-1 p-6 pt-0 grid grid-cols-2 auto-rows-min gap-4 overflow-y-auto">

                    {/* Widget 1: Stress Level (Current) */}
                    <SoftWidget title="Stress Level (Current)" icon={Activity} color="orange" className="col-span-2 min-h-[140px]">
                        <div className="flex flex-col justify-center h-full gap-4">
                            <div className="flex justify-between items-end px-1">
                                <span className="text-3xl font-bold text-slate-800">High</span>
                                <span className="text-sm font-medium text-orange-500 animate-pulse">85/100</span>
                            </div>
                            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-[85%] bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>Low</span>
                                <span>Moderate</span>
                                <span>High</span>
                            </div>
                        </div>
                    </SoftWidget>

                    {/* Widget 2: Sleep Onset Latency (CSS Chart) */}
                    <SoftWidget title="Sleep Onset Latency" icon={Moon} color="blue" className="col-span-2 min-h-[220px]">
                        <div className="flex flex-col pt-1 pb-1 w-full">
                            {/* Top Section: Chart + Info */}
                            <div className="flex items-center justify-between gap-4 px-2">

                                {/* Left: CSS Donut Chart (Stable) */}
                                <div className="relative w-24 h-24 shrink-0 rounded-full" style={{ background: 'conic-gradient(#3b82f6 324deg, #f1f5f9 0deg)' }}>
                                    {/* Donut Hole */}
                                    <div className="absolute inset-[15%] bg-white rounded-full shadow-inner" />

                                    {/* Center Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                        <span className="text-3xl font-bold text-slate-800 leading-none">60</span>
                                        <span className="text-xs text-slate-500 font-bold">min</span>
                                    </div>
                                </div>

                                {/* Right: Icon + Text */}
                                <div className="flex flex-col items-center flex-1 text-center gap-3">
                                    <div className="w-12 h-12 bg-rose-400 rounded-xl flex items-center justify-center shadow-sm ring-4 ring-rose-50">
                                        <Moon className="text-white w-6 h-6 fill-white" />
                                    </div>
                                    <div className="text-sm font-semibold text-slate-600 leading-tight">
                                        higher than<br /><span className="text-slate-900 font-bold text-base">20 min</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Badge */}
                            <div className="w-full bg-emerald-50 border border-emerald-100 rounded-lg py-1.5 text-center mt-2 shrink-0">
                                <span className="text-emerald-700 font-bold text-xs tracking-wide uppercase">20 minute norm</span>
                            </div>
                        </div>
                    </SoftWidget>

                    {/* Widget 3: Voice Tone Analysis (Stacked) */}
                    <SoftWidget title="Voice Tone" icon={Mic} color="red" className="col-span-2 min-h-[180px]">
                        <div className="h-full w-full -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { t: 1, val: 30 }, { t: 2, val: 50 }, { t: 3, val: 45 },
                                    { t: 4, val: 80 }, { t: 5, val: 70 }, { t: 6, val: 110 }, { t: 7, val: 95 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorTone" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="t" hide />
                                    <YAxis
                                        domain={[0, 120]}
                                        ticks={[30, 60, 90, 120]}
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={30}
                                    />
                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="val" stroke="#ef4444" strokeWidth={2} fill="url(#colorTone)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="text-center mt-[-5px] pl-6">
                                <span className="text-xs font-bold text-red-500">Tense</span>
                            </div>
                        </div>
                    </SoftWidget>

                    {/* Widget 4: Analyzing Insight (Ultra Compact Notification) */}
                    <div className="col-span-2 bg-white rounded-xl shadow-sm border-l-4 border-indigo-500 p-3 flex items-center justify-between gap-4 min-h-[80px]">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
                                <Activity className="w-4 h-4" />
                            </div>
                            <p className="font-medium text-slate-700 text-xs leading-snug line-clamp-2">
                                <span className="font-bold text-indigo-600">Insight:</span> High cortisol levels detected. 10min breathing recommended.
                            </p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
                    </div>

                </div>
            </aside>

        </main>
    );
}
