const { Client } = require("pg");

async function main() {
  console.log("Connecting to PostgreSQL database via IPv6...");
  const client = new Client({
    host: '2406:da12:5ca:b702:7a3c:b06d:3a9d:9d10',
    port: 5432,
    user: 'postgres',
    password: 'IITIAN@1234m',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully!");

    console.log("Creating leadership_members table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS leadership_members (
        id TEXT PRIMARY KEY,
        section TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        institution TEXT NOT NULL,
        expertise TEXT NOT NULL DEFAULT '[]',
        photo TEXT NOT NULL,
        linkedin TEXT NOT NULL,
        bio TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log("leadership_members table created.");

    console.log("Granting privileges on leadership_members table...");
    await client.query(`
      GRANT ALL PRIVILEGES ON TABLE leadership_members TO postgres, service_role, authenticated, anon, authenticator
    `);
    console.log("Privileges granted.");

    // Check if table is empty, and seed the initial members if empty
    const countRes = await client.query("SELECT COUNT(*) FROM leadership_members");
    const count = parseInt(countRes.rows[0].count);
    console.log("Current row count in leadership_members:", count);

    if (count === 0) {
      console.log("Seeding initial leadership members...");
      const initialMembers = [
        // 1. Board of Advisors
        {
          section: "Board of Advisors",
          name: "Dr. Sameer Kalra",
          role: "Clinical Advisor & Consultant",
          institution: "Sir Ganga Ram Hospital",
          expertise: ["Clinical Research", "Internal Medicine", "Healthcare Policy"],
          photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Dr. Sameer Kalra is a senior consultant and clinical advisor at Sir Ganga Ram Hospital, New Delhi, with over two decades of clinical experience. He specializes in health policy, internal medicine, and patient care diagnostics.",
          sortOrder: 1
        },
        {
          section: "Board of Advisors",
          name: "Dr. Renu Deshmukh",
          role: "Associate Professor of Biophysics",
          institution: "AIIMS New Delhi",
          expertise: ["Structural Biology", "Bio-Imaging", "Genomics"],
          photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Dr. Renu Deshmukh is a biophysics researcher and faculty member at AIIMS New Delhi. Her work focuses on electron microscopy, molecular dynamics, and cell structural integrity.",
          sortOrder: 2
        },
        {
          section: "Board of Advisors",
          name: "Prof. K. Ramesh",
          role: "Professor of Biomedical Engineering",
          institution: "IIT Delhi",
          expertise: ["Tissue Engineering", "Biomaterials", "Microfluidics"],
          photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Prof. K. Ramesh is a senior professor in the Department of Biomedical Engineering at IIT Delhi. He leads research in bio-material design, artificial organs, and lab-on-a-chip technologies.",
          sortOrder: 3
        },
        {
          section: "Board of Advisors",
          name: "Dr. Aditya Sen",
          role: "Chief Scientific Advisor",
          institution: "Healix Technologies",
          expertise: ["Bio-computing", "Molecular Modeling", "Drug Discovery"],
          photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Dr. Aditya Sen is an industry scientist and lead advisor at Healix Technologies, bringing deep expertise in computer-aided drug design, high-performance computing, and molecular dynamics simulations.",
          sortOrder: 4
        },
        // 2. Executive Leadership
        {
          section: "Executive Leadership",
          name: "Avnish Verma",
          role: "Founder & CEO",
          institution: "Healix BioLabs / IIT Delhi",
          expertise: ["Bio-Computation", "AI in Healthcare", "System Architecture"],
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Avnish Verma is the Founder & CEO of Healix BioLabs. A researcher at IIT Delhi, he is building decentralized biomedical intelligence networks to bridge the gap between academic theory and clinical trial execution.",
          sortOrder: 5
        },
        {
          section: "Executive Leadership",
          name: "Mahima Sharma",
          role: "Chief Operating Officer",
          institution: "Healix BioLabs",
          expertise: ["Operations Management", "Research Alliances", "Corporate Growth"],
          photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Mahima Sharma is the Chief Operating Officer of Healix BioLabs. She oversees operations, strategic institutional partnerships, and platform growth, ensuring clinical networks run efficiently.",
          sortOrder: 6
        },
        {
          section: "Executive Leadership",
          name: "Debarghya Bag",
          role: "Chief Medical Officer",
          institution: "Healix BioLabs",
          expertise: ["Clinical Trials", "Immunology", "Medical Devices"],
          photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Debarghya Bag serves as the Chief Medical Officer at Healix BioLabs. He coordinates clinical trial protocols, device certifications, and immunology research pipelines.",
          sortOrder: 7
        },
        // 3. Research & Innovation Council
        {
          section: "Research & Innovation Council",
          name: "Swaranjali Sonje",
          role: "Head of Research & Innovation",
          institution: "Healix BioLabs",
          expertise: ["Biomedical Engineering", "Computational Neuroscience", "Deep Learning"],
          photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Swaranjali Sonje leads the Research & Innovation Council, specializing in signal processing for brain-computer interfaces, deep learning in diagnostics, and clinical engineering.",
          sortOrder: 8
        },
        {
          section: "Research & Innovation Council",
          name: "Ojas Sah",
          role: "Computational Biology Lead",
          institution: "Research & Innovation Council",
          expertise: ["Genomics Data Mining", "Structural Proteomics", "Bio-AI Systems"],
          photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Ojas Sah is a computational biologist leading genomic data mining, structural protein folding calculations, and AI-driven biological modeling pipelines.",
          sortOrder: 9
        },
        {
          section: "Research & Innovation Council",
          name: "Biomedical Engineering Team",
          role: "Core Engineering Division",
          institution: "Healix BioLabs",
          expertise: ["Sensor Fusion", "Microfluidic Chips", "Wearable Health Tech"],
          photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "The Biomedical Engineering Team at Healix BioLabs builds hardware and firmware solutions, including multi-channel EEG headsets, microfluidic lab chips, and telemetry sensor nodes.",
          sortOrder: 10
        },
        {
          section: "Research & Innovation Council",
          name: "Dr. Vineet Kapoor",
          role: "Clinical Innovation Lead",
          institution: "Research & Innovation Council",
          expertise: ["Nanomedicine", "Targeted Drug Delivery", "Toxicology"],
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Dr. Vineet Kapoor directs toxicology analysis and nanomaterial synthesis, designing lipid vectors and targeted drug carrier systems.",
          sortOrder: 11
        },
        // 4. Founding Research Associates
        {
          section: "Founding Research Associates",
          name: "Dhruv Advani",
          role: "Founding Research Associate",
          institution: "AIIMS Delhi",
          expertise: ["Clinical Research", "Medical Education", "Healthcare Innovation"],
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Dhruv Advani is a founding research associate based at AIIMS Delhi. He leads clinical education, trials research, and health tech innovations to improve patient outcomes.",
          sortOrder: 12
        },
        {
          section: "Founding Research Associates",
          name: "Rohan Mehta",
          role: "Research Associate",
          institution: "IIT Bombay",
          expertise: ["Orthotics", "Bio-materials", "Finite Element Analysis"],
          photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Rohan Mehta is a mechanical and biomedical associate at IIT Bombay. He specializes in designing smart orthotics, finite element stress modeling, and biocompatibility assays.",
          sortOrder: 13
        },
        {
          section: "Founding Research Associates",
          name: "Ananya Sen",
          role: "Cognitive Science Associate",
          institution: "Delhi University",
          expertise: ["Behavioral Psychology", "Neuropsychology", "Cognitive Modeling"],
          photo: "https://images.unsplash.com/photo-1534751516642-a131ffd103fd?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Ananya Sen is a cognitive science researcher focusing on neuropsychological evaluations, brain-computer haptic integrations, and behavioral psychology.",
          sortOrder: 14
        },
        {
          section: "Founding Research Associates",
          name: "Future Associates",
          role: "Join the Network",
          institution: "Healix BioLabs",
          expertise: ["Biostatistics", "Clinical Data", "Scientific Writing"],
          photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Healix BioLabs is constantly expanding its founding network of research associates. Apply to collaborate on global publications and gain access to computing nodes.",
          sortOrder: 15
        },
        // 5. Mentors & Academic Experts
        {
          section: "Mentors & Academic Experts",
          name: "Dr. Shalini Mukherji",
          role: "Principal Scientist",
          institution: "CSIR-IGIB",
          expertise: ["Transcriptomics", "Epigenetics", "Single-Cell Sequencing"],
          photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Dr. Shalini Mukherji is a senior principal investigator at CSIR-IGIB, mentoring students in high-throughput sequencing analysis, RNA biology, and epigenetic profiling.",
          sortOrder: 16
        },
        {
          section: "Mentors & Academic Experts",
          name: "Kartik Nair",
          role: "PhD Candidate & Mentor",
          institution: "IISc Bangalore",
          expertise: ["Quantum Computing", "Biophysics", "Math Modeling"],
          photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Kartik Nair is a doctoral researcher at IISc Bangalore. He conducts research in quantum chemistry simulations, molecular docking models, and biophysical kinetics.",
          sortOrder: 17
        },
        {
          section: "Mentors & Academic Experts",
          name: "Prof. Sandeep Verma",
          role: "Professor of Chemistry",
          institution: "IIT Kanpur",
          expertise: ["Peptide Engineering", "Nucleic Acids", "Bio-Organic Chemistry"],
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Prof. Sandeep Verma is a chemical biology professor at IIT Kanpur, leading research in peptide architecture, bio-inspired materials, and nucleic acid interactions.",
          sortOrder: 18
        },
        {
          section: "Mentors & Academic Experts",
          name: "Rajeshwari Nair",
          role: "VP of Bio-pharma R&D",
          institution: "Biocon India",
          expertise: ["Bio-similar Dev", "GMP Protocols", "FDA Filings"],
          photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Rajeshwari Nair is a biopharmaceutical executive with Biocon India. She mentors student teams on manufacturing regulations, FDA filings, and clinical safety compliance.",
          sortOrder: 19
        },
        // 6. Mental Health & Human Development
        {
          section: "Mental Health & Human Development Division",
          name: "Sudiksha Sharma",
          role: "Lead Psychologist",
          institution: "Healix BioLabs Division",
          expertise: ["Clinical Psychology", "Cognitive Behavioral", "Adolescent Dev"],
          photo: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Sudiksha Sharma leads clinical psychology research at the Division of Human Development, developing digital therapy frameworks and mental health diagnostic models.",
          sortOrder: 20
        },
        {
          section: "Mental Health & Human Development Division",
          name: "Chaavi Sharma",
          role: "Human Development Specialist",
          institution: "Healix BioLabs Division",
          expertise: ["Neurodevelopment", "Early Intervention", "Behavioral Science"],
          photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250",
          linkedin: "https://linkedin.com",
          bio: "Chaavi Sharma is a child psychologist and neurodevelopment specialist. She leads early intervention research and behavioral therapies for students and young adults.",
          sortOrder: 21
        }
      ];

      for (const m of initialMembers) {
        const id = Math.random().toString(36).substring(2, 11);
        await client.query(
          `INSERT INTO leadership_members (id, section, name, role, institution, expertise, photo, linkedin, bio, "sortOrder") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, m.section, m.name, m.role, m.institution, JSON.stringify(m.expertise), m.photo, m.linkedin, m.bio, m.sortOrder]
        );
      }
      console.log("Initial leadership members seeded.");
    }

    await client.end();
    console.log("Migration and seed complete!");
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}

main();
