// Level: 'expert' | 'advanced' | 'intermediate' | 'learning'
// Color: HEX color code for matching with theme

export const skillCategories = [
  {
    id: 'frontend',
    title: 'Frontend Craft',
    icon: 'Layout',
    description: 'Sculpting high-performance, immersive interfaces',
    color: '#3b82f6', // blue
    skills: [
      { name: 'React', level: 'Expert', fill: 95, color: '#63dcff' },
      { name: 'Next.js', level: 'Advanced', fill: 90, color: '#3b82f6' },
      { name: 'TypeScript', level: 'Advanced', fill: 88, color: '#3178c6' },
      { name: 'Tailwind CSS', level: 'Expert', fill: 96, color: '#38bdf8' },
      { name: 'Framer Motion', level: 'Advanced', fill: 85, color: '#ff0055' },
      { name: 'Three.js / React Three Fiber', level: 'Intermediate', fill: 70, color: '#ffffff' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    icon: 'Server',
    description: 'Robust logic and scalable data architectures',
    color: '#a78bfa', // violet
    skills: [
      { name: 'Node.js', level: 'Expert', fill: 92, color: '#8cc84b' },
      { name: 'Express / NestJS', level: 'Advanced', fill: 88, color: '#e0234e' },
      { name: 'PostgreSQL', level: 'Advanced', fill: 85, color: '#336791' },
      { name: 'MongoDB', level: 'Advanced', fill: 84, color: '#47a248' },
      { name: 'Firebase', level: 'Expert', fill: 95, color: '#ffca28' },
      { name: 'Python', level: 'Advanced', fill: 86, color: '#3776ab' },
    ],
  },
  {
    id: 'quant',
    title: 'Quant & Logic',
    icon: 'TrendingUp',
    description: 'Algorithmic trading and complex problem solving',
    color: '#f472b6', // pink
    skills: [
      { name: 'Trading Logic', level: 'Advanced', fill: 85, color: '#f472b6' },
      { name: 'Market Microstructure', level: 'Intermediate', fill: 72, color: '#ec4899' },
      { name: 'Technical Analysis', level: 'Advanced', fill: 88, color: '#8b5cf6' },
      { name: 'Python for Quant', level: 'Advanced', fill: 84, color: '#3776ab' },
      { name: 'Risk Management', level: 'Intermediate', fill: 75, color: '#ef4444' },
    ],
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    icon: 'Cpu',
    description: 'Algorithms and technical depth',
    color: '#34d399', // emerald
    skills: [
      { name: 'Competitive Programming', level: 'Expert', fill: 92, color: '#ff6b6b' },
      { name: 'Data Structures', level: 'Expert', fill: 94, color: '#f59e0b' },
      { name: 'System Design', level: 'Advanced', fill: 82, color: '#6366f1' },
      { name: 'Algorithm Analysis', level: 'Advanced', fill: 88, color: '#2dd4bf' },
    ],
  },
];

export const currentlyLearning = [
  'Rust (Low-level performance)',
  'Go (Distributed systems)',
  'WebAssembly (Edge computing)',
  'Solidity (Smart contracts)',
];

// Flat list for backward compatibility (e.g. Terminal bio)
export const skills = skillCategories.flatMap((cat) =>
  cat.skills.map((s) => s.name)
);
