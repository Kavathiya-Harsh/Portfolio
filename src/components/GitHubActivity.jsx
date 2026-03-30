import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, GitCommit, Star, GitFork, Clock, ExternalLink } from 'lucide-react';
import { slideInLeft, viewportOnce } from '../utils/motion';

const GITHUB_USERNAME = 'Kavathiya-Harsh';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Skeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4">
      <div className="w-10 h-10 bg-white/10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

const EVENT_CONFIG = {
  PushEvent: {
    icon: GitCommit,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/20',
    label: (e) => e.payload?.commits?.[0]?.message || 'Pushed commits'
  },
  WatchEvent: {
    icon: Star,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/15',
    border: 'border-yellow-500/20',
    label: () => 'Starred a repository'
  },
  CreateEvent: {
    icon: Github,
    color: 'text-green-400',
    bg: 'bg-green-500/15',
    border: 'border-green-500/20',
    label: (e) => `Created ${e.payload.ref_type || 'repository'}`
  },
  ForkEvent: {
    icon: GitFork,
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/20',
    label: () => 'Forked a repository'
  }
};

export default function GitHubActivity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=15`)
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const filtered = data
          .filter((e) => EVENT_CONFIG[e.type])
          .slice(0, 3);
        setEvents(filtered);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="activity" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-[#080d1a]">
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-5xl mx-auto"
      >
        <div className="relative group overflow-hidden rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-5 hover:border-blue-500/20 transition-all duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(400px circle at 50% 50%, rgba(59,130,246,0.05), transparent 70%)' }} />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800/50 border border-white/12">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">GitHub Activity</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500">@{GITHUB_USERNAME}</p>
              </div>
            </div>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {loading && <Skeleton />}

          {error && (
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Github className="w-4 h-4" />
              {error === 'GitHub API: 403'
                ? 'Rate-limited. Most features work best with dynamic data.'
                : `Could not load activity. Connect your GitHub for live updates.`}
            </p>
          )}

          {!loading && !error && events.length === 0 && (
            <p className="text-xs text-slate-500">No recent public activity found.</p>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="space-y-3">
              {events.map((event, i) => {
                const config = EVENT_CONFIG[event.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${config.bg} border ${config.border} shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-300 font-mono truncate">{config.label(event)}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] ${config.color} font-mono uppercase tracking-tighter`}>{event.repo.name.split('/')[1]}</span>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {timeAgo(event.created_at)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
