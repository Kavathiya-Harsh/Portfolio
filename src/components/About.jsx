'use client';

import { motion } from 'framer-motion';

const AboutMe = () => {
  return (
    <section id="about" className="py-28 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#22c55e10_0%,transparent_70%)]" />

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 text-emerald-400 text-sm tracking-[4px] mb-4 font-mono">
              SYSTEM ONLINE • BUILDER v2.0
            </div>
            <h2 className="text-7xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent">
              HARSH KAVATHIYA
            </h2>
            <p className="mt-4 text-2xl md:text-3xl text-zinc-400 font-light">
              Rapid Prototyping Engine • 5× Hackathon Dominator
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg mx-auto text-center leading-relaxed text-zinc-300"
          >
            <p className="text-xl">
              I turn caffeine, pressure, and bold ideas into production-grade systems — fast.
            </p>
            <p>
              First-year Computer Science student at Shree Swaminarayan University (CodingGita).
              5× hackathon winner across IIT Madras, IIT Hyderabad, DA-IICT and beyond.
              12+ full-stack products shipped with obsession-level attention to clean architecture and pixel-perfect experiences.
            </p>
            <p>
              I don’t chase trends — I build the infrastructure for what’s next.
              Currently pushing deeper into <span className="text-emerald-400 font-medium">Rust, Go, Kubernetes</span> and distributed systems.
            </p>
          </motion.div>

          <div className="mt-20 grid md:grid-cols-2 gap-6">
            {[
              { title: "RAPID BUILDER", desc: "From concept to live demo in hours. Speed is my competitive advantage." },
              { title: "SYSTEMS ARCHITECT", desc: "Clean, scalable code that survives beyond the hackathon." },
              { title: "HIGH-STAKES EXECUTOR", desc: "Proven under pressure at India’s top technical arenas." },
              { title: "FUTURE FORWARD", desc: "Always learning. Currently mastering low-level systems & edge computing." },
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(16, 185, 129, 0.15)" }}
                className="group border border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/50 backdrop-blur-xl rounded-3xl p-10 transition-all duration-500"
              >
                <div className="text-[11px] tracking-[3px] text-emerald-500 font-mono mb-4">
                  CORE DIRECTIVE {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-3xl font-semibold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-8 text-center"
          >
            {[
              ["5×", "Hackathon Wins"],
              ["12+", "Projects Delivered"],
              ["98/100", "Performance Score"],
              ["∞", "Lines Engineered"],
            ].map(([value, label], i) => (
              <div key={i} className="min-w-[140px]">
                <div className="text-5xl font-bold text-emerald-400 tracking-tighter">{value}</div>
                <div className="text-sm text-zinc-500 mt-2 tracking-widest">{label}</div>
              </div>
            ))}
          </motion.div>

          <div className="mt-24 text-center">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold text-xl px-14 py-6 rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-xl shadow-emerald-500/20"
            >
              INITIATE COLLABORATION
              <span className="text-2xl group-hover:rotate-45 transition-transform">↗</span>
            </motion.a>
            <p className="text-xs text-zinc-500 mt-6 tracking-widest">OPEN TO OPPORTUNITIES • FREELANCE • COLLABORATIONS</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
