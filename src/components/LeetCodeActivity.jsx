import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { usePerformance } from '../context/PerformanceContext';

const PROFILE_API = 'https://alfa-leetcode-api.onrender.com/userProfile/Harsh_Kavathiya';
const CALENDAR_API = 'https://alfa-leetcode-api.onrender.com/Harsh_Kavathiya/calendar';
const BADGES_API = 'https://alfa-leetcode-api.onrender.com/Harsh_Kavathiya/badges';
const PROFILE_URL = 'https://leetcode.com/u/Harsh_Kavathiya/';

// Premium Theme Colors
const COLOR_EASY = '#06b6d4';   // Cyan 500
const COLOR_MED = '#3b82f6';    // Blue 500
const COLOR_HARD = '#8b5cf6';   // Purple 500
const COLOR_BG = 'rgba(15, 23, 42, 0.4)';
const COLOR_PANEL = 'rgba(30, 41, 59, 0.5)';

/* ─── Heatmap Helper ──────────────────────────────────────────────────────── */
function generateHeatmap(submissionCalendar) {
  // Convert API timestamps to YYYY-MM-DD map
  const countsByDate = {};
  if (submissionCalendar) {
    let parsed = {};
    try {
      parsed = typeof submissionCalendar === 'string' ? JSON.parse(submissionCalendar) : submissionCalendar;
    } catch (e) { }
    Object.entries(parsed).forEach(([ts, count]) => {
      const d = new Date(parseInt(ts) * 1000);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      countsByDate[dateString] = count;
    });
  }

  // Generate last 364 days
  const today = new Date();
  // Align to end on Saturday for a clean grid ending (optional, but standard for github)
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const count = countsByDate[dateString] || 0;
    days.push({ date: d, count });
  }

  // Split into weeks (arrays of 7 days)
  const weeks = [];
  let currentWeek = [];
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function getLevelColor(count) {
  if (count === 0) return 'rgba(30, 41, 59, 0.5)'; // slate-800 transparent
  if (count <= 1) return '#0e7490'; // cyan-700
  if (count <= 3) return '#0891b2'; // cyan-600
  if (count <= 5) return '#06b6d4'; // cyan-500
  return '#22d3ee'; // cyan-400
}

