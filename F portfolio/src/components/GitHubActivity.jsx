import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, GitCommit, Star, GitFork, Clock, ExternalLink } from 'lucide-react';

// ← Replace with your real GitHub username
const GITHUB_USERNAME = 'your-github-username';

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

export default function GitHubActivity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=5`)
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const pushEvents = data.filter((e) => e.type === 'PushEvent').slice(0, 3);
        setEvents(pushEvents);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto px-6 pb-4"
    >
      <div className="relative group overflow-hidden rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-5 hover:border-green-500/20 transition-all duration-300">
        {/* Live glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(400px circle at 50% 50%, rgba(34,197,94,0.05), transparent 70%)' }} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800/50 border border-white/12">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">GitHub Activity</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
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
              ? 'Rate-limited — check back shortly.'
              : `Could not load activity. Set your username to see live commits.`}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-xs text-slate-500">No recent push events found.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-3">
            {events.map((event) => {
              const commit = event.payload?.commits?.[0];
              if (!commit) return null;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20 shrink-0">
                    <GitCommit className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-300 font-mono truncate">{commit.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-blue-400 font-mono">{event.repo.name}</span>
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
  );
}
