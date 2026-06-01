import { prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing database
  await prisma.emailLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.researcher.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.fellowshipApplication.deleteMany();

  console.log("Database cleared.");

  // 2. Seed Institutions
  const instHealix = await prisma.institution.create({
    data: {
      name: "Healix Technologies Pvt. Ltd.",
      location: "New Delhi, India",
      description: "Building the future of biomedical intelligence and research networks.",
      website: "https://healix.com",
      isVerified: true,
    },
  });

  const instAiims = await prisma.institution.create({
    data: {
      name: "All India Institute of Medical Sciences (AIIMS)",
      location: "New Delhi, India",
      description: "India's premier public medical school and research hospital.",
      website: "https://aiims.edu",
      isVerified: true,
    },
  });

  const instIisc = await prisma.institution.create({
    data: {
      name: "Indian Institute of Science (IISc)",
      location: "Bangalore, India",
      description: "A leading public university for scientific research and higher education.",
      website: "https://iisc.ac.in",
      isVerified: true,
    },
  });

  console.log("Institutions seeded.");

  // 3. Seed Users
  const userAdmin = await prisma.user.create({
    data: {
      email: "admin@healix.com",
      name: "Healix Administrator",
      role: "ADMIN",
    },
  });

  const userAvnish = await prisma.user.create({
    data: {
      email: "avnish.verma@healix.com",
      name: "Dr. Avnish Verma",
      role: "RESEARCHER",
      photoUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=avnish",
    },
  });

  const userPriya = await prisma.user.create({
    data: {
      email: "priya.sharma@iisc.ac.in",
      name: "Dr. Priya Sharma",
      role: "RESEARCHER",
      photoUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=priya",
    },
  });

  const userRajesh = await prisma.user.create({
    data: {
      email: "rajesh.patel@iitb.ac.in",
      name: "Dr. Rajesh Patel",
      role: "RESEARCHER",
      photoUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=rajesh",
    },
  });

  console.log("Users seeded.");

  // 4. Seed Researchers
  const resAvnish = await prisma.researcher.create({
    data: {
      userId: userAvnish.id,
      researchId: "HX-RES-2026-0001",
      fullName: "Dr. Avnish Verma",
      photoUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=avnish",
      bio: "Senior Researcher in Medical AI and Computational Biology. Focused on neural networks, diagnostic radiology segmentation, and non-invasive brain-machine interfaces. Co-leading national biomedical informatics outreach projects.",
      institutionName: "Healix Technologies Pvt. Ltd.",
      researchInterests: JSON.stringify(["Medical AI", "Computer Vision", "Diagnostics", "Neural Engineering"]),
      skills: JSON.stringify(["PyTorch", "Next.js", "Medical CT Imaging", "CUDA", "EEG Decoding"]),
      linkedIn: "https://linkedin.com/in/avnish-verma-placeholder",
      isVerified: true,
      researchScore: 88.5,
      publicationCount: 2,
      projectCount: 2,
      slug: "avnish-verma",
    },
  });

  const resPriya = await prisma.researcher.create({
    data: {
      userId: userPriya.id,
      researchId: "HX-RES-2026-0002",
      fullName: "Dr. Priya Sharma",
      photoUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=priya",
      bio: "Associate Professor at IISc Bangalore. Specialize in CRISPR-Cas9 genome editing, cardiovascular genomics, and nanoparticle drug delivery systems. Recipient of the Young Scientist Award 2025.",
      institutionName: "Indian Institute of Science (IISc)",
      researchInterests: JSON.stringify(["CRISPR-Cas9", "Gene Editing", "Cardiovascular", "Nanoparticles"]),
      skills: JSON.stringify(["Molecular Biology", "Crispr-Design", "Lipid Nanoparticles", "Flow Cytometry"]),
      linkedIn: "https://linkedin.com/in/priya-sharma-placeholder",
      isVerified: true,
      researchScore: 92.0,
      publicationCount: 2,
      projectCount: 1,
      slug: "priya-sharma",
    },
  });

  const resRajesh = await prisma.researcher.create({
    data: {
      userId: userRajesh.id,
      researchId: "HX-RES-2026-0003",
      fullName: "Dr. Rajesh Patel",
      photoUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=rajesh",
      bio: "Researcher in biomedical instrumentation and biomechanics. Developing low-cost rehabilitation prostheses and muscle sensor systems at IIT Bombay.",
      institutionName: "IIT Bombay",
      researchInterests: JSON.stringify(["Biomechanics", "Prosthetics", "EMG Sensors"]),
      skills: JSON.stringify(["SolidWorks", "Embedded Systems", "MATLAB", "Signal Processing"]),
      linkedIn: "https://linkedin.com/in/rajesh-patel-placeholder",
      isVerified: false,
      researchScore: 45.0,
      publicationCount: 0,
      projectCount: 0,
      slug: "rajesh-patel",
    },
  });

  console.log("Researchers seeded.");

  // 5. Seed Publications
  const pub1 = await prisma.publication.create({
    data: {
      title: "Deep Learning Architectures for COVID-19 Pulmonary Damage Classification",
      abstract: "This white paper presents an end-to-end convolutional neural network framework designed to classify lung damage severity from computed tomography (CT) scans. We show a 94.2% diagnostic accuracy, outperforming classical computer vision baselines, and outline potential integrations for real-time triage in critical care units.",
      keywords: JSON.stringify(["Deep Learning", "COVID-19", "Computed Tomography", "Cardiovascular", "Diagnostics"]),
      authors: JSON.stringify(["Dr. Avnish Verma", "Dr. Priya Sharma"]),
      category: "WHITE_PAPER",
      isApproved: true,
      researcherId: resAvnish.id,
      pdfUrl: "/mock-papers/paper-1.pdf",
    },
  });

  const pub2 = await prisma.publication.create({
    data: {
      title: "CRISPR-Cas9 Mediated Gene Silencing of PCSK9 in Human Hepatocytes",
      abstract: "We demonstrate the highly specific knockdown of the PCSK9 gene using lipid nanoparticle-delivered CRISPR-Cas9 components in vitro. Our findings report a 78% reduction in extracellular PCSK9 levels with no detectable off-target mutagenic events in deep-sequencing panels, suggesting a viable path for single-dose genetic therapeutics.",
      keywords: JSON.stringify(["CRISPR-Cas9", "PCSK9", "Gene Editing", "Cardiovascular Diseases"]),
      authors: JSON.stringify(["Dr. Priya Sharma"]),
      category: "RESEARCH_ARTICLE",
      isApproved: true,
      researcherId: resPriya.id,
      pdfUrl: "/mock-papers/paper-2.pdf",
    },
  });

  const pub3 = await prisma.publication.create({
    data: {
      title: "A Survey of Non-Invasive Neural Interface Architectures for Upper-Limb Prosthetics",
      abstract: "This literature review examines the state-of-the-art in electroencephalography (EEG) and electromyography (EMG) decoding algorithms. We evaluate deep learning models, filter bank common spatial patterns, and reinforcement learning protocols, identifying main bottlenecks in long-term calibration stability and tactile sensory feedback replication.",
      keywords: JSON.stringify(["Neural Interfaces", "EEG", "EMG", "Prosthetics", "Reinforcement Learning"]),
      authors: JSON.stringify(["Dr. Avnish Verma"]),
      category: "LITERATURE_REVIEW",
      isApproved: false, // Pending Approval for testing
      researcherId: resAvnish.id,
      pdfUrl: "/mock-papers/paper-3.pdf",
    },
  });

  console.log("Publications seeded.");

  // 6. Seed Projects
  const proj1 = await prisma.project.create({
    data: {
      title: "Project BioShield: AI-Driven Pandemic Response",
      description: "Collaborative research to develop predictive early-warning systems and deep learning models for lung pathology identification during disease outbreaks.",
      category: "Biomedical Informatics",
      timeline: "Jun 2026 - Dec 2026",
      progress: 45,
      creatorId: resAvnish.id,
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      title: "NeuroHeal: Tactical EEG Decoding",
      description: "Developing stable, long-term calibration algorithms for non-invasive brain-computer interfaces (BCIs) mapping motor imagery to physical prosthetic units.",
      category: "Neural Engineering",
      timeline: "Jan 2026 - Aug 2026",
      progress: 70,
      creatorId: resAvnish.id,
    },
  });

  console.log("Projects seeded.");

  // 7. Seed Project Members
  await prisma.projectMember.create({
    data: {
      projectId: proj1.id,
      researcherId: resAvnish.id,
      role: "OWNER",
    },
  });

  await prisma.projectMember.create({
    data: {
      projectId: proj1.id,
      researcherId: resPriya.id,
      role: "COLLABORATOR",
    },
  });

  await prisma.projectMember.create({
    data: {
      projectId: proj2.id,
      researcherId: resAvnish.id,
      role: "OWNER",
    },
  });

  console.log("Project Members seeded.");

  // 8. Seed Fellowship Applications
  await prisma.fellowshipApplication.create({
    data: {
      fullName: "Aarav Mehta",
      institutionName: "IIT Delhi",
      course: "M.Tech in Bioinformatics",
      researchInterests: JSON.stringify(["Computational Genomics", "Machine Learning in Drug Discovery"]),
      cvUrl: "/mock-cvs/cv-aarav.pdf",
      statementOfPurpose: "I am passionate about applying modern deep learning models to predict binding affinities of small molecules. Healing BioLabs provides the perfect collaborative network for me to pursue this research under the mentorship of leading Indian scientists.",
      status: "PENDING",
    },
  });

  await prisma.fellowshipApplication.create({
    data: {
      fullName: "Ananya Roy",
      institutionName: "BITS Pilani",
      course: "B.Pharm (Hons.)",
      researchInterests: JSON.stringify(["Nanoparticle Drug Delivery", "Gene Editing"]),
      cvUrl: "/mock-cvs/cv-ananya.pdf",
      statementOfPurpose: "My research project focuses on target delivery systems using lipid nanoparticles. I want to learn more about translating genome editing from bench to clinic under Healix guidance.",
      status: "PENDING",
    },
  });

  console.log("Fellowships seeded.");

  // 9. Seed some Email Logs & Notifications
  await prisma.emailLog.create({
    data: {
      to: "avnish.verma@healix.com",
      subject: "Welcome to Healix BioLabs",
      body: "Welcome message for Dr. Avnish Verma with Research ID HX-RES-2026-0001.",
      status: "SENT",
    },
  });

  await prisma.notification.create({
    data: {
      userId: userAvnish.id,
      title: "Welcome aboard",
      message: "Your researcher profile has been successfully set up. Research ID generated: HX-RES-2026-0001",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
