const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Paths
const logoPath = path.join(__dirname, '../public/logo.png');
const humanBannerPath = path.join(__dirname, '../public/healix_human_banner.png');
const pdfOutputPath = path.join(__dirname, '../public/BioLabs_Research_Fellowship_Brochure.pdf');

// Ensure output directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create document (A4 size, portrait)
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  autoFirstPage: true
});

const writeStream = fs.createWriteStream(pdfOutputPath);
doc.pipe(writeStream);

// Helper for drawing clean horizontal lines
function drawDivider(y) {
  doc.moveTo(50, y).lineTo(545, y).lineWidth(1).strokeColor('#E2E8F0').stroke();
}

// Helper for page headers (Logo, Title)
function drawPageHeader(pageTitle) {
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 28, height: 28 });
  }
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0F172A').text('HEALIX BIOLABS', 85, 45);
  doc.font('Helvetica').fontSize(8).fillColor('#64748B').text('RESEARCH FELLOWSHIP PROGRAM 2026', 85, 57);
  
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text(pageTitle.toUpperCase(), 350, 48, { align: 'right', width: 195 });
  drawDivider(78);
}

// Helper for page footers
function drawPageFooter(pageNum) {
  drawDivider(745);
  doc.font('Helvetica').fontSize(8).fillColor('#64748B');
  doc.text('Healix Technologies Pvt. Ltd. | Biomedical Intelligence Network', 50, 757);
  doc.text(`Page ${pageNum} of 5`, 350, 757, { align: 'right', width: 195 });
}

// =============================================================================
// PAGE 1 — COVER PAGE
// =============================================================================
// Background accent vertical block
doc.rect(0, 0, 18, 842).fill('#2563EB');

// Logo Image Centered
if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 250, 180, { width: 95, height: 95 });
}

// Title & Metadata
doc.font('Helvetica-Bold').fontSize(30).fillColor('#0F172A').text('Healix Bio Labs', 50, 310, { align: 'center' });
doc.font('Helvetica-Bold').fontSize(30).fillColor('#2563EB').text('Research Fellowship', 50, 355, { align: 'center' });

doc.font('Helvetica').fontSize(13).fillColor('#64748B').text('Building the Future of Biomedical Intelligence', 50, 410, { align: 'center' });

// Horizontal line divider
doc.rect(80, 500, 435, 1.5).fill('#E2E8F0');

// Detail labels
doc.font('Helvetica-Bold').fontSize(9).fillColor('#0F172A').text('ORGANIZED BY:', 80, 545);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Healix Technologies Pvt. Ltd.\nBiomedical Intelligence Network', 80, 560, { lineGap: 3 });

doc.font('Helvetica-Bold').fontSize(9).fillColor('#0F172A').text('COHORT DETAILS:', 340, 545);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Academic Cycle 2026 - 2027\nApplications Open Quarterly', 340, 560, { lineGap: 3 });

// Bottom subtitle banner
doc.rect(50, 680, 495, 45).fill('#F8FAFC');
doc.rect(50, 680, 495, 45).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#2563EB').text('OFFICIAL CURRICULUM & ADMISSION BROCHURE', 50, 697, { align: 'center' });

drawPageFooter(1);

// =============================================================================
// PAGE 2 — EXECUTIVE SUMMARY & CORE PILLARS
// =============================================================================
doc.addPage();
drawPageHeader('01. Executive Summary');

// Title & Text
doc.font('Helvetica-Bold').fontSize(15).fillColor('#0F172A').text('Build Research That Matters', 50, 105);
doc.font('Helvetica').fontSize(9.5).fillColor('#334155').text('Welcome to the Healix Bio Labs Research Fellowship Program. This prestigious cohort-based module is designed to bridge the gap between textbook education and actual, hands-on scientific breakthroughs. Under the guidance of leading PhD supervisors and senior advisors, fellows participate in active clinical trials, deploy computational genomics pipelines, build neural interfaces, and co-author manuscripts targeted at indexed journals.', 50, 130, { width: 235, align: 'justify', lineGap: 4 });

// Human banner image
if (fs.existsSync(humanBannerPath)) {
  doc.image(humanBannerPath, 305, 125, { width: 240, height: 160 });
}
doc.rect(305, 125, 240, 160).strokeColor('#E2E8F0').lineWidth(1).stroke();