/* ─── Circular Progress SVG ───────────────────────────────────────────────── */
function CircularProgress({ profileData }) {
  if (!profileData) return null;

  const totalSolved = profileData.totalSolved || 1;
  const easy = profileData.easySolved || 0;
  const medium = profileData.mediumSolved || 0;
  const hard = profileData.hardSolved || 0;
  const submissions = profileData.totalSubmissions?.[0]?.submissions || 0;

  // Calculate acceptance rate
  const acceptanceRate = submissions > 0 ? ((totalSolved / submissions) * 100).toFixed(2) : '0.00';

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  // Calculate arc lengths based on solved ratio (add gap)
  const gap = 4;
  const easyLength = (easy / totalSolved) * circumference - gap;
  const medLength = (medium / totalSolved) * circumference - gap;
  const hardLength = (hard / totalSolved) * circumference - gap;

  // Offsets
  const easyOffset = circumference * 0.25; // start at bottom left
  const medOffset = easyOffset - easyLength - gap;
  const hardOffset = medOffset - medLength - gap;

  return (
    <div className="flex items-center gap-6 rounded-3xl p-6 shadow-lg border border-slate-700/50"
      style={{ background: COLOR_BG, backdropFilter: 'blur(20px)' }}>
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background track */}
          <circle cx="80" cy="80" r={radius} fill="transparent" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="4" />

          {/* Easy Arc */}
          {easy > 0 && (
            <circle cx="80" cy="80" r={radius} fill="transparent" stroke={COLOR_EASY} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${Math.max(0, easyLength)} ${circumference}`} strokeDashoffset={easyOffset} />
          )}
          {/* Medium Arc */}
          {medium > 0 && (
            <circle cx="80" cy="80" r={radius} fill="transparent" stroke={COLOR_MED} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${Math.max(0, medLength)} ${circumference}`} strokeDashoffset={medOffset} />
          )}
          {/* Hard Arc */}
          {hard > 0 && (
            <circle cx="80" cy="80" r={radius} fill="transparent" stroke={COLOR_HARD} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${Math.max(0, hardLength)} ${circumference}`} strokeDashoffset={hardOffset} />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">{Math.floor(acceptanceRate)}</span>
            <span className="text-lg text-white">.{acceptanceRate.split('.')[1]}%</span>
          </div>
          <span className="text-[11px] text-slate-400">Acceptance</span>
          <span className="text-[11px] text-slate-400 mt-3">{submissions} submission</span>
        </div>
      </div>

      {/* Side Stats */}
      <div className="flex flex-col gap-2.5 flex-1">
        <div className="rounded-xl p-3 flex flex-col items-center justify-center border border-slate-700/30" style={{ background: COLOR_PANEL }}>
          <span className="text-[13px] font-medium" style={{ color: COLOR_EASY }}>Easy</span>
          <span className="text-white text-sm font-semibold">{easy}<span className="text-slate-500 font-normal text-xs ml-1">/{profileData.totalEasy}</span></span>
        </div>
        <div className="rounded-xl p-3 flex flex-col items-center justify-center border border-slate-700/30" style={{ background: COLOR_PANEL }}>
          <span className="text-[13px] font-medium" style={{ color: COLOR_MED }}>Med.</span>
          <span className="text-white text-sm font-semibold">{medium}<span className="text-slate-500 font-normal text-xs ml-1">/{profileData.totalMedium}</span></span>
        </div>
        <div className="rounded-xl p-3 flex flex-col items-center justify-center border border-slate-700/30" style={{ background: COLOR_PANEL }}>
          <span className="text-[13px] font-medium" style={{ color: COLOR_HARD }}>Hard</span>
          <span className="text-white text-sm font-semibold">{hard}<span className="text-slate-500 font-normal text-xs ml-1">/{profileData.totalHard}</span></span>
        </div>
      </div>
    </div>
  );
}

/* ─── Badges Component ────────────────────────────────────────────────────── */
function BadgesWidget({ badgesData }) {
  if (!badgesData || !badgesData.badges) return null;
  const badgeCount = badgesData.badgesCount || 0;
  const recentBadge = badgesData.badges[0];

  return (
    <div className="rounded-3xl p-6 shadow-lg relative h-full flex flex-col border border-slate-700/50"
      style={{ background: COLOR_BG, backdropFilter: 'blur(20px)' }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-slate-300">Badges</span>
        <ArrowRight className="w-5 h-5 text-slate-400" />
      </div>
      <span className="text-2xl font-bold text-white mb-4">{badgeCount}</span>

      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        {recentBadge && (
          <img src={recentBadge.icon} alt={recentBadge.displayName} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
        )}
      </div>

      <div>
        <div className="text-[11px] text-slate-400 mb-0.5">Most Recent Badge</div>
        <div className="text-sm font-semibold text-white">{recentBadge?.displayName || 'None'}</div>
      </div>
    </div>
  );
}

/* ─── Calendar Component ──────────────────────────────────────────────────── */
function CalendarWidget({ calendarData, profileData }) {
  if (!calendarData) return null;

  const submissions = profileData?.totalSubmissions?.[0]?.submissions || 0;
  const weeks = useMemo(() => generateHeatmap(calendarData.submissionCalendar), [calendarData.submissionCalendar]);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="rounded-3xl p-6 shadow-lg mt-4 w-full overflow-x-auto custom-scrollbar border border-slate-700/50"
      style={{ background: COLOR_BG, backdropFilter: 'blur(20px)' }}>
      <div className="flex justify-between items-center mb-6 min-w-[600px]">
        <div className="text-[13px] text-slate-300">
          <span className="text-white font-bold text-lg">{submissions}</span> submissions in the past one year <span className="text-slate-500">ⓘ</span>
        </div>
        <div className="text-[12px] text-slate-400 flex gap-4">
          <span>Total active days: <span className="text-white font-semibold">{calendarData.totalActiveDays || 0}</span></span>
          <span>Max streak: <span className="text-white font-semibold">{calendarData.streak || 0}</span></span>
        </div>
      </div>

      <div className="flex flex-col min-w-[700px]">
        <div className="flex gap-[3px]">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {week.map((day, j) => (
                <div
                  key={j}
                  className="w-3 h-3 rounded-[2px]"
                  style={{ backgroundColor: getLevelColor(day.count) }}
                  title={`${day.count} submissions on ${day.date.toDateString()}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[11px] text-slate-400 w-full pr-4">
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function LeetCodeActivity() {
  const [profile, setProfile] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLowPower } = usePerformance();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profRes, calRes, badgeRes] = await Promise.all([
          fetch(PROFILE_API),
          fetch(CALENDAR_API),
          fetch(BADGES_API)
        ]);
        setProfile(await profRes.json());
        setCalendar(await calRes.json());
        setBadges(await badgeRes.json());
      } catch (err) {
        console.error('Failed to fetch LeetCode data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <section className="relative py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 z-10" id="leetcode">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-6 h-6 brightness-0 invert opacity-90" />
          LeetCode Profile
        </h2>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          Harsh_Kavathiya <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 rounded-3xl" style={{ background: COLOR_BG }} />
            <div className="h-48 rounded-3xl" style={{ background: COLOR_BG }} />
          </div>
          <div className="h-40 rounded-3xl" style={{ background: COLOR_BG }} />
        </div>
      ) : (
        <motion.div
          initial={isLowPower ? { opacity: 1 } : { opacity: 0, y: 15 }}
          whileInView={isLowPower ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <CircularProgress profileData={profile} />
            </div>
            <div className="md:col-span-2">
              <BadgesWidget badgesData={badges} />
            </div>
          </div>

          <CalendarWidget calendarData={calendar} profileData={profile} />
        </motion.div>
      )}
    </section>
  );
}
