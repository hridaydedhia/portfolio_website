const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(__dirname, '..', 'public', 'Hriday_Dedhia_Resume.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 36, bottom: 36, left: 40, right: 40 },
  info: {
    Title: 'Hriday Dedhia - Resume',
    Author: 'Hriday Dedhia',
    Subject: 'Software Engineer & Systems Architect Resume',
    Keywords: 'Software Engineering, Full-Stack, Architecture, Finance, Systems'
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Primary Accent colors
const PRIMARY_COLOR = '#111827';
const ACCENT_COLOR = '#ea580c'; // Vibrant orange
const TEXT_MUTED = '#4b5563';
const TEXT_BODY = '#1f2937';
const BORDER_COLOR = '#e5e7eb';

// Header
doc.fillColor(PRIMARY_COLOR)
   .fontSize(24)
   .font('Helvetica-Bold')
   .text('HRIDAY DEDHIA', 40, 36);

doc.fillColor(ACCENT_COLOR)
   .fontSize(11)
   .font('Helvetica-Bold')
   .text('SOFTWARE ENGINEER & SYSTEMS ARCHITECT', 40, 64);

// Contact row
doc.fillColor(TEXT_MUTED)
   .fontSize(9)
   .font('Helvetica')
   .text('hriday.dedhia24@gmail.com   |   github.com/hridaydedhia   |   Portfolio: hridaydedhia.com   |   Mumbai, India', 40, 80);

// Divider
doc.moveTo(40, 96).lineTo(555, 96).strokeColor(BORDER_COLOR).lineWidth(1).stroke();

let y = 108;

function renderSectionHeader(title) {
  doc.fillColor(ACCENT_COLOR)
     .fontSize(10)
     .font('Helvetica-Bold')
     .text(title.toUpperCase(), 40, y);
  
  doc.moveTo(40, y + 14).lineTo(555, y + 14).strokeColor(ACCENT_COLOR).lineWidth(0.75).stroke();
  y += 22;
}

// Summary
renderSectionHeader('Professional Summary');
doc.fillColor(TEXT_BODY)
   .fontSize(9)
   .font('Helvetica')
   .text(
     'Results-driven Software Engineer and Builder with a rigorous analytical mindset spanning systems engineering, modern web architectures, and quantitative market principles. Passionate about building resilient distributed applications, low-latency interfaces, and high-impact digital products.',
     40, y, { width: 515, lineGap: 3 }
   );
y += 42;

// Technical Skills
renderSectionHeader('Technical Competencies');

const skills = [
  { category: 'Languages', items: 'TypeScript, JavaScript (ES6+), Python, SQL, C++, HTML5, CSS3' },
  { category: 'Frontend Architecture', items: 'React, Next.js, Tailwind CSS, Responsive Design, State Management, Motion/Canvas' },
  { category: 'Backend & Infrastructure', items: 'Node.js, Express, RESTful APIs, GraphQL, PostgreSQL, Redis, Microservices' },
  { category: 'DevOps & Tooling', items: 'Docker, Git/GitHub, CI/CD Pipelines, Linux/Shell, Cloud Deployment (GCP/AWS)' },
  { category: 'Systems & Financial Concepts', items: 'Quantitative Analysis, Market Dynamics, Concurrency, Latency Optimization' }
];

skills.forEach(skill => {
  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .fontSize(9)
     .text(`•  ${skill.category}: `, 40, y, { continued: true });
  doc.fillColor(TEXT_BODY)
     .font('Helvetica')
     .text(skill.items);
  y += 14;
});
y += 10;

// Experience & Trajectory
renderSectionHeader('Engineering & Project Experience');

const experiences = [
  {
    role: 'Lead Systems Architect & Core Developer',
    org: 'High-Impact Web & Systems Platforms',
    date: '2023 – PRESENT',
    points: [
      'Engineered high-performance web systems utilizing modular TypeScript and Node.js runtimes with sub-100ms response targets.',
      'Architected resilient frontend state conduits and telemetry HUDs delivering seamless responsive interaction across desktop and mobile.',
      'Conducted deterministic concurrency testing and benchmarked API latency under simulated distributed loads.'
    ]
  },
  {
    role: 'Full-Stack Software Engineer',
    org: 'Scalable Cloud & Product Development',
    date: '2022 – 2023',
    points: [
      'Built and shipped accessible, responsive applications using React, modern CSS utility pipelines, and robust REST APIs.',
      'Automated containerized testing workflows with Docker and continuous integration pipelines reducing release cycle overhead.',
      'Partnered closely with product stakeholders to translate multi-perspective engineering requirements into production-ready software.'
    ]
  }
];

experiences.forEach(exp => {
  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .fontSize(10)
     .text(exp.role, 40, y, { continued: true });
  
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica')
     .fontSize(9)
     .text(`  |  ${exp.org}`, { continued: true });
  
  doc.fillColor(ACCENT_COLOR)
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text(exp.date, { align: 'right' });
  y += 14;

  exp.points.forEach(point => {
    doc.fillColor(TEXT_BODY)
       .font('Helvetica')
       .fontSize(8.5)
       .text(`-  ${point}`, 52, y, { width: 500, lineGap: 2 });
    y += 13;
  });
  y += 6;
});

// Featured Projects
renderSectionHeader('Selected Flagship Projects');

const projects = [
  {
    name: 'Cybernetic Portfolio & Interactive Orbital System',
    stack: 'TypeScript, Modern CSS, Node.js, Canvas',
    desc: 'Architected an editorial, high-performance portfolio featuring continuous orbital mathematical mechanics, live terminal telemetry, and zero-dependency interactive modules.'
  },
  {
    name: 'Algorithmic Financial & Quantitative Modeling Suite',
    stack: 'Python, TypeScript, SQL, Time-Series Analysis',
    desc: 'Constructed simulation engines modeling capital allocation, portfolio risk metrics, and volatility structures with deterministic data feeds.'
  },
  {
    name: 'Distributed Cloud Task Orchestration Engine',
    stack: 'Node.js, Redis, Docker, PostgreSQL',
    desc: 'Designed an asynchronous task queue handling concurrent background tasks with failure retries, priority weights, and dead-letter queues.'
  }
];

projects.forEach(proj => {
  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text(proj.name, 40, y, { continued: true });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text(` (${proj.stack})`);
  y += 13;

  doc.fillColor(TEXT_BODY)
     .font('Helvetica')
     .fontSize(8.5)
     .text(proj.desc, 52, y, { width: 500, lineGap: 2 });
  y += 17;
});

// Education
renderSectionHeader('Education');
doc.fillColor(PRIMARY_COLOR)
   .font('Helvetica-Bold')
   .fontSize(9.5)
   .text('Bachelor of Technology / Computer Science & Systems Engineering', 40, y, { continued: true });
doc.fillColor(ACCENT_COLOR)
   .font('Helvetica-Bold')
   .fontSize(8.5)
   .text('2021 – 2025', { align: 'right' });
y += 13;

doc.fillColor(TEXT_MUTED)
   .font('Helvetica')
   .fontSize(8.5)
   .text('Core Coursework: Data Structures & Algorithms, Distributed Systems, Database Management, Operating Systems, Computer Networks, Software Architecture.', 40, y, { width: 515 });

doc.end();

writeStream.on('finish', () => {
  console.log('Resume PDF generated successfully at:', outputPath);
});
