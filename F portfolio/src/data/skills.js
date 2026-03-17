// Level: 'expert' | 'advanced' | 'intermediate' | 'learning'
// Icon: Lucide icon name for SkillsCloud

export const skillCategories = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'Layout',
    description: 'Building responsive, accessible interfaces',
    skills: [
      { name: 'React', level: 'expert' },
      { name: 'Next.js', level: 'expert' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'Tailwind CSS', level: 'expert' },
      { name: 'Framer Motion', level: 'advanced' },
      { name: 'Redux / Zustand', level: 'advanced' },
      { name: 'HTML5 / CSS3', level: 'expert' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    icon: 'Server',
    description: 'Servers, databases, and API design',
    skills: [
      { name: 'Node.js', level: 'expert' },
      { name: 'Python', level: 'advanced' },
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'MongoDB', level: 'advanced' },
      { name: 'GraphQL', level: 'intermediate' },
      { name: 'REST APIs', level: 'expert' },
      { name: 'Redis', level: 'intermediate' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Tools',
    icon: 'Box',
    description: 'Shipping and running in production',
    skills: [
      { name: 'Git', level: 'expert' },
      { name: 'Docker', level: 'advanced' },
      { name: 'AWS', level: 'intermediate' },
      { name: 'Vercel / Netlify', level: 'expert' },
      { name: 'CI/CD', level: 'advanced' },
      { name: 'Linux', level: 'intermediate' },
    ],
  },
  {
    id: 'design',
    title: 'Design & UX',
    icon: 'Palette',
    description: 'Visual design and user experience',
    skills: [
      { name: 'Figma', level: 'advanced' },
      { name: 'Responsive Design', level: 'expert' },
      { name: 'Design Systems', level: 'intermediate' },
      { name: 'Accessibility (a11y)', level: 'advanced' },
    ],
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    icon: 'Cpu',
    description: 'Algorithms and technical thinking',
    skills: [
      { name: 'Competitive Programming', level: 'advanced' },
      { name: 'Data Structures', level: 'expert' },
      { name: 'System Design', level: 'intermediate' },
    ],
  },
];

export const currentlyLearning = [
  'Rust',
  'Go',
  'Kubernetes',
  'WebAssembly',
];

// Flat list for backward compatibility (e.g. Terminal bio)
export const skills = skillCategories.flatMap((cat) =>
  cat.skills.map((s) => s.name)
);