// Row 2: Pillars Grid
doc.font('Helvetica-Bold').fontSize(11).fillColor('#0F172A').text('The Four Core Pillars', 50, 335);

// Pillar 1: Research Mentorship
doc.rect(50, 360, 235, 140).fill('#F8FAFC');
doc.rect(50, 360, 235, 140).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text('1. Research Mentorship', 65, 375);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Fellows are matched directly with active senior PhD advisors from leading institutions to guide study designs, citation reviews, and statistical validations.', 65, 395, { width: 205, lineGap: 3 });

// Pillar 2: Clinical Projects
doc.rect(310, 360, 235, 140).fill('#F8FAFC');
doc.rect(310, 360, 235, 140).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text('2. Active Clinical Projects', 325, 375);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Contribute directly to actual clinical datasets and computational biology pipelines, gaining exposure to real-world challenges and biological outcomes.', 325, 395, { width: 205, lineGap: 3 });

// Pillar 3: Publication Support
doc.rect(50, 520, 235, 140).fill('#F8FAFC');
doc.rect(50, 520, 235, 140).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text('3. Publication Support', 65, 535);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Comprehensive assistance with manuscript drafts, figures generation, citation bibliography management, and responding to editorial reviews.', 65, 555, { width: 205, lineGap: 3 });

// Pillar 4: Professional Network
doc.rect(310, 520, 235, 140).fill('#F8FAFC');
doc.rect(310, 520, 235, 140).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text('4. Professional Network', 325, 535);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Build lifetime associations with co-authors, peers, and senior scientists across prestigious biotech networks and research labs.', 325, 555, { width: 205, lineGap: 3 });

drawPageFooter(2);

// =============================================================================
// PAGE 3 — FELLOWSHIP DOMAINS
// =============================================================================
doc.addPage();
drawPageHeader('02. Fellowship Domains');

doc.font('Helvetica-Bold').fontSize(15).fillColor('#0F172A').text('Academic Streams & Tracks', 50, 105);
doc.font('Helvetica').fontSize(9.5).fillColor('#475569').text('Our fellowship spans six key domains of modern healthcare and biomedical intelligence. Candidates choose one primary stream to focus on.', 50, 125);

// Domains Grid
// Domain 1: Biotechnology
doc.rect(50, 155, 235, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Biotechnology & Genomics', 65, 170);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Focus on mRNA delivery vectors, CRISPR-Cas9 sequence editors, and wet-lab diagnostics workflows designed for targeted oncology treatments.', 65, 195, { width: 205, lineGap: 3 });

// Domain 2: Neuroscience
doc.rect(310, 155, 235, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Neuroscience & Interfaces', 325, 170);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Investigate neural interface scripts, computational brain models, neurodegenerative diagnostics, and EEG datasets sequence processing.', 325, 195, { width: 205, lineGap: 3 });

// Domain 3: AI in Healthcare
doc.rect(50, 310, 235, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('AI & Machine Learning', 65, 325);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Build and train neural network diagnostics models, retinopathy detectors, healthcare natural language tools, and clinical statistics pipelines.', 65, 350, { width: 205, lineGap: 3 });

// Domain 4: Clinical Research
doc.rect(310, 310, 235, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Clinical Trials & Research', 325, 325);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Study clinical trial protocols, data collection tools, cohort statistics, study design, and FDA/clinical validation methodologies.', 325, 350, { width: 205, lineGap: 3 });

// Domain 5: Drug Discovery
doc.rect(50, 465, 235, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Drug Discovery & Design', 65, 480);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Analyze molecular docking simulators, enzyme inhibition assays, protein folding algorithms, and virtual screening compound datasets.', 65, 505, { width: 205, lineGap: 3 });

// Domain 6: Public Health
doc.rect(310, 465, 235, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Public Health & Genomics', 325, 480);
doc.font('Helvetica').fontSize(9).fillColor('#475569').text('Study disease transmission kinetics, epidemiological studies, population genomics data, and policy-oriented biological dashboards.', 325, 505, { width: 205, lineGap: 3 });

// Outcomes stats block
doc.rect(50, 625, 495, 75).fill('#F8FAFC');
doc.rect(50, 625, 495, 75).strokeColor('#E2E8F0').lineWidth(1).stroke();

doc.font('Helvetica-Bold').fontSize(13).fillColor('#2563EB').text('500+', 75, 642, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#64748B').text('STUDENTS TRAINED', 75, 665, { width: 80, align: 'center' });

doc.font('Helvetica-Bold').fontSize(13).fillColor('#0F172A').text('100+', 195, 642, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#64748B').text('RESEARCH PROJECTS', 195, 665, { width: 80, align: 'center' });

doc.font('Helvetica-Bold').fontSize(13).fillColor('#0F172A').text('50+', 315, 642, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#64748B').text('SENIOR MENTORS', 315, 665, { width: 80, align: 'center' });

doc.font('Helvetica-Bold').fontSize(13).fillColor('#2563EB').text('20+', 435, 642, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#64748B').text('PUBLICATIONS', 435, 665, { width: 80, align: 'center' });

drawPageFooter(3);

// =============================================================================
// PAGE 4 — 5-MONTH SYLLABUS & SCHEDULE
// =============================================================================
doc.addPage();
drawPageHeader('03. Fellowship Syllabus');

doc.font('Helvetica-Bold').fontSize(15).fillColor('#0F172A').text('Curriculum & Timeline', 50, 105);
doc.font('Helvetica').fontSize(9.5).fillColor('#475569').text('A structured 5-month cohort schedule guiding fellows from scientific methodology basics to full publication.', 50, 125);

// Month 1
doc.rect(50, 155, 495, 95).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.rect(50, 155, 90, 95).fill('#F8FAFC');
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#2563EB').text('MONTH 01', 55, 195, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Research Foundations & Literature Reviews', 155, 168);
doc.font('Helvetica').fontSize(8.5).fillColor('#475569').text('• Learn search indexing strategies across PubMed, Scopus, and Web of Science.\n• Draft systematic reviews, research hypotheses, and study designs.\n• Establish ANOVA frameworks, bio-statistics tools, and p-value validation layouts.', 155, 188, { lineGap: 3 });

// Month 2
doc.rect(50, 265, 495, 95).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.rect(50, 265, 90, 95).fill('#F8FAFC');
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#2563EB').text('MONTH 02', 55, 305, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Mentor Matching & Specific Aims Prep', 155, 278);
doc.font('Helvetica').fontSize(8.5).fillColor('#475569').text('• Match with assigned PhD advisors and prospective clinical research guides.\n• Write specific aims proposals, literature scopes, and topics validation outlines.\n• Configure computational frameworks, local development nodes, and servers.', 155, 298, { lineGap: 3 });

// Month 3
doc.rect(50, 375, 495, 95).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.rect(50, 375, 90, 95).fill('#F8FAFC');
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#2563EB').text('MONTH 03', 55, 415, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Project Implementation & Execution', 155, 388);
doc.font('Helvetica').fontSize(8.5).fillColor('#475569').text('• Execute computational biology runs or clinical trials sequence evaluations.\n• Clean data outputs, compile trial results, and run validation algorithms.\n• Prepare primary figures, datasets charts, and present update report to the board.', 155, 408, { lineGap: 3 });

// Month 4
doc.rect(50, 485, 495, 95).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.rect(50, 485, 90, 95).fill('#F8FAFC');
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#2563EB').text('MONTH 04', 55, 525, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Manuscript Writing & References Configuration', 155, 498);
doc.font('Helvetica').fontSize(8.5).fillColor('#475569').text('• Write manuscript sections: Abstract, Intro, Methods, Results, and Discussion.\n• Setup bibliography managers (Mendeley, Zotero) and select target journals.\n• Complete internal reviews with advisors and resolve draft edit corrections.', 155, 518, { lineGap: 3 });

// Month 5
doc.rect(50, 595, 495, 95).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.rect(50, 595, 90, 95).fill('#F8FAFC');
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#2563EB').text('MONTH 05', 55, 635, { width: 80, align: 'center' });
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Journal Submission & Public Presentation', 155, 608);
doc.font('Helvetica').fontSize(8.5).fillColor('#475569').text('• Submit finalized manuscript draft to target peer-reviewed indexed journals.\n• Deliver public cohort presentation during graduation ceremony.\n• Receive Bio Labs Research Fellowship Certification and advisor letters of recommendation.', 155, 628, { lineGap: 3 });

drawPageFooter(4);

// =============================================================================
// PAGE 5 — MENTORSHIP & ADMISSION PROCESS
// =============================================================================
doc.addPage();
drawPageHeader('04. Advisory Board');

// Mentorship Board
doc.font('Helvetica-Bold').fontSize(14).fillColor('#0F172A').text('Elite Mentorship Board', 50, 105);
doc.font('Helvetica').fontSize(9.5).fillColor('#475569').text('Learn directly from active PhD supervisors leading institutional clinical streams.', 50, 125);

// Mentor 1
doc.rect(50, 150, 235, 75).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Dr. Priya Sharma, PhD', 62, 162);
doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748B').text('AIIMS New Delhi • mRNA Delivery Vectors', 62, 179);
doc.font('Helvetica').fontSize(8).fillColor('#475569').text('Researching non-viral lipid nanoparticles for vaccine delivery vectors.', 62, 192, { width: 210, lineGap: 2 });

// Mentor 2
doc.rect(310, 150, 235, 75).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Dr. Avnish Verma, PhD', 322, 162);
doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748B').text('IIT Bombay • Computational Genomics', 322, 179);
doc.font('Helvetica').fontSize(8).fillColor('#475569').text('Focusing on DNA sequence analysis and machine learning genome annotations.', 322, 192, { width: 210, lineGap: 2 });

// Mentor 3
doc.rect(50, 235, 235, 75).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Dr. Rajesh Mehta, PhD', 62, 247);
doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748B').text('IISc Bangalore • Neural Interfaces', 62, 264);
doc.font('Helvetica').fontSize(8).fillColor('#475569').text('Investigating prosthetic controller scripts and brain-computer interfaces.', 62, 277, { width: 210, lineGap: 2 });

// Mentor 4
doc.rect(310, 235, 235, 75).strokeColor('#E2E8F0').lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Dr. Sunita Rao, PhD', 322, 247);
doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748B').text('IIT Delhi • AI Drug Discovery', 322, 264);
doc.font('Helvetica').fontSize(8).fillColor('#475569').text('Applying graph neural networks to screen molecular docking interactions.', 322, 277, { width: 210, lineGap: 2 });

// Admissions & Requirements
doc.font('Helvetica-Bold').fontSize(14).fillColor('#0F172A').text('Admissions & Requirements', 50, 335);
doc.font('Helvetica').fontSize(9.5).fillColor('#334155').text('The Bio Labs Research Fellowship is a highly selective program. Applications are screened quarterly by our academic board. Selectees receive comprehensive funding, computational resources, and direct supervisor access.', 50, 355, { width: 495, lineGap: 4, align: 'justify' });

doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Application Steps:', 50, 420);
doc.font('Helvetica').fontSize(9).fillColor('#334155').text('1. Online Application: Submit transcripts, research stream choices, and CV at healix-technologies.com/fellowships.\n2. Statement of Purpose (SOP): Explain your research targets and why you align with Healix BioLabs.\n3. Technical Interview: Peer alignment interview with assigned stream leads and prospective advisors.', 50, 440, { lineGap: 4 });

doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0F172A').text('Admissions Cycle Schedule:', 50, 510);
doc.font('Helvetica').fontSize(9).fillColor('#334155').text('• Applications Screening Phase: Active and open quarterly.\n• Screening Process: 14 business days from date of submission.\n• Cohort Start: January, April, July, and October quarterly cycles.', 50, 530, { lineGap: 4 });

// Contact Info desk
doc.rect(50, 615, 495, 95).fill('#F8FAFC');
doc.rect(50, 615, 495, 95).strokeColor('#E2E8F0').lineWidth(1).stroke();

doc.font('Helvetica-Bold').fontSize(11).fillColor('#2563EB').text('HEALIX BIOLABS ADMISSION DESK', 70, 630);
doc.font('Helvetica').fontSize(8.5).fillColor('#475569').text('For queries regarding selection criteria, curriculum streams, or institutional partnerships, contact our academic office at:', 70, 650, { width: 330, lineGap: 2 });
doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0F172A').text('Email: academic-board@healix-technologies.com  |  Web: healix-biolabs.org', 70, 683);

if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 455, 630, { width: 62, height: 62 });
}

drawPageFooter(5);

// End document
doc.end();

console.log('PDF Brochure compiled successfully in: public/BioLabs_Research_Fellowship_Brochure.pdf');
