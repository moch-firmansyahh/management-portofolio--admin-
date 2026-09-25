import { PopularSkill, ProfileData, Experience } from "../types";

export const GITHUB_USERNAME = "moch-firmansyahh";

export const SKILL_CATEGORIES = [
  "Front-End Web Development",
  "Programming Languages",
  "Developer Tools",
  "Soft Skills & Professional",
  "Achievements & Certifications",
];

export const PROJECT_CATEGORIES = [
  "Web App",
  "E-Commerce",
  "Dashboard",
  "Landing Page",
  "Mobile App",
  "Cyber Security",
];

export const POPULAR_SKILLS: PopularSkill[] = [
  // 1. Front-End Web Development
  { name: "HTML", logo: "HTM", category: "Front-End Web Development" },
  { name: "CSS", logo: "CSS", category: "Front-End Web Development" },
  { name: "JavaScript", logo: "JS", category: "Front-End Web Development" },
  { name: "React", logo: "RE", category: "Front-End Web Development" },
  { name: "Next.js", logo: "NX", category: "Front-End Web Development" },
  { name: "Tailwind CSS", logo: "TW", category: "Front-End Web Development" },
  { name: "TypeScript", logo: "TS", category: "Front-End Web Development" },

  // 2. Programming Languages
  { name: "C++", logo: "CPP", category: "Programming Languages" },
  { name: "Python", logo: "PY", category: "Programming Languages" },
  { name: "Java", logo: "JAV", category: "Programming Languages" },
  { name: "Go (Golang)", logo: "GO", category: "Programming Languages" },

  // 3. Developer Tools
  { name: "Git / GitHub", logo: "GIT", category: "Developer Tools" },
  { name: "VS Code", logo: "VSC", category: "Developer Tools" },
  { name: "Postman", logo: "PST", category: "Developer Tools" },
  { name: "Antigravity", logo: "AGY", category: "Developer Tools" },
  { name: "Figma", logo: "FG", category: "Developer Tools" },
  { name: "Wireshark", logo: "WSH", category: "Developer Tools" },
  { name: "MySQL Workbench", logo: "SQL", category: "Developer Tools" },

  // 4. Soft Skills & Professional
  { name: "Technical Problem-Solving", logo: "TPS", category: "Soft Skills & Professional" },
  { name: "Analytical Thinking", logo: "AT", category: "Soft Skills & Professional" },
  { name: "Team Collaboration", logo: "TC", category: "Soft Skills & Professional" },
  { name: "Time Management", logo: "TM", category: "Soft Skills & Professional" },
  { name: "Client Management", logo: "CM", category: "Soft Skills & Professional" },

  // 5. Achievements & Certifications (Semua 16 Sertifikasi Google AI & Security)
  { name: "Sertifikat Profesional Google AI", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Google Network Security Spesialisasi", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI Fundamentals", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Architecture", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Research and Insights", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Operations", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Writing and Communicating", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Secure Against Network Intrusions", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Content Creation", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Security Hardening", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Data Analysis", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for App Building", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Monitoring and Analysis", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Traffic and Logs Using IDS and SIEM Tools", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Brainstorming and Planning", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Introduction to Detection and Incident Response", logo: "GOO", category: "Achievements & Certifications" },
];

export const DEFAULT_PROFILE: ProfileData = {
  name: "Moch. Firmansyah",
  shortName: "Firman",
  role: "Frontend Developer & Security Enthusiast",
  tagline: "Code that looks good. Systems that stay safe.",
  about: "Mahasiswa Informatika Telkom University yang berfokus pada Frontend Development modern dan Cyber Security, memadukan antarmuka yang bersih dan interaktif dengan sistem yang aman.",
  bio: "Sebagai mahasiswa **Teknik Informatika di Telkom University**, saya berdedikasi untuk menerapkan keterampilan analitis dan keahlian teknis saya dalam peran **Front-End Developer** di industri teknologi. Latar belakang akademik telah membekali saya dengan fondasi yang kuat dalam pemrograman, pengembangan web modern, dan pengelolaan basis data.\n\nSaya memiliki pengalaman langsung dalam membangun aplikasi web menggunakan **React** dan **Next.js**, didukung oleh pemahaman yang solid dalam pengembangan front-end maupun back-end, termasuk perancangan dan manajemen database.\n\nDi samping pengembangan antarmuka, saya memiliki ketertarikan mendalam pada **Cyber Security** dan **Network Security**. Berbekal sertifikasi spesialisasi dari Google, saya aktif menerapkan prinsip **Secure Coding** dan validasi data ketat guna memastikan setiap aplikasi web yang saya bangun tidak hanya estetik dan responsif, tetapi juga aman dan terlindungi.\n\nSaya bersemangat untuk memanfaatkan keahlian ini dalam menciptakan antarmuka yang ramah pengguna, berkinerja tinggi, serta berkontribusi pada pengembangan solusi web yang inovatif dan terukur (*scalable*).",
  status: "Available for opportunities",
  location: "Bandung, Indonesia",
  email: "firmanajah366@gmail.com",
  phone: "+62 812-3456-7890",
  resumeUrl: "#contact",
  socialLinks: {
    github: "https://github.com/moch-firmansyahh",
    linkedin: "https://www.linkedin.com/in/moch-firmansyah-532122323/",
    instagram: "https://www.instagram.com/frmzyxx/",
    tiktok: "https://www.tiktok.com/@frmnzy_",
  },
  stats: [
    { label: "Tahun Belajar & Berkarya", value: "2+" },
    { label: "Proyek Selesai", value: "5+" },
    { label: "Lighthouse Performance", value: "98%" },
    { label: "Dedikasi & Presisi", value: "100%" },
  ],
};

export const DEFAULT_EXPERIENCES: Omit<Experience, "id">[] = [
  {
    period: "Feb 2026 - Present",
    role: "Study Group Member",
    company: "Central Computer Improvement Telkom University",
    location: "Bandung, West Java, Indonesia",
    description: "Actively participated in the Central Computer Improvement (CCI) Study Group, specializing in modern web development. Gained hands-on experience building responsive user interfaces with Tailwind CSS and mastering the Next.js framework. Core focus areas included handling complex React state management, implementing dynamic routing architectures, and optimizing data fetching strategies (SSR & Client-Side) using Axios and Fetch to integrate REST APIs efficiently.",
    technologies: ["Next.js", "React", "Tailwind CSS", "REST API", "Front-End Development", "Software System Analysis"],
    type: "Work",
  },
  {
    period: "Nov 2025 - Dec 2025",
    role: "Study Group Member",
    company: "Cyber Physical System Laboratory",
    location: "Bandung, West Java, Indonesia",
    description: "Actively participated in the Website Development Study Group to build web applications end-to-end. Hands-on practice included Front-End development with React.js and Tailwind CSS, Back-End (REST API) architecture with Node.js, Express.js, and MySQL, as well as API testing, integration, and public cloud deployment.",
    technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MySQL", "REST API", "Cloud Deployment"],
    type: "Work",
  },
  {
    period: "Nov 2024 - Jun 2025",
    role: "Study Group Member",
    company: "GDGoC Telkom University Bandung",
    location: "Bandung, West Java, Indonesia",
    description: "Active member of the Web Development Study Group at Google Developer Groups on Campus (GDGoC), learning and practicing modern web development alongside fellow members. Participated in group learning sessions, hands-on workshops, and collaborative projects focusing on web design and modern frontend engineering.",
    technologies: ["Web Development", "Web Design", "JavaScript", "HTML/CSS", "Collaboration"],
    type: "Work",
  },
];

export const DEFAULT_SEED_PROJECTS = [
  {
    title: "Kontrakan Pa Iman",
    subtitle: "Sistem Manajemen Kost Digital Modern & Responsif",
    description: "Aplikasi web Full-Stack Digital Management yang dirancang khusus untuk pemilik kost dalam mengelola unit kamar, data penghuni (aktif & alumni), dan pencatatan riwayat pembayaran bulanan secara efisien, terstruktur, dan otomatis.",
    longDescription: "Kontrakan Pa Iman adalah aplikasi web Full-Stack Digital Management yang dirancang khusus untuk pemilik kost dalam mengelola unit kamar, data penghuni (aktif & alumni), dan pencatatan riwayat pembayaran bulanan secara efisien, terstruktur, dan otomatis. Dibangun dengan arsitektur modern Next.js 16, Express.js 5, Prisma ORM, dan PostgreSQL untuk menyederhanakan operasional bisnis sewa properti.",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Express.js 5", "Prisma ORM", "PostgreSQL", "Shadcn UI", "JWT Auth", "PWA Ready"],
    category: "Web App",
    featured: true,
    image: "/projects/manajemen-kontrakan.png",
    link: "https://manajemen-kontrakan-iman.vercel.app/",
    demoUrl: "https://manajemen-kontrakan-iman.vercel.app/",
    githubUrl: "https://github.com/moch-firmansyahh/manajemen-kost-v2",
    metrics: "Full-Stack • Real-time Stats • PWA Ready",
    highlights: [
      "Dashboard Ringkasan Real-Time dengan 4 Stat Card interaktif, monitoring tagihan sewa pending, dan popover notifikasi",
      "Manajemen Unit Kamar: Filter & instant search nomor/tipe kamar, modal operasi CRUD, serta histori lengkap transaksi kamar",
      "Manajemen Penghuni: Pengelompokan tab Penghuni Aktif & Alumni, profil identitas lengkap, dan sistem checkout otomatis",
      "Manajemen Pembayaran & Struk: Pencatatan status tagihan sewa bulanan, filter periode transaksi, dan halaman cetak invoice",
      "Keunggulan UI/UX: Dual Theme (Dark/Light mode) mulus, animasi welcome screen & loader kustom, serta instalasi PWA standalone"
    ],
    year: "2026",
  },
  {
    title: "Voluntrip",
    subtitle: "Aplikasi Perencana Trip, Rundown Perjalanan Interaktif & Manajemen Budget Kelompok",
    description: "Platform perencana perjalanan modern yang dirancang untuk mempermudah traveler dan kelompok perjalanan dalam menyusun jadwal kegiatan (rundown), mengelola anggaran (budgeting), dan melacak pengeluaran secara real-time.",
    longDescription: "Voluntrip adalah platform perencana perjalanan modern yang dirancang untuk mempermudah traveler dan kelompok perjalanan dalam menyusun jadwal kegiatan (rundown), mengelola anggaran (budgeting), dan melacak pengeluaran secara real-time. Dengan antarmuka interaktif yang intuitif, Voluntrip memastikan itinerary bebas bentrok jam, fleksibel untuk diubah lewat fitur drag & drop, serta mudah dibagikan ke anggota trip lainnya.",
    tags: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS", "PostgreSQL", "Dnd Kit", "PWA Ready", "JWT Auth", "Leaflet"],
    category: "Web App",
    featured: true,
    image: "/projects/voluntrip.png",
    link: "https://voluntrip-five.vercel.app/",
    demoUrl: "https://voluntrip-five.vercel.app/",
    githubUrl: "https://github.com/moch-firmansyahh/voluntrip",
    metrics: "Drag & Drop • Real-time Budgeting • PWA Ready",
    highlights: [
      "Interactive Itinerary & Rundown Builder dengan Drag & Drop (Dnd-Kit) dan Auto-Reschedule sekuensial bebas tabrakan jam",
      "Autocomplete lokasi destinasi terintegrasi Photon OpenStreetMap API (Komoot) dan visualisasi titik peta Leaflet",
      "Expense Tracker, Budgeting & Split Bill kalkulator otomatis untuk pembagian tagihan rata (equal share) antar anggota trip",
      "Sistem Autentikasi JWT terenkripsi dengan HTTP-only cookie, opsi Ingat Saya 30 hari, dan instant logout",
      "Dukungan Progressive Web App (PWA Standalone), Traveloka-Style Splash Screen, serta Public Share Link dengan token unik"
    ],
    year: "2026",
  }
];
