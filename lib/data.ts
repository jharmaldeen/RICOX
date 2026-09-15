export const deals = [
  {
    id: "1",
    initials: "QC",
    name: "Quantum Chain",
    category: "DeFi",
    raised: "$2.4M",
    target: "$3M",
    progress: 80,
    accent: "from-[#4d7cff] to-[#6ea0ff]",
    description:
      "A next-generation decentralized finance protocol offering cross-chain liquidity and yield optimization.",
    roi: "12-18%",
    duration: "6-12 months",
  },
  {
    id: "2",
    initials: "BV",
    name: "BlockVault",
    category: "Security",
    raised: "$1.8M",
    target: "$2M",
    progress: 90,
    accent: "from-[#34d399] to-[#5eead4]",
    description:
      "Enterprise-grade security infrastructure for digital assets with multi-signature and insurance protection.",
    roi: "8-15%",
    duration: "12-24 months",
  },
  {
    id: "3",
    initials: "CN",
    name: "CryptoNexus",
    category: "Exchange",
    raised: "$4.2M",
    target: "$5M",
    progress: 84,
    accent: "from-[#6ea0ff] to-[#4d7cff]",
    description:
      "Decentralized exchange platform with advanced trading features and cross-chain compatibility.",
    roi: "15-25%",
    duration: "6-18 months",
  },
  {
    id: "4",
    initials: "MW",
    name: "MetaWorld",
    category: "Metaverse",
    raised: "$3.7M",
    target: "$4M",
    progress: 92,
    accent: "from-[#5eead4] to-[#4d7cff]",
    description:
      "A next-generation metaverse platform connecting digital worlds with real-world investment utility.",
    roi: "10-20%",
    duration: "9-18 months",
  },
];

export const investors = [
  {
    name: "David Rodriguez",
    role: "Angel Investor",
    gain: "+32%",
    count: 24,
    image: "/images/people/investor-1.jpeg",
  },
  {
    name: "Marcus Johnson",
    role: "Crypto Fund Manager",
    gain: "+28%",
    count: 36,
    image: "/images/people/investor-5.jpeg",
  },
  {
    name: "Alex Chen",
    role: "Blockchain Advisor",
    gain: "+41%",
    count: 18,
    image: "/images/people/investor-2.jpeg",
  },
  {
    name: "Sofia Williams",
    role: "VC Partner",
    gain: "+35%",
    count: 42,
    image: "/images/people/investor-4.jpeg",
  },
];

export const testimonials = [
  {
    quote:
      "CRYPTEC has transformed how I invest in crypto projects. Their vetting process gives me confidence in every investment.",
    name: "Michael Torres",
    role: "Angel Investor",
    image: "/images/people/investor-3.jpeg",
  },
  {
    quote:
      "The platform is intuitive and the investment opportunities are unmatched. I've seen consistent returns since joining.",
    name: "Sarah Kim",
    role: "Retail Investor",
    image: "/images/people/investor-6.jpeg",
  },
  {
    quote:
      "As someone new to crypto investing, CRYPTEC made it easy to build a diversified portfolio with minimal risk.",
    name: "James Rodriguez",
    role: "New Investor",
    image: "/images/bitcoin-investment.jpeg",
  },
];

export const partners = [
  { name: "Coinbase", src: "/images/crypto-logos/logo-c.png" },
  { name: "Quantum", src: "/images/crypto-logos/logo-q.jpeg" },
  { name: "Genesis", src: "/images/crypto-logos/logo-g.png" },
  { name: "Hexagon", src: "/images/crypto-logos/logo-hex.jpeg" },
  { name: "Triangle", src: "/images/crypto-logos/logo-triangle.jpeg" },
];

export const categories = [
  { name: "DeFi", description: "Decentralized Finance protocols and platforms", count: 24, icon: "coins" },
  { name: "NFTs", description: "Non-Fungible Token projects and marketplaces", count: 18, icon: "image" },
  { name: "Layer 1", description: "Base blockchain protocols and networks", count: 12, icon: "layers" },
  { name: "Layer 2", description: "Scaling solutions for existing blockchains", count: 15, icon: "zap" },
  { name: "GameFi", description: "Gaming and metaverse projects", count: 20, icon: "gamepad" },
  { name: "Infrastructure", description: "Tools and services for blockchain development", count: 16, icon: "server" },
];

export const howItWorks = [
  { step: "01", title: "Create an Account", body: "Sign up for a RICOX account to access our investment platform." },
  { step: "02", title: "Complete KYC Verification", body: "Verify your identity to comply with regulations and ensure security." },
  { step: "03", title: "Fund Your Account", body: "Deposit funds using cryptocurrency or traditional payment methods." },
  { step: "04", title: "Select Investment Projects", body: "Browse and select from our vetted cryptocurrency investment opportunities." },
  { step: "05", title: "Monitor Performance", body: "Track your investments and returns through your personalized dashboard." },
  { step: "06", title: "Withdraw Returns", body: "Withdraw your returns once your investment reaches maturity." },
];

export const tradingFeatures = [
  { title: "Advanced Order Types", body: "Place limit, market, stop-loss, and trailing stop orders to execute your trading strategy." },
  { title: "Technical Analysis Tools", body: "Access over 100 technical indicators and drawing tools to analyze price movements." },
  { title: "API Access", body: "Connect to our trading platform via API for automated trading and custom integrations." },
  { title: "Mobile Trading", body: "Trade on the go with our mobile apps for iOS and Android devices." },
  { title: "Portfolio Management", body: "Track your portfolio performance and manage your assets in one place." },
  { title: "24/7 Support", body: "Get help from our support team anytime, anywhere, with any trading-related questions." },
];

export const tradingPairs = [
  { pair: "BTC/USD", name: "Bitcoin", price: "$67,420.18", change: "+1.2%", volume: "$1.2B", trending: true },
  { pair: "ETH/USD", name: "Ethereum", price: "$1,845.32", change: "+2.5%", volume: "$850M", trending: true },
  { pair: "SOL/USD", name: "Solana", price: "$98.75", change: "+4.8%", volume: "$420M", trending: true },
  { pair: "ADA/USD", name: "Cardano", price: "$0.45", change: "-0.8%", volume: "$180M", trending: false },
  { pair: "DOT/USD", name: "Polkadot", price: "$6.32", change: "+1.5%", volume: "$120M", trending: false },
  { pair: "AVAX/USD", name: "Avalanche", price: "$28.45", change: "+3.2%", volume: "$95M", trending: true },
];

export const tradingTools = [
  { title: "Price Alerts", body: "Set up custom alerts for price movements and get notified via email or push notifications." },
  { title: "Trading Bots", body: "Automate your trading strategies with customizable bots that execute trades based on your parameters." },
  { title: "Market Scanner", body: "Scan the market for trading opportunities based on technical indicators and price patterns." },
  { title: "Risk Calculator", body: "Calculate position size, potential profit, and risk before you place a trade." },
];

export const investmentFaqs = [
  {
    q: "How does RICOX vet investment projects?",
    a: "Our team of experts analyzes each project for technology, team, market fit, and growth potential before it is listed on the platform.",
  },
  {
    q: "What is the minimum investment amount?",
    a: "Minimums vary by project. Each listing shows its target raise, expected ROI, and duration so you can choose opportunities that match your goals.",
  },
  {
    q: "How do I track my investments?",
    a: "After you invest, you can monitor performance, progress, and returns from your personalized RICOX dashboard.",
  },
  {
    q: "When can I withdraw returns?",
    a: "Returns can be withdrawn once your selected investment reaches maturity, according to the project duration listed on each deal.",
  },
];

export const tradingFaqs = [
  {
    q: "What trading fees does RICOX charge?",
    a: "RICOX offers competitive spreads and fees that can be up to 50% lower than typical retail platforms, with fast execution and deep liquidity.",
  },
  {
    q: "Which cryptocurrencies can I trade?",
    a: "You can trade a wide range of pairs including BTC/USD, ETH/USD, SOL/USD, ADA/USD, DOT/USD, AVAX/USD, and more.",
  },
  {
    q: "Is there a mobile app?",
    a: "Yes. Trade on the go with our mobile apps for iOS and Android devices.",
  },
  {
    q: "Can I use automated trading?",
    a: "Yes. Connect via API or use customizable trading bots to execute strategies based on your parameters.",
  },
];

export const blogPosts = [
  {
    slug: "future-of-defi-2023",
    date: "June 15, 2023",
    title: "The Future of DeFi: Trends to Watch in 2023",
    excerpt:
      "Decentralized Finance continues to evolve rapidly. Here are the key trends that will shape the future of DeFi in the coming year.",
    author: "Alex Johnson",
    read: "8 min read",
  },
  {
    slug: "blockchain-scalability-solutions",
    date: "June 10, 2023",
    title: "Understanding Blockchain Scalability Solutions",
    excerpt:
      "As blockchain adoption grows, scalability remains a critical challenge. We explore the most promising solutions on the horizon.",
    author: "Maria Chen",
    read: "12 min read",
  },
  {
    slug: "cbdcs-global-finance",
    date: "June 8, 2023",
    title: "How Central Bank Digital Currencies Could Change Global Finance",
    excerpt:
      "As governments around the world explore CBDCs, we examine the potential impact on the financial system and cryptocurrency markets.",
    author: "RICOX Research",
    read: "10 min read",
  },
  {
    slug: "nft-use-cases",
    date: "June 5, 2023",
    title: "NFT Use Cases Beyond Digital Art",
    excerpt:
      "While digital art has dominated the NFT conversation, the technology has far-reaching applications across multiple industries.",
    author: "RICOX Research",
    read: "7 min read",
  },
  {
    slug: "wallet-security",
    date: "June 3, 2023",
    title: "Securing Your Crypto: Best Practices for Wallet Management",
    excerpt:
      "With cryptocurrency theft on the rise, proper wallet security is more important than ever. Learn how to protect your digital assets.",
    author: "RICOX Research",
    read: "9 min read",
  },
  {
    slug: "pos-vs-pow-environment",
    date: "May 30, 2023",
    title: "The Environmental Impact of Proof-of-Stake vs. Proof-of-Work",
    excerpt:
      "As blockchain networks evolve, the environmental debate continues. We compare the ecological footprints of different consensus mechanisms.",
    author: "RICOX Research",
    read: "11 min read",
  },
];

export const contactFaqs = [
  {
    q: "Is my investment safe on RICOX?",
    a: "RICOX lists vetted cryptocurrency projects and uses identity verification, secure execution, and compliance processes to help protect investors. Always review each opportunity before investing.",
  },
  {
    q: "How do I contact support?",
    a: "Email support@RICOX.com, call +1 (555) 123-4567, or use the form on this page. Our team is available Monday–Friday 9AM–6PM and Saturday 10AM–4PM.",
  },
  {
    q: "Where is RICOX located?",
    a: "123 Blockchain Avenue, Suite 456, New York, NY 10001.",
  },
];
