export const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web App',
    type: 'frontend',
    description: 'Full-stack e-commerce with cart, checkout, Stripe integration, and admin dashboard. Built for scale, SEO, and conversion—handles inventory, coupons, and analytics.',
    image: 'https://placehold.co/400x250/111827/3b82f6?text=E-Commerce',
    github: 'https://github.com',
    link: 'https://example.com',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
    featured: true,
    metrics: { lines: '12.4k', lighthouse: 97, complexity: 'High' },
    codeSnippet: {
      title: 'useCart() — Custom Hook',
      language: 'javascript',
      code: `const useCart = () => {
  const [items, setItems] = useState([]);
  const total = useMemo(() =>
    items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const addItem = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      );
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  return { items, total, addItem };
};`,
    },
  },
  {
    id: 2,
    title: 'Real-Time Analytics Dashboard',
    category: 'SaaS',
    type: 'frontend',
    description: 'Analytics dashboard with live WebSocket data, interactive charts, role-based access, and export to CSV/PDF. Used by internal teams for daily reporting.',
    image: 'https://placehold.co/400x250/111827/22d3ee?text=Dashboard',
    github: 'https://github.com',
    link: 'https://example.com',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'Tailwind', 'Recharts'],
    featured: true,
    metrics: { lines: '8.2k', lighthouse: 94, complexity: 'High' },
    codeSnippet: {
      title: 'useWebSocket() — Live Data Stream',
      language: 'typescript',
      code: `function useWebSocket<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => setStatus('open');
    ws.onmessage = (e) => setData(JSON.parse(e.data));
    ws.onclose = () => {
      setStatus('closed');
      setTimeout(() => ws.close(), 3000); // auto-reconnect
    };
    return () => ws.close();
  }, [url]);

  return { data, status };
}`,
    },
  },
  {
    id: 3,
    title: 'Dev Tools CLI',
    category: 'CLI',
    type: 'logic',
    description: 'Command-line toolkit for scaffolding projects, running migrations, and automating local workflows. Supports plugins and custom templates.',
    image: 'https://placehold.co/400x250/111827/60a5fa?text=CLI',
    github: 'https://github.com',
    link: 'https://example.com',
    tags: ['Node.js', 'Commander', 'Inquirer'],
    featured: false,
    metrics: { lines: '3.1k', lighthouse: null, complexity: 'Medium' },
    codeSnippet: {
      title: 'scaffoldProject() — Template Engine',
      language: 'javascript',
      code: `async function scaffoldProject(template, dest) {
  const config = await loadTemplate(template);
  const vars = await inquirer.prompt(config.prompts);

  for (const file of config.files) {
    const content = Handlebars.compile(
      await fs.readFile(file.src, 'utf-8')
    )(vars);
    await fs.outputFile(
      path.join(dest, file.dest), content
    );
  }
  console.log(chalk.green('✓ Project scaffolded!'));
}`,
    },
  },
  {
    id: 4,
    title: 'Portfolio CMS',
    category: 'Full Stack',
    type: 'frontend',
    description: 'Headless CMS for portfolios with markdown support, image optimization, and preview. Deploy to Vercel with one click.',
    image: 'https://placehold.co/400x250/111827/3b82f6?text=CMS',
    github: 'https://github.com',
    link: 'https://example.com',
    tags: ['React', 'GraphQL', 'Sanity', 'Vercel'],
    featured: false,
    metrics: { lines: '5.6k', lighthouse: 99, complexity: 'Medium' },
    codeSnippet: {
      title: 'useMarkdown() — MDX Renderer',
      language: 'javascript',
      code: `function useMarkdown(raw) {
  return useMemo(() => {
    const tokens = marked.lexer(raw);
    const headings = tokens
      .filter(t => t.type === 'heading')
      .map(t => ({ depth: t.depth, text: t.text }));
    const html = marked.parser(tokens);
    return { html, headings, readTime: 
      Math.ceil(raw.split(/\\s+/).length / 200) 
    };
  }, [raw]);
}`,
    },
  },
  {
    id: 5,
    title: 'API Gateway & Rate Limiter',
    category: 'Backend',
    type: 'backend',
    description: 'Lightweight API gateway with rate limiting, API key management, and request logging. Designed for microservices and third-party integrations.',
    image: 'https://placehold.co/400x250/111827/22d3ee?text=API',
    github: 'https://github.com',
    link: 'https://example.com',
    tags: ['Node.js', 'Redis', 'Docker'],
    featured: false,
    metrics: { lines: '4.8k', lighthouse: null, complexity: 'High' },
    codeSnippet: {
      title: 'rateLimiter() — Sliding Window',
      language: 'javascript',
      code: `async function rateLimiter(req, res, next) {
  const key = \`rate:\${req.ip}\`;
  const window = 60; // seconds
  const limit = 100;

  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, window);

  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', 
    Math.max(0, limit - current));

  if (current > limit) {
    return res.status(429).json({ 
      error: 'Too many requests' 
    });
  }
  next();
}`,
    },
  },
  {
    id: 6,
    title: 'Task Manager & Team Sync',
    category: 'Web App',
    type: 'frontend',
    description: 'Team task manager with real-time updates, kanban boards, comments, and Slack-style notifications. Built for remote teams.',
    image: 'https://placehold.co/400x250/111827/60a5fa?text=Tasks',
    github: 'https://github.com',
    link: 'https://example.com',
    tags: ['React', 'Firebase', 'Tailwind'],
    featured: false,
    metrics: { lines: '7.3k', lighthouse: 95, complexity: 'Medium' },
    codeSnippet: {
      title: 'useKanban() — Drag & Drop State',
      language: 'javascript',
      code: `function useKanban(initialColumns) {
  const [columns, setColumns] = useState(initialColumns);

  const moveTask = useCallback((taskId, from, to, idx) => {
    setColumns(prev => {
      const task = prev[from].tasks.find(t => t.id === taskId);
      return {
        ...prev,
        [from]: { ...prev[from], 
          tasks: prev[from].tasks.filter(t => t.id !== taskId) 
        },
        [to]: { ...prev[to], 
          tasks: [
            ...prev[to].tasks.slice(0, idx), 
            task, 
            ...prev[to].tasks.slice(idx)
          ] 
        },
      };
    });
  }, []);

  return { columns, moveTask };
}`,
    },
  },
];
