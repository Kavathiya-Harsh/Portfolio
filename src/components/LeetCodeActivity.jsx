import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Flame from 'lucide-react/dist/esm/icons/flame';
import { usePerformance } from '../context/PerformanceContext';

const PROFILE_API = 'https://alfa-leetcode-api.onrender.com/userProfile/Harsh_Kavathiya';
const CALENDAR_API = 'https://alfa-leetcode-api.onrender.com/Harsh_Kavathiya/calendar';
const BADGES_API = 'https://alfa-leetcode-api.onrender.com/Harsh_Kavathiya/badges';
const PROFILE_URL = 'https://leetcode.com/u/Harsh_Kavathiya/';

const COLOR_EASY = '#22d3ee';
const COLOR_MED = '#60a5fa';
const COLOR_HARD = '#c084fc';
const COLOR_BG = 'rgba(15, 23, 42, 0.7)';
const COLOR_PANEL = 'rgba(30, 41, 59, 0.8)';

function generateHeatmap(submissionCalendar) {
  const countsByDate = {};
  if (submissionCalendar) {
    let parsed = typeof submissionCalendar === 'string' ? JSON.parse(submissionCalendar) : submissionCalendar;
    Object.entries(parsed).forEach(([ts, count]) => {
      const d = new Date(parseInt(ts) * 1000);
      const dateStr = d.toISOString().split('T')[0];
      countsByDate[dateStr] = count;
    });
  }

  const today = new Date();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: d, count: countsByDate[dateStr] || 0 });
  }

  const weeks = [];
  let week = [];
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length) weeks.push(week);
  return weeks;
}

function getHeatmapColor(count) {
  if (count === 0) return '#1e2937';
  if (count <= 2) return '#67e8f9';
  if (count <= 4) return '#22d3ee';
  if (count <= 7) return '#06b6d4';
  return '#0e7490';
}

/* ==================== CIRCULAR + STATS ==================== */
function StatsCard({ profile }) {
  if (!profile) return null;

  const total = profile.totalSolved || 0;
  const easy = profile.easySolved || 0;
  const med = profile.mediumSolved || 0;
  const hard = profile.hardSolved || 0;
  const submissions = profile.totalSubmissions?.[0]?.submissions || 0;
  const acceptance = submissions > 0 ? ((total / submissions) * 100).toFixed(1) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-8 shadow-xl border"
      style={{ background: COLOR_BG, borderColor: 'rgba(148,163,184,0.1)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Total Solved - Hero */}
        <div className="text-center md:text-left flex-shrink-0">
          <div className="text-7xl font-bold text-white tracking-tighter">{total}</div>
          <div className="text-xl text-slate-400 -mt-2">Problems Solved</div>
          <div className="mt-4 text-4xl font-semibold text-emerald-400">{acceptance}% <span className="text-base text-slate-400">acceptance</span></div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="flex-1 grid grid-cols-3 gap-4 w-full">
          {[
            { label: 'Easy', value: easy, total: profile.totalEasy, color: COLOR_EASY },
            { label: 'Medium', value: med, total: profile.totalMedium, color: COLOR_MED },
            { label: 'Hard', value: hard, total: profile.totalHard, color: COLOR_HARD },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 text-center"
              style={{ background: COLOR_PANEL }}
            >
              <div style={{ color: item.color }} className="font-medium text-sm mb-1">{item.label}</div>
              <div className="text-4xl font-bold text-white">{item.value}</div>
              <div className="text-xs text-slate-500">/{item.total}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ==================== BADGES ==================== */
function BadgesCard({ badgesData }) {
  if (!badgesData?.badges?.length) return null;

  const recent = badgesData.badges[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-8 h-full flex flex-col shadow-xl border"
      style={{ background: COLOR_BG, borderColor: 'rgba(148,163,184,0.1)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span className="text-lg font-semibold text-white">Badges</span>
        </div>
        <span className="text-4xl font-bold text-white">{badgesData.badgesCount}</span>
      </div>

      {recent && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <img
            src={recent.icon}
            alt={recent.displayName}
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
          <p className="text-center mt-6 text-white font-medium">{recent.displayName}</p>
          <p className="text-xs text-slate-400">Most Recent Badge</p>
        </div>
      )}

      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center gap-2 text-slate-400 hover:text-white text-sm group"
      >
        View all on LeetCode
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </a>
    </motion.div>
  );
}

/* ==================== HEATMAP GRAPH ==================== */
function HeatmapCard({ calendarData, profile }) {
  if (!calendarData) return null;

  const weeks = useMemo(() => generateHeatmap(calendarData.submissionCalendar), [calendarData]);
  const totalSubs = profile?.totalSubmissions?.[0]?.submissions || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-8 shadow-xl border"
      style={{ background: COLOR_BG, borderColor: 'rgba(148,163,184,0.1)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Flame className="w-7 h-7 text-orange-400" />
            <span className="text-3xl font-bold text-white">{totalSubs}</span>
          </div>
          <p className="text-slate-400">Submissions • Last 365 days</p>
        </div>
        <div className="text-right text-sm">
          <div>Streak: <span className="font-semibold text-orange-400">{calendarData.streak || 0}</span></div>
          <div>Active Days: <span className="font-semibold">{calendarData.totalActiveDays || 0}</span></div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1 min-w-[720px]">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map((day, j) => (
                <motion.div
                  key={j}
                  whileHover={{ scale: 1.6 }}
                  className="w-3 h-3 rounded-sm transition-all cursor-pointer"
                  style={{ backgroundColor: getHeatmapColor(day.count) }}
                  title={`${day.count} submissions on ${day.date.toLocaleDateString()}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-500 mt-4 px-1">
        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
      </div>
    </motion.div>
  );
}

/* ==================== MAIN COMPONENT ==================== */
export default function LeetCodeActivity() {
  const [profile, setProfile] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLowPower } = usePerformance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c, b] = await Promise.all([
          fetch(PROFILE_API),
          fetch(CALENDAR_API),
          fetch(BADGES_API)
        ]);
        setProfile(await p.json());
        setCalendar(await c.json());
        setBadges(await b.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-80 rounded-3xl bg-slate-800/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 rounded-3xl bg-slate-800/50" />
            <div className="h-96 rounded-3xl bg-slate-800/50" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 max-w-5xl mx-auto px-4 sm:px-6" id="leetcode">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-bold text-white flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
            className="w-9 h-9 brightness-0 invert" alt="LC" />
          LeetCode Profile
        </h2>
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-white">
          Harsh_Kavathiya <ExternalLink size={16} />
        </a>
      </div>

      <div className="space-y-8">
        <StatsCard profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BadgesCard badgesData={badges} />
          <HeatmapCard calendarData={calendar} profile={profile} />
        </div>
      </div>
    </section>
  );
}