import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: "React", level: "Expert", size: "md:col-span-2 md:row-span-2", color: "from-cyan-400 to-blue-500", desc: "Building scalable, high-performance web applications with hooks, context, and modern patterns." },
  { name: "JavaScript", level: "Advanced", size: "md:col-span-1 md:row-span-1", color: "from-yellow-400 to-orange-500", desc: "Deep understanding of ES6+, async patterns, and performance." },
  { name: "Tailwind CSS", level: "Expert", size: "md:col-span-1 md:row-span-2", color: "from-teal-400 to-emerald-500", desc: "Crafting beautiful, responsive, and maintainable utility-first designs." },
  { name: "Node.js", level: "Intermediate", size: "md:col-span-2 md:row-span-1", color: "from-green-400 to-cyan-500", desc: "Developing efficient server-side logic and robust RESTful APIs." },
  { name: "Trading Logic", level: "Advanced", size: "md:col-span-2 md:row-span-1", color: "from-blue-600 to-indigo-600", desc: "Expertise in quantitative analysis and algorithmic strategy development." },
  { name: "Competitive Programming", level: "Fluent", size: "md:col-span-1 md:row-span-1", color: "from-purple-500 to-pink-500", desc: "Solving complex algorithmic puzzles with speed and precision." },
  { name: "TypeScript", level: "Advanced", size: "md:col-span-1 md:row-span-1", color: "from-blue-500 to-blue-700", desc: "Ensuring type safety and maintainability in large-scale codebases." },
];

export default function BentoSkills() {
  return (
    <section id="skills" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4">
            Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Arsenal</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A comprehensive look at my core competencies and specialized technical skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className={`${skill.size} relative group overflow-hidden rounded-[2rem] border border-slate-700/60 bg-[#111827] p-8 flex flex-col justify-between`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              
              <div>
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-2xl font-bold text-white tracking-tight">{skill.name}</h3>
                   <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${skill.color} animate-pulse`} />
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   {skill.desc}
                 </p>
              </div>

              <div className="mt-auto">
                 <p className={`text-xs font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r ${skill.color}`}>
                   {skill.level}
                 </p>
              </div>
              
              {/* Subtle animated background glow */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
