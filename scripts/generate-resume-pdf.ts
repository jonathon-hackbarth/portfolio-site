#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resumePath = join(__dirname, '../public/resume.json');
const outputPath = join(__dirname, '../public/resume.pdf');

interface Profile {
  network: string;
  url: string;
}

interface Basics {
  name: string;
  label: string;
  email: string;
  location?: {
    countryCode?: string;
  };
  url: string;
  summary: string;
  profiles?: Profile[];
}

interface Work {
  position: string;
  name: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

interface Education {
  studyType: string;
  area: string;
  endDate: string;
  institution: string;
}

interface Skill {
  name: string;
  keywords: string[];
}

interface Project {
  name: string;
  description?: string;
  highlights?: string[];
}

interface ResumeData {
  basics: Basics;
  work?: Work[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
}

/**
 * Converts a date string in YYYY-MM format to 'Mon YYYY' format
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';

  const parts = dateStr.split('-');
  const year = parts[0];
  const month = parts[1];

  if (!year) return '';

  if (!month) return year;

  const monthNum = parseInt(month, 10);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthStr = months[monthNum - 1] || '';
  return monthStr ? `${monthStr} ${year}` : year;
}

/**
 * Formats a date range with start and optional end date
 */
function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} – ${end}`;
}

async function generateResumePDF(): Promise<void> {
  console.log('🔄 Generating resume PDF...');

  try {
    const resumeData: ResumeData = JSON.parse(readFileSync(resumePath, 'utf-8'));
    const { basics, work, education, skills, projects } = resumeData;

    // Generate HTML from resume data
    const html = generateResumeHTML(basics, work, education, skills, projects);

    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
    } as Parameters<typeof puppeteer.launch>[0]);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in',
      },
      printBackground: true,
    });

    await browser.close();
    console.log(`✅ Resume PDF generated: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating resume PDF:', error);
    process.exit(1);
  }
}

function generateResumeHTML(
  basics: Basics,
  work?: Work[],
  education?: Education[],
  skills?: Skill[],
  projects?: Project[]
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${basics.name} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      background: white;
      padding: 0;
    }

    .container {
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 2px;
      color: #111827;
    }

    .subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .contact-info {
      font-size: 11px;
      color: #4b5563;
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .contact-info a {
      color: #2563eb;
      text-decoration: none;
    }

    .summary {
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 10px;
      color: #1f2937;
    }

    .header-divider {
      border-top: 2px solid #2563eb;
      margin-bottom: 10px;
    }

    section {
      margin-bottom: 12px;
    }

    h2 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 2px;
      margin-bottom: 8px;
    }

    .job, .edu {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }

    .job-title, .edu-title {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 2px;
    }

    .job-company, .edu-school {
      font-size: 12px;
      color: #2563eb;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .job-summary {
      font-size: 11px;
      color: #4b5563;
      margin-bottom: 6px;
    }

    .highlights {
      font-size: 11px;
      color: #1f2937;
      margin-left: 16px;
      margin-top: 4px;
    }

    .highlights li {
      margin-bottom: 3px;
    }

    .date {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 8px;
    }

    .skill-category {
      border-left: 3px solid #2563eb;
      padding-left: 12px;
      background: #f3f4f6;
      padding: 8px;
      padding-left: 12px;
      page-break-inside: avoid;
    }

    .skill-category-title {
      font-size: 12px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 6px;
    }

    .skill-keywords {
      font-size: 10px;
      color: #4b5563;
      line-height: 1.4;
    }

    section {
      margin-bottom: 12px;
    }

    h2 {
      body {
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <h1>${basics.name}</h1>
    <p class="subtitle">${basics.label}</p>

    <div class="contact-info">
      <a href="mailto:${basics.email}">${basics.email}</a>
      <span>•</span>
      <span>${basics.location?.countryCode || 'US'}</span>
      <span>•</span>
      <a href="${basics.url}" target="_blank">${basics.url?.replace('https://', '').replace('http://', '')}</a>
      ${basics.profiles ? basics.profiles.map(p => `<span>•</span><a href="${p.url}" target="_blank">${p.network}</a>`).join('') : ''}
    </div>

    <p class="summary">${basics.summary}</p>

    <!-- Experience -->
    ${work && work.length > 0 ? `
    <section>
      <h2>Experience</h2>
      ${work.map(job => `
        <div class="job">
          <div class="job-title">${job.position}</div>
          <div class="date">${formatDateRange(job.startDate, job.endDate)}</div>
          <div class="job-company">${job.name}</div>
          ${job.summary ? `<div class="job-summary">${job.summary}</div>` : ''}
          ${job.highlights && job.highlights.length > 0 ? `
            <ul class="highlights">
              ${job.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </section>
    ` : ''}

    <!-- Education -->
    ${education && education.length > 0 ? `
    <section>
      <h2>Education</h2>
      ${education.map(edu => `
        <div class="edu">
          <div class="job-title">${edu.studyType} in ${edu.area}</div>
          <div class="date">${formatDate(edu.endDate)}</div>
          <div class="edu-school">${edu.institution}</div>
        </div>
      `).join('')}
    </section>
    ` : ''}

    <!-- Skills -->
    ${skills && skills.length > 0 ? `
    <section>
      <h2>Skills</h2>
      <div class="skills-grid">
        ${skills.map(skill => `
          <div class="skill-category">
            <div class="skill-category-title">${skill.name}</div>
            <div class="skill-keywords">${skill.keywords.join(', ')}</div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Projects -->
    ${projects && projects.length > 0 ? `
    <section>
      <h2>Projects</h2>
      ${projects.map(proj => `
        <div class="job">
          <div class="job-title">${proj.name}</div>
          ${proj.description ? `<div class="job-summary">${proj.description}</div>` : ''}
          ${proj.highlights && proj.highlights.length > 0 ? `
            <ul class="highlights">
              ${proj.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </section>
    ` : ''}
  </div>
</body>
</html>
  `;
}

generateResumePDF();
