/**
 * Master FlowCV Demo Resume Dataset
 * Contains the complete, authentic demo resumes for all FlowCV design templates
 * exactly as shown in the FlowCV screenshots.
 */

export const FLOWCV_DEMO_DATA = {
  // ── 1. Classic Clear: Emily Carter (Project Manager, Toronto) ──
  "classic-clear": {
    personalInfo: {
      fullName: "Emily Carter",
      jobTitle: "Project Manager",
      email: "emily.carter@email.com",
      phone: "+1 416-235-1847",
      location: "Toronto, Canada",
      linkedin: "linkedin.com/in/emily-carter",
      portfolio: "",
      photo: "",
    },
    summary:
      "Project Manager with six years of experience coordinating cross-functional initiatives in technology and business operations. Skilled in stakeholder communication, project planning, risk tracking, and delivery governance across complex environments. Known for building practical workflows, improving team alignment, and keeping priorities moving under tight deadlines.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Project Manager",
        company: "Northbridge Digital",
        location: "Toronto, Canada",
        startDate: "2021/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Managed release plans across product, engineering, and operations teams.\n• Coordinated stakeholder updates, risk reviews, and milestone reporting.\n• Improved delivery tracking, reducing gaps across cross-team communication.",
      },
      {
        id: "exp-2",
        jobTitle: "Project Coordinator",
        company: "Maplefield Solutions",
        location: "Toronto, Canada",
        startDate: "2018/07",
        endDate: "2021/12",
        currentlyWorking: false,
        description:
          "• Supported schedules, budgets, and documentation for transformation initiatives.\n• Facilitated team meetings and maintained cross-department action logs.\n• Escalated risks before blockers affected delivery timelines.",
      },
      {
        id: "exp-3",
        jobTitle: "Operations Analyst",
        company: "BrightPath Services",
        location: "Ottawa, Canada",
        startDate: "2017/01",
        endDate: "2018/06",
        currentlyWorking: false,
        description:
          "• Analyzed workflow data to identify service delivery delays and efficiency bottlenecks.\n• Prepared executive reports supporting resource planning and project prioritization.",
      },
      {
        id: "exp-4",
        jobTitle: "Project Management Student Assistant",
        company: "University of Toronto",
        location: "Toronto, Canada",
        startDate: "2016/09",
        endDate: "2017/04",
        currentlyWorking: false,
        description:
          "• Supported project timelines, meeting notes, and team follow-ups.\n• Updated task boards and tracked deadlines for student initiatives.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Toronto Metropolitan University",
        degree: "Bachelor of Commerce in Management",
        fieldOfStudy: "Management",
        startDate: "2013",
        endDate: "2017",
        location: "Toronto, Canada",
      },
      {
        id: "edu-2",
        institution: "Algonquin College",
        degree: "Diploma in Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2011",
        endDate: "2013",
        location: "Ottawa, Canada",
      },
    ],
    skills: [
      { id: "s1", name: "Project Planning", level: 95 },
      { id: "s2", name: "Stakeholder Management", level: 90 },
      { id: "s3", name: "Risk Management", level: 85 },
      { id: "s4", name: "Agile Delivery", level: 90 },
      { id: "s5", name: "Budget Tracking", level: 85 },
      { id: "s6", name: "Process Improvement", level: 88 },
      { id: "s7", name: "Jira", level: 92 },
      { id: "s8", name: "Microsoft Project", level: 85 },
    ],
    certifications: [
      { id: "c1", name: "Project Management Professional (PMP)", issuer: "PMI", date: "2021" },
      { id: "c2", name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", date: "2019" },
      { id: "c3", name: "Google Project Management Certificate", issuer: "Google", date: "2020" },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "French", proficiency: "Fluent", level: 85 },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "certifications",
      "languages",
    ],
    theme: {
      primaryColor: "#111827",
      fontFamily: "serif",
    },
  },

  // ── 2. Atlantic Blue: Brian T. Wayne (Business Development, Redondo) ──
  "atlantic-blue": {
    personalInfo: {
      fullName: "Brian T. Wayne",
      jobTitle: "Business Development Consultant",
      email: "brian@wayne.com",
      phone: "+1 213-754-2010",
      location: "2284 Pacific Coast Hwy, Redondo, CA, 90261",
      linkedin: "linkedin.com/in/wayne-2345",
      portfolio: "wayne.com",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "I'm Brian Thomas Wayne, a business development consultant with a passion for helping companies achieve their growth potential. With my MBA degree and extensive experience in strategy and relationship building, I strive to provide innovative solutions that drive success for my clients.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Business Development Consultant",
        company: "Applewood Inc.",
        location: "New York, USA",
        startDate: "2022",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Developed and implemented strategic plans resulting in a 30% increase in new business opportunities.\n• Collaborated with cross-functional teams to drive business growth and expansion.\n• Established and maintained relationships with key partners resulting in a 25% increase in sales revenue.\n• Conducted market research and analysis to identify new market opportunities resulting in new product lines.",
      },
      {
        id: "exp-2",
        jobTitle: "Business Development",
        company: "ACTUS",
        location: "Los Angeles, USA",
        startDate: "2018",
        endDate: "2022",
        currentlyWorking: false,
        description:
          "• Worked closely with tech and software companies to provide expert sales outsourcing services.\n• Built and managed dedicated sales teams in Europe, the Americas, and Asia Pacific.\n• Contributed to Actus Sales Outsourcing's proven track record of software and tech solutions over 15 yrs.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Harvard Business School",
        degree: "Master of Business Administration (MBA)",
        fieldOfStudy: "Business Administration",
        startDate: "2016",
        endDate: "2018",
        location: "Boston, MA",
      },
      {
        id: "edu-2",
        institution: "University of California, Los Angeles (UCLA)",
        degree: "Bachelor of Science in Economics",
        fieldOfStudy: "Economics",
        startDate: "2012",
        endDate: "2016",
        location: "Los Angeles, CA",
      },
    ],
    skills: [
      { id: "s1", name: "Strategic thinking & problem-solving", level: 95 },
      { id: "s2", name: "Relationship building & networking", level: 95 },
      { id: "s3", name: "Effective communication & negotiation", level: 90 },
      { id: "s4", name: "Sales & business development strategy", level: 92 },
      { id: "s5", name: "Team management & leadership", level: 88 },
      { id: "s6", name: "Creative & innovative thinking", level: 90 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "Spanish", proficiency: "Advanced", level: 80 },
    ],
    awards: [
      { id: "a1", title: "Outstanding Business Student Award", issuer: "University of Southern California", date: "2014" },
      { id: "a2", title: "Dean's List", issuer: "University of California, Los Angeles", date: "2012-2016" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "awards",
    ],
    theme: {
      primaryColor: "#1E293B",
      fontFamily: "sans",
    },
  },

  // ── 3. Mercury Flow: Camila Rivera (Sales Manager, Miami) ──
  "mercury-flow": {
    personalInfo: {
      fullName: "Camila Rivera",
      jobTitle: "Sales Manager",
      email: "camila.rivera@email.com",
      phone: "+1 305 555 0184",
      location: "Miami, United States",
      linkedin: "linkedin.com/in/camila-rivera",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Results-driven sales professional with 6+ years of experience in account growth, client relationship management, and pipeline development across B2B environments. Strong track record of improving conversion rates, supporting revenue targets, and building trust with diverse customer groups in English- and Spanish-speaking markets. Brings a practical, people-focused approach to sales planning, team coordination, and long-term customer retention.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Sales Manager",
        company: "BrightPath Business Solutions",
        location: "Miami, United States",
        startDate: "2021/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Manage a portfolio of mid-market clients across retail and service sectors.\n• Lead quarterly sales planning and improved team conversion rates by 14%.\n• Build strong client relationships that increased renewals and upsell.",
      },
      {
        id: "exp-2",
        jobTitle: "Account Manager",
        company: "Horizon Office Supply",
        location: "Orlando, United States",
        startDate: "2019/03",
        endDate: "2020/12",
        currentlyWorking: false,
        description:
          "• Owned inbound and outbound sales activity for regional business accounts.\n• Delivered tailored product proposals and consistently exceeded revenue goals.\n• Coordinated with operations teams to improve customer satisfaction.",
      },
      {
        id: "exp-3",
        jobTitle: "Sales Coordinator",
        company: "ZenPeak Telecom",
        location: "Miami, United States",
        startDate: "2016/09",
        endDate: "2019/02",
        currentlyWorking: false,
        description:
          "• Supported account executives with lead tracking, reporting, and proposal preparation.\n• Contributed to pipeline organization and improved follow-up consistency.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Florida International University",
        degree: "Bachelor of Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2014",
        endDate: "2016",
        location: "Miami, FL",
      },
      {
        id: "edu-2",
        institution: "Miami Dade College",
        degree: "Associate Degree in Marketing",
        fieldOfStudy: "Marketing",
        startDate: "2012",
        endDate: "2014",
        location: "Miami, FL",
      },
    ],
    skills: [
      { id: "s1", name: "Account Management", level: 95 },
      { id: "s2", name: "CRM Management", level: 90 },
      { id: "s3", name: "Sales Forecasting", level: 85 },
      { id: "s4", name: "Negotiation", level: 92 },
      { id: "s5", name: "Client Retention", level: 88 },
      { id: "s6", name: "Pipeline Development", level: 90 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "Spanish", proficiency: "Native", level: 100 },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
    ],
    theme: {
      primaryColor: "#475569",
      fontFamily: "sans",
    },
  },

  // ── 4. True Blue: Daniel Mercer (VP of Sales, Chicago) ──
  "true-blue": {
    personalInfo: {
      fullName: "Daniel Mercer",
      jobTitle: "Vice President of Sales",
      email: "daniel.mercer@email.com",
      phone: "+1 312 555 0187",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/daniel-mercer",
      portfolio: "",
      photo: "",
    },
    summary:
      "Sales professional with 8+ years of experience supporting revenue growth in B2B technology and business services environments. Skilled in account management, pipeline development, team coordination, and client relationship building. Brings a practical, performance-focused approach to sales execution and is well-aligned with mid-level commercial leadership roles.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Sales Manager",
        company: "Nexora Solutions",
        location: "Chicago, Illinois",
        startDate: "2022",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Manage a team of account executives across mid-market accounts.\n• Improve pipeline tracking and weekly forecast reporting accuracy.\n• Lead client negotiations and support renewal growth opportunities.",
      },
      {
        id: "exp-2",
        jobTitle: "Senior Sales Specialist",
        company: "BrightScale Systems",
        location: "Chicago, Illinois",
        startDate: "2019",
        endDate: "2022",
        currentlyWorking: false,
        description:
          "• Delivered quarterly targets through consultative selling and account expansion.\n• Built strong relationships with regional clients in healthcare and finance.\n• Coordinated with marketing to improve lead follow-up and conversion rates.",
      },
      {
        id: "exp-3",
        jobTitle: "Sales Coordinator",
        company: "Horizon Logic",
        location: "Milwaukee, Wisconsin",
        startDate: "2016",
        endDate: "2019",
        currentlyWorking: false,
        description:
          "• Supported outbound campaigns and maintained CRM data quality.\n• Assisted with proposal preparation, reporting, and sales meeting coordination.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "DePaul University",
        degree: "Professional Certificate in Sales Management",
        fieldOfStudy: "Sales Management",
        startDate: "2018",
        endDate: "2018",
        location: "Chicago, Illinois",
      },
      {
        id: "edu-2",
        institution: "Indiana University Bloomington",
        degree: "Bachelor of Science in Marketing",
        fieldOfStudy: "Marketing",
        startDate: "2012",
        endDate: "2016",
        location: "Bloomington, Indiana",
      },
    ],
    skills: [
      { id: "s1", name: "Sales Strategy", level: 95 },
      { id: "s2", name: "Revenue Growth", level: 92 },
      { id: "s3", name: "Enterprise Account Management", level: 90 },
      { id: "s4", name: "Team Leadership", level: 88 },
      { id: "s5", name: "Pipeline Management", level: 90 },
      { id: "s6", name: "Forecasting and Reporting", level: 85 },
      { id: "s7", name: "Negotiation", level: 92 },
      { id: "s8", name: "Cross-Functional Collaboration", level: 88 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "Spanish", proficiency: "Proficient", level: 80 },
      { id: "l3", language: "French", proficiency: "Conversational", level: 60 },
    ],
    certifications: [
      { id: "c1", name: "Certified Sales Leadership Professional", issuer: "CSLP", date: "2021" },
      { id: "c2", name: "HubSpot Sales Software Certification", issuer: "HubSpot", date: "2020" },
      { id: "c3", name: "Salesforce Certified Sales Representative", issuer: "Salesforce", date: "2019" },
      { id: "c4", name: "Strategic Account Management Certification", issuer: "SAMA", date: "2022" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#1D4ED8",
      fontFamily: "sans",
    },
  },

  // ── 5. Editorial Rule: Lena Hoffmann (Operations Manager, Berlin) ──
  "editorial-rule": {
    personalInfo: {
      fullName: "Lena Hoffmann",
      jobTitle: "Operations Manager",
      email: "lena.hoffmann@email.com",
      phone: "+49 151 4827 6391",
      location: "Berlin, Germany",
      linkedin: "linkedin.com/in/lena-hoffmann",
      portfolio: "",
      photo: "",
    },
    summary:
      "Operations professional with 7+ years of experience supporting logistics, process improvement, and cross-functional coordination in fast-paced business environments. Strong track record of improving workflows, managing vendors, and delivering reliable service levels across daily operations. Combines analytical thinking with hands-on leadership to help growing organizations scale efficiently.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Operations Manager",
        company: "Nova Retail Group",
        location: "Berlin, Germany",
        startDate: "2022",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Lead daily operations across warehousing, procurement, and support teams.\n• Improved order accuracy by redesigning internal handoff procedures.\n• Managed vendor contracts and reduced annual service costs.\n• Built KPI dashboards for capacity, service, and productivity tracking.",
      },
      {
        id: "exp-2",
        jobTitle: "Operations Coordinator",
        company: "Urban Freight Solutions",
        location: "Hamburg, Germany",
        startDate: "2019",
        endDate: "2022",
        currentlyWorking: false,
        description:
          "• Coordinated transport schedules and resolved delivery escalations promptly.\n• Standardized reporting processes for weekly management reviews.\n• Supported onboarding and training for new team members.",
      },
      {
        id: "exp-3",
        jobTitle: "Operations Analyst",
        company: "GreenLine Services",
        location: "Berlin, Germany",
        startDate: "2017",
        endDate: "2019",
        currentlyWorking: false,
        description:
          "• Analyzed process data to identify delays and waste.\n• Assisted in implementation of automated inventory management system.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Humboldt University of Berlin",
        degree: "M.Sc. Management",
        fieldOfStudy: "Supply Chain & Operations",
        startDate: "2015",
        endDate: "2017",
        location: "Berlin, Germany",
      },
      {
        id: "edu-2",
        institution: "University of Cologne",
        degree: "B.A. Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2011",
        endDate: "2015",
        location: "Cologne, Germany",
      },
    ],
    skills: [
      { id: "s1", name: "Process Improvement", level: 95 },
      { id: "s2", name: "Supply Chain Coordination", level: 90 },
      { id: "s3", name: "Vendor Management", level: 92 },
      { id: "s4", name: "KPI Reporting", level: 88 },
      { id: "s5", name: "Budget Tracking", level: 85 },
      { id: "s6", name: "ERP Systems", level: 88 },
      { id: "s7", name: "Inventory Planning", level: 85 },
      { id: "s8", name: "SAP", level: 90 },
      { id: "s9", name: "Excel & Google Sheets", level: 95 },
      { id: "s10", name: "Team Leadership", level: 88 },
    ],
    languages: [
      { id: "l1", language: "German", proficiency: "Native", level: 100 },
      { id: "l2", language: "English", proficiency: "Fluent", level: 90 },
      { id: "l3", language: "French", proficiency: "Conversational", level: 60 },
    ],
    certifications: [
      { id: "c1", name: "Lean Six Sigma Green Belt", issuer: "IASSC", date: "2020" },
      { id: "c2", name: "APICS Certified in Logistics, Transportation and Distribution", issuer: "ASCM", date: "2021" },
      { id: "c3", name: "PRINCE2 Foundation Certificate", issuer: "AXELOS", date: "2018" },
      { id: "c4", name: "SAP Certified Application Associate", issuer: "SAP", date: "2019" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#0F172A",
      fontFamily: "serif",
    },
  },

  // ── 6. Saffron Line: Matteo Ricci (Head of Operations, Milan) ──
  "saffron-line": {
    personalInfo: {
      fullName: "Matteo Ricci",
      jobTitle: "Head of Operations",
      email: "matteo.ricci@email.com",
      phone: "+39 347 418 2504",
      location: "Milan, Italy",
      linkedin: "linkedin.com/in/matteo-ricci",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Operations leader with 11+ years of experience building efficient, scalable processes across logistics, customer operations, and service delivery. Strong background in process optimization, team leadership, vendor management, and KPI-driven performance improvement. Led regional transformation initiatives, standardized operating models, and improved service quality in fast-paced environments.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Head of Operations",
        company: "LogiVera Solutions",
        location: "Milan, Italy",
        startDate: "2021",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Directed multi-site operations strategy across Italy, improving service consistency and reducing process bottlenecks.\n• Oversee workforce planning, vendor performance, and budget allocation for daily operations supporting more than 150 employees.\n• Drove continuous improvement initiatives that increased customer satisfaction by 18%.\n• Partnered with finance, HR, and product leaders to scale operational processes.",
      },
      {
        id: "exp-2",
        jobTitle: "Operations Manager",
        company: "Spedita Italia",
        location: "Bologna, Italy",
        startDate: "2017",
        endDate: "2021",
        currentlyWorking: false,
        description:
          "• Led end-to-end warehouse and last-mile operations, improving fulfillment accuracy and reducing average delivery delays.\n• Implemented performance dashboards and SOP updates that increased team accountability.\n• Managed third-party logistics relationships and negotiated service expectations.",
      },
      {
        id: "exp-3",
        jobTitle: "Senior Operations Lead",
        company: "TransLine Services",
        location: "Turin, Italy",
        startDate: "2014",
        endDate: "2017",
        currentlyWorking: false,
        description:
          "• Supervised daily service operations and coordinated cross-functional teams to maintain delivery targets and operational quality standards.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "SDA Bocconi School of Management",
        degree: "Executive Certificate in Supply Chain Strategy",
        fieldOfStudy: "Supply Chain",
        startDate: "2016",
        endDate: "2016",
        location: "Milan, Italy",
      },
      {
        id: "edu-2",
        institution: "Politecnico di Milano",
        degree: "Master of Science in Operations Management",
        fieldOfStudy: "Operations Management",
        startDate: "2009",
        endDate: "2011",
        location: "Milan, Italy",
      },
      {
        id: "edu-3",
        institution: "University of Bologna",
        degree: "Bachelor of Science in Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2005",
        endDate: "2008",
        location: "Bologna, Italy",
      },
    ],
    skills: [
      { id: "s1", name: "Operations Strategy", level: 95 },
      { id: "s2", name: "Process Optimization", level: 92 },
      { id: "s3", name: "KPI Management", level: 90 },
      { id: "s4", name: "Vendor Management", level: 88 },
      { id: "s5", name: "Budget Planning", level: 85 },
      { id: "s6", name: "Team Leadership", level: 92 },
      { id: "s7", name: "Cross-Functional Collaboration", level: 90 },
    ],
    languages: [
      { id: "l1", language: "Italian", proficiency: "Native", level: 100 },
      { id: "l2", language: "English", proficiency: "Fluent", level: 90 },
      { id: "l3", language: "French", proficiency: "Intermediate", level: 70 },
    ],
    certifications: [
      { id: "c1", name: "Lean Six Sigma Green Belt", issuer: "IASSC", date: "2018" },
      { id: "c2", name: "Certified Supply Chain Professional (CSCP)", issuer: "APICS", date: "2020" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#D97706",
      fontFamily: "sans",
    },
  },

  // ── 7. Steady Form: Rohan K. Patel (Project Engineer, India) ──
  "steady-form": {
    personalInfo: {
      fullName: "Rohan K. Patel",
      jobTitle: "Project Engineer",
      email: "rohan.patel@email.com",
      phone: "+91 98765 43210",
      location: "Ahmedabad, India",
      linkedin: "linkedin.com/in/rohan-patel",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Project Engineer with 6+ years of experience supporting industrial and infrastructure projects in fast-paced engineering environments. Strong background in project coordination, vendor management, technical documentation, and site execution, with a consistent focus on quality, safety, and on-time delivery. Brings practical approach to cross-functional collaboration.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Project Engineer",
        company: "Adani Infrastructure",
        location: "Ahmedabad, India",
        startDate: "2022/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Lead project coordination across teams for utility infrastructure upgrades.\n• Improved project tracking accuracy by standardizing reporting formats and reviews.\n• Managed vendor communication, material schedules, and technical documentation.",
      },
      {
        id: "exp-2",
        jobTitle: "Mechanical Engineer",
        company: "Larsen & Toubro",
        location: "Vadodara, India",
        startDate: "2019/07",
        endDate: "2021/12",
        currentlyWorking: false,
        description:
          "• Delivered equipment installation support for manufacturing projects while maintaining compliance with safety standards.\n• Coordinated inspections and contractor activities to reduce commissioning delays.\n• Owned reporting and supported issue resolution between engineering and site teams.",
      },
      {
        id: "exp-3",
        jobTitle: "Graduate Engineer Trainee",
        company: "Tata Projects",
        location: "Surat, India",
        startDate: "2017/06",
        endDate: "2019/06",
        currentlyWorking: false,
        description:
          "• Assisted engineers with BOQ preparation, site measurements, and progress updates.\n• Contributed to control and material planning for civil and mechanical work packages.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Gujarat Technological University",
        degree: "Bachelor of Engineering in Mechanical Engineering",
        fieldOfStudy: "Mechanical Engineering",
        startDate: "2013",
        endDate: "2017",
        location: "Ahmedabad, India",
      },
      {
        id: "edu-2",
        institution: "Government Polytechnic Ahmedabad",
        degree: "Diploma in Mechanical Engineering",
        fieldOfStudy: "Mechanical Engineering",
        startDate: "2010",
        endDate: "2013",
        location: "Ahmedabad, India",
      },
    ],
    skills: [
      { id: "s1", name: "Project Coordination", level: 95 },
      { id: "s2", name: "Mechanical Systems", level: 90 },
      { id: "s3", name: "Technical Documentation", level: 92 },
      { id: "s4", name: "Vendor Management", level: 88 },
      { id: "s5", name: "Quality Assurance", level: 85 },
      { id: "s6", name: "Site Execution", level: 90 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Fluent", level: 90 },
      { id: "l2", language: "Hindi", proficiency: "Native", level: 100 },
      { id: "l3", language: "Gujarati", proficiency: "Native", level: 100 },
    ],
    certifications: [
      { id: "c1", name: "AutoCAD Professional Certificate", issuer: "Autodesk", date: "2018" },
      { id: "c2", name: "Primavera P6 Fundamentals", issuer: "Oracle", date: "2020" },
      { id: "c3", name: "Occupational Health and Safety", issuer: "NEBOSH", date: "2021" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#334155",
      fontFamily: "sans",
    },
  },

  // ── 8. Hunter Green: Yassine Ben Salem (Sales Manager, Tunisia) ──
  "hunter-green": {
    personalInfo: {
      fullName: "Yassine Ben Salem",
      jobTitle: "Sales Manager",
      email: "yassine.bensalem@email.com",
      phone: "+216 55 482 731",
      location: "Tunis, Tunisia",
      linkedin: "linkedin.com/in/yassine-bensalem",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Results-driven Sales Manager with 6+ years of experience in B2B sales, account development, and client relationship management across telecom and business services markets. Strong track record in growing revenue, improving conversion rates, and building long-term partnerships with corporate clients. Brings a practical, target-focused approach to pipeline management and regional market expansion.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Sales Manager",
        company: "Tunisie Connect",
        location: "Tunis, Tunisia",
        startDate: "2021/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Manage a portfolio of key business accounts across the Tunis region.\n• Lead quarterly sales planning and improved team conversion rates by 18%.\n• Deliver tailored proposals and contract renewals for SME and enterprise clients.",
      },
      {
        id: "exp-2",
        jobTitle: "Senior Sales Executive",
        company: "Maghreb Business Solutions",
        location: "Tunis, Tunisia",
        startDate: "2019/03",
        endDate: "2021/12",
        currentlyWorking: false,
        description:
          "• Owned full sales cycle from prospecting to negotiation and closing.\n• Increased monthly new client acquisition through structured outbound campaigns.\n• Improved CRM accuracy and reporting for better pipeline visibility.",
      },
      {
        id: "exp-3",
        jobTitle: "Sales Coordinator",
        company: "MedCom Distribution",
        location: "Sfax, Tunisia",
        startDate: "2017/07",
        endDate: "2019/02",
        currentlyWorking: false,
        description:
          "• Coordinated sales support activities for field representatives and distributors.\n• Contributed to territory reporting, quotation follow-up, and customer onboarding.",
      },
      {
        id: "exp-4",
        jobTitle: "Junior Sales Assistant",
        company: "Nord Afrique Services",
        location: "Sousse, Tunisia",
        startDate: "2016/09",
        endDate: "2017/06",
        currentlyWorking: false,
        description:
          "• Assisted senior sales staff with lead tracking and client follow-up.\n• Supported quotation preparation, call scheduling, and weekly sales reporting.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Tunis Business School",
        degree: "Master's Degree in Marketing and Commercial Management",
        fieldOfStudy: "Marketing",
        startDate: "2015",
        endDate: "2017",
        location: "Tunis, Tunisia",
      },
      {
        id: "edu-2",
        institution: "University of Sfax",
        degree: "Bachelor's Degree in Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2012",
        endDate: "2015",
        location: "Sfax, Tunisia",
      },
    ],
    skills: [
      { id: "s1", name: "Account Management", level: 95 },
      { id: "s2", name: "Lead Generation", level: 92 },
      { id: "s3", name: "Negotiation", level: 90 },
      { id: "s4", name: "CRM Management", level: 88 },
      { id: "s5", name: "Sales Forecasting", level: 85 },
      { id: "s6", name: "Client Retention", level: 90 },
      { id: "s7", name: "Pipeline Development", level: 92 },
    ],
    languages: [
      { id: "l1", language: "Arabic", proficiency: "Native", level: 100 },
      { id: "l2", language: "French", proficiency: "Fluent", level: 95 },
      { id: "l3", language: "English", proficiency: "Proficient", level: 85 },
    ],
    certifications: [
      { id: "c1", name: "Certified Professional Sales Person (CPSP)", issuer: "NASP", date: "2020" },
      { id: "c2", name: "HubSpot Sales Software Certification", issuer: "HubSpot", date: "2021" },
      { id: "c3", name: "Google Digital Sales Certification", issuer: "Google", date: "2019" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#23372F",
      fontFamily: "sans",
    },
  },

  // ── 9. Quicksilver: Michael Nwosu (Sales Manager, UK) ──
  "quicksilver": {
    personalInfo: {
      fullName: "Michael Nwosu",
      jobTitle: "Sales Manager",
      email: "michael.nwosu@email.com",
      phone: "+44 7700 516 284",
      location: "Birmingham, United Kingdom",
      linkedin: "linkedin.com/in/michael-nwosu",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Commercial sales professional with over 6 years of experience in B2B account development and client retention across competitive markets. Strong track record of growing revenue, strengthening customer relationships, and improving sales processes. Brings proactive approach to pipeline management and delivering consistent results.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Sales Manager",
        company: "Westford Commercial Services",
        location: "Birmingham, United Kingdom",
        startDate: "2022/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Managed regional sales pipeline and exceeded annual revenue targets by 14%.\n• Led account growth plans for key clients in logistics and professional services.\n• Improved close rates through stronger qualification and structured follow-up activity.\n• Led account growth plans for key clients in logistics and professional services.",
      },
      {
        id: "exp-2",
        jobTitle: "Senior Sales Executive",
        company: "Brightline Solutions",
        location: "Nottingham, United Kingdom",
        startDate: "2019/05",
        endDate: "2021/12",
        currentlyWorking: false,
        description:
          "• Owned the full sales cycle from prospecting to negotiation and contract closure.\n• Built long-term client relationships that increased renewals and upsell opportunities.\n• Partnered with marketing teams to improve lead quality and campaign conversion.",
      },
      {
        id: "exp-3",
        jobTitle: "Sales Coordinator",
        company: "Hartwell Systems",
        location: "Leicester, United Kingdom",
        startDate: "2017/07",
        endDate: "2019/04",
        currentlyWorking: false,
        description:
          "• Supported sales reporting, CRM maintenance, and weekly pipeline coordination.\n• Contributed to outreach campaigns that expanded the qualified prospect pipeline.\n• Coordinated client follow-ups and internal handovers to improve response times.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Birmingham Metropolitan College",
        degree: "Diploma in Professional Selling",
        fieldOfStudy: "Professional Selling",
        startDate: "2016",
        endDate: "2017",
        location: "Birmingham, United Kingdom",
      },
      {
        id: "edu-2",
        institution: "Aston University",
        degree: "BA (Hons) Business Management",
        fieldOfStudy: "Business Management",
        startDate: "2014",
        endDate: "2017",
        location: "Birmingham, United Kingdom",
      },
    ],
    skills: [
      { id: "s1", name: "Account Management", level: 95 },
      { id: "s2", name: "B2B Sales", level: 92 },
      { id: "s3", name: "Lead Generation", level: 88 },
      { id: "s4", name: "CRM Systems", level: 90 },
      { id: "s5", name: "Negotiation", level: 92 },
      { id: "s6", name: "Sales Forecasting", level: 85 },
      { id: "s7", name: "Pipeline Management", level: 90 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "Igbo", proficiency: "Native", level: 100 },
      { id: "l3", language: "French", proficiency: "Intermediate", level: 75 },
    ],
    certifications: [
      { id: "c1", name: "HubSpot Sales Software Certification", issuer: "HubSpot", date: "2021" },
      { id: "c2", name: "Salesforce Certified Associate", issuer: "Salesforce", date: "2020" },
      { id: "c3", name: "Level 4 Certificate in Sales Management", issuer: "ISM", date: "2019" },
      { id: "c4", name: "LinkedIn Learning Certificate: Negotiation Skills", issuer: "LinkedIn", date: "2022" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#475569",
      fontFamily: "sans",
    },
  },

  // ── 10. Precision Line: Olivia Bennett (Head of Customer Service, Sydney) ──
  "precision-line": {
    personalInfo: {
      fullName: "Olivia Bennett",
      jobTitle: "Head of Customer Service",
      email: "olivia.bennett@email.com",
      phone: "+61 412 683 947",
      location: "Sydney, Australia",
      linkedin: "linkedin.com/in/olivia-bennett",
      portfolio: "",
      photo: "",
    },
    summary:
      "Customer service leader with over 16 years of experience building high-performing support functions across retail, telecom, financial services, and digital service environments. Known for driving measurable gains in customer satisfaction, first-contact resolution, and workforce efficiency through process redesign, coaching frameworks, and service analytics. Well aligned with senior customer experience and service leadership roles.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Head of Customer Service",
        company: "BrightWave Mobile",
        location: "Sydney, Australia",
        startDate: "2020",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Directed customer service operations across phone, email, live chat, and social channels, supporting over 1.2 million customers annually.\n• Led a team of 6 managers and 145 service professionals, improving CSAT from 84% to 92% within two years.\n• Drove service transformation initiatives, including workforce planning, QA redesign, and knowledge base optimization.\n• Partnered with product and operations leaders to improve escalation management and customer retention.",
      },
      {
        id: "exp-2",
        jobTitle: "Customer Service Director",
        company: "Southern Lane Retail Group",
        location: "Melbourne, Australia",
        startDate: "2016",
        endDate: "2020",
        currentlyWorking: false,
        description:
          "• Oversaw customer contact centres and in-store service support functions across Australia, maintaining service consistency during a major omnichannel expansion.\n• Scaled performance management and training programs that increased first-contact resolution and reduced repeat contacts.\n• Introduced service dashboards and root-cause analysis routines, enabling faster decisions on staffing and policy.",
      },
      {
        id: "exp-3",
        jobTitle: "Senior Customer Experience Manager",
        company: "Pacific Utility Services",
        location: "Brisbane, Australia",
        startDate: "2012",
        endDate: "2016",
        currentlyWorking: false,
        description:
          "• Managed frontline and back-office customer service teams handling billing, account enquiries, and complaint cases.\n• Improved service-level performance through scheduling changes, coaching standards, and revised workflows.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Macquarie University",
        degree: "Master of Business Administration (MBA)",
        fieldOfStudy: "Business Administration",
        startDate: "2014",
        endDate: "2016",
        location: "Sydney, Australia",
      },
      {
        id: "edu-2",
        institution: "University of Technology Sydney",
        degree: "Bachelor of Business",
        fieldOfStudy: "Management",
        startDate: "2004",
        endDate: "2007",
        location: "Sydney, Australia",
      },
    ],
    skills: [
      { id: "s1", name: "Customer Service Operations", level: 95 },
      { id: "s2", name: "Quality Assurance", level: 92 },
      { id: "s3", name: "Stakeholder Management", level: 90 },
      { id: "s4", name: "Contact Centre Leadership", level: 95 },
      { id: "s5", name: "Complaint Resolution", level: 90 },
      { id: "s6", name: "Change Management", level: 88 },
      { id: "s7", name: "Workforce Planning", level: 92 },
      { id: "s8", name: "Performance Coaching", level: 90 },
      { id: "s9", name: "Service Analytics", level: 88 },
      { id: "s10", name: "Customer Journey Mgmt", level: 92 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "French", proficiency: "Conversational", level: 65 },
      { id: "l3", language: "Spanish", proficiency: "Basic", level: 45 },
    ],
    certifications: [
      { id: "c1", name: "Certified Customer Experience Professional (CCXP)", issuer: "CXPA", date: "2020" },
      { id: "c2", name: "ITIL 4 Foundation", issuer: "AXELOS", date: "2019" },
      { id: "c3", name: "Diploma of Leadership and Management", issuer: "Australian College", date: "2017" },
      { id: "c4", name: "Lean Six Sigma Green Belt", issuer: "IASSC", date: "2018" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#0F172A",
      fontFamily: "sans",
    },
  },

  // ── 11. Cobalt Edge: Alejandro Herrera (Sales Manager, Mexico) ──
  "cobalt-edge": {
    personalInfo: {
      fullName: "Alejandro Herrera",
      jobTitle: "Sales Manager",
      email: "alejandro.herrera@email.com",
      phone: "+52 81 2345 6789",
      location: "Monterrey, Mexico",
      linkedin: "linkedin.com/in/alejandro-herrera",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Results-driven sales professional with 7+ years of experience in B2B account growth, client relationship management, and regional sales execution. Strong track record of improving pipeline quality and exceeding revenue targets. Brings data-informed approach to planning and team coordination in dynamic environments.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Sales Manager",
        company: "Grupo Delta Comercial",
        location: "Monterrey, Mexico",
        startDate: "2022/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Manage regional accounts and consistently exceed quarterly revenue targets across northern Mexico.\n• Lead pipeline reviews, pricing discussions, forecasting to improve conversion.\n• Develop client retention plans that strengthen renewals and expand cross-selling.",
      },
      {
        id: "exp-2",
        jobTitle: "Senior Sales Executive",
        company: "Nova Industrial Solutions",
        location: "Guadalajara, Mexico",
        startDate: "2019/03",
        endDate: "2021/12",
        currentlyWorking: false,
        description:
          "• Owned key B2B accounts and delivered year-over-year sales growth in manufacturing segments.\n• Improved lead qualification processes and shortened average sales cycle.",
      },
      {
        id: "exp-3",
        jobTitle: "Sales Coordinator",
        company: "Comercial Vértice",
        location: "Mexico City, Mexico",
        startDate: "2016/07",
        endDate: "2019/02",
        currentlyWorking: false,
        description:
          "• Supported account managers with quotations and customer communication.\n• Maintained CRM records and contributed to monthly sales planning.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Tecnológico de Monterrey",
        degree: "Bachelor of Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2014",
        endDate: "2018",
        location: "Monterrey, Mexico",
      },
    ],
    skills: [
      { id: "s1", name: "Account Management", level: 95 },
      { id: "s2", name: "Revenue Growth", level: 92 },
      { id: "s3", name: "Pipeline Forecasting", level: 90 },
      { id: "s4", name: "Client Retention", level: 88 },
      { id: "s5", name: "CRM Management", level: 90 },
      { id: "s6", name: "Sales Reporting", level: 85 },
    ],
    languages: [
      { id: "l1", language: "Spanish", proficiency: "Native", level: 100 },
      { id: "l2", language: "English", proficiency: "Fluent", level: 90 },
      { id: "l3", language: "Portuguese", proficiency: "Conversational", level: 65 },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
    ],
    theme: {
      primaryColor: "#0B3B60",
      fontFamily: "sans",
    },
  },

  // ── 12. Silver Banner: Anna Field (Junior Project Manager, UK) ──
  "silver-banner": {
    personalInfo: {
      fullName: "Anna Field",
      jobTitle: "Junior Project Manager",
      email: "anna.field@email.com",
      phone: "+44 7700 483 216",
      location: "Manchester, United Kingdom",
      linkedin: "linkedin.com/in/anna-field",
      portfolio: "",
      photo: "",
    },
    summary:
      "Detail-oriented Junior Project Manager with early experience supporting project delivery in fast-paced business environments. Strong in coordination, stakeholder communication, and schedule tracking, with a practical approach to keeping tasks organized and on time.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Project Coordinator",
        company: "Northbridge Solutions",
        location: "Manchester, UK",
        startDate: "2024 Jul",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Supported timelines, meeting notes, and weekly status updates.\n• Coordinated tasks across teams to keep deliverables on track.\n• Maintained project documentation and monitored action items.",
      },
      {
        id: "exp-2",
        jobTitle: "Project Management Intern",
        company: "Alder & Co. Services",
        location: "Manchester, UK",
        startDate: "2024 Jan",
        endDate: "2024 Jun",
        currentlyWorking: false,
        description:
          "• Assisted managers with scheduling and progress reporting.\n• Helped prepare presentations, trackers, and project materials.\n• Followed up on action items and updated project records.",
      },
      {
        id: "exp-3",
        jobTitle: "Operations Intern",
        company: "Operations Solutions",
        location: "Manchester, UK",
        startDate: "2023 Jun",
        endDate: "2023 Dec",
        currentlyWorking: false,
        description:
          "• Supported project tracking for internal process improvement tasks.\n• Updated spreadsheets and prepared basic workflow reports.\n• Coordinated meeting schedules and shared follow-up notes.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Manchester Metropolitan University",
        degree: "BA (Hons) Business Management",
        fieldOfStudy: "Business Management",
        startDate: "2020 Sep",
        endDate: "2023 Jun",
        location: "Manchester, UK",
      },
    ],
    skills: [
      { id: "s1", name: "Project Coordination", level: 92 },
      { id: "s2", name: "Scheduling and Task Tracking", level: 90 },
      { id: "s3", name: "Stakeholder Communication", level: 88 },
      { id: "s4", name: "Microsoft Excel", level: 85 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "Spanish", proficiency: "Intermediate", level: 70 },
    ],
    certifications: [
      { id: "c1", name: "PRINCE2 Foundation", issuer: "AXELOS", date: "2024" },
      { id: "c2", name: "Google Project Management Certificate", issuer: "Google", date: "2023" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#475569",
      fontFamily: "sans",
    },
  },

  // ── 13. Classic Serif: Andrew O'Sullivan (Product Manager, Ireland) ──
  "classic-serif": {
    personalInfo: {
      fullName: "Andrew O'Sullivan",
      jobTitle: "Product Manager",
      email: "andrew.osullivan@email.com",
      phone: "+353 87 411 6849",
      location: "Dublin, Ireland",
      linkedin: "linkedin.com/in/andrew-osullivan",
      portfolio: "",
      photo: "",
    },
    summary:
      "Product Manager with experience leading digital product initiatives across customer-facing and internal business platforms. Strong background in roadmap planning, stakeholder alignment, and translating user needs into clear product requirements that support measurable outcomes. Brings a practical, collaborative approach to cross-functional delivery and continuous product improvement in fast-paced environments.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Product Manager",
        company: "BrightLane Technologies",
        location: "Dublin, Ireland",
        startDate: "2021/01",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Own product roadmap for onboarding and account management features.\n• Partner with design and engineering to deliver quarterly releases on schedule.\n• Analyze user feedback and usage trends to prioritize high-impact improvements.",
      },
      {
        id: "exp-2",
        jobTitle: "Associate Product Manager",
        company: "Northbridge Digital",
        location: "Cork, Ireland",
        startDate: "2019/07",
        endDate: "2020/12",
        currentlyWorking: false,
        description:
          "• Coordinated backlog refinement and sprint planning across product teams.\n• Supported launch of self-service tools that reduced support requests significantly.\n• Worked with stakeholders to define requirements, success metrics, and priorities.",
      },
      {
        id: "exp-3",
        jobTitle: "Product Analyst",
        company: "ClearHarbor Solutions",
        location: "Galway, Ireland",
        startDate: "2017/09",
        endDate: "2019/06",
        currentlyWorking: false,
        description:
          "• Conducted competitor research to inform feature recommendations.\n• Built performance reports to track adoption, retention, and product engagement.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "University College Dublin",
        degree: "MSc in Digital Innovation",
        fieldOfStudy: "Digital Innovation",
        startDate: "2016",
        endDate: "2017",
        location: "Dublin, Ireland",
      },
      {
        id: "edu-2",
        institution: "University of Galway",
        degree: "BA in Business and Management",
        fieldOfStudy: "Business and Management",
        startDate: "2012",
        endDate: "2016",
        location: "Galway, Ireland",
      },
    ],
    skills: [
      { id: "s1", name: "Product Roadmapping", level: 95 },
      { id: "s2", name: "User Research", level: 90 },
      { id: "s3", name: "Agile Delivery", level: 92 },
      { id: "s4", name: "Backlog Prioritization", level: 90 },
      { id: "s5", name: "Data Analysis", level: 88 },
      { id: "s6", name: "Go-to-Market Planning", level: 85 },
      { id: "s7", name: "Project Management", level: 88 },
      { id: "s8", name: "Cross-Functional Collaboration", level: 92 },
    ],
    languages: [
      { id: "l1", language: "English", proficiency: "Native", level: 100 },
      { id: "l2", language: "Irish", proficiency: "Proficient", level: 80 },
      { id: "l3", language: "Spanish", proficiency: "Intermediate", level: 60 },
    ],
    certifications: [
      { id: "c1", name: "Professional Scrum Product Owner I (PSPO I)", issuer: "Scrum.org", date: "2020" },
      { id: "c2", name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", date: "2019" },
      { id: "c3", name: "Google Analytics Certification", issuer: "Google", date: "2021" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#111827",
      fontFamily: "serif",
    },
  },

  // ── 14. Refined: Mariana Costa Ribeiro (Finance Manager, Brazil) ──
  "refined": {
    personalInfo: {
      fullName: "Mariana Costa Ribeiro",
      jobTitle: "Finance Manager",
      email: "mariana.ribeiro@email.com",
      phone: "+55 11 98765-4321",
      location: "São Paulo, Brazil",
      linkedin: "linkedin.com/in/mariana-ribeiro",
      portfolio: "",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    },
    summary:
      "Finance professional with 7+ years of experience across budgeting, financial reporting, and business performance analysis in fast-paced corporate environments. Strong track record of improving reporting accuracy, supporting strategic planning, and partnering with cross-functional teams to guide sound financial decisions. Brings a practical, data-driven approach suited to finance-management roles with regional scope and operational responsibility.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Finance Manager",
        company: "Natura &Co",
        location: "São Paulo, Brazil",
        startDate: "2022",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Manage monthly budgeting cycles and variance analysis for two business units.\n• Lead reporting improvements that reduced closing timelines by three days.\n• Partner with operations and procurement teams to support cost control initiatives.",
      },
      {
        id: "exp-2",
        jobTitle: "Senior Financial Analyst",
        company: "Raízen",
        location: "São Paulo, Brazil",
        startDate: "2019",
        endDate: "2022",
        currentlyWorking: false,
        description:
          "• Delivered monthly performance reports for leadership across revenue and expense lines.\n• Improved forecast models to support more accurate quarterly planning decisions.\n• Owned financial dashboards and presented insights during business review meetings.",
      },
      {
        id: "exp-3",
        jobTitle: "Financial Analyst",
        company: "Banco Safra",
        location: "São Paulo, Brazil",
        startDate: "2017",
        endDate: "2019",
        currentlyWorking: false,
        description:
          "• Supported account reconciliations, reporting packs, and annual budget preparation.\n• Coordinated data validation activities to improve consistency across finance reports.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Fundação Getulio Vargas (FGV)",
        degree: "MBA in Finance",
        fieldOfStudy: "Finance",
        startDate: "2020",
        endDate: "2022",
        location: "São Paulo, Brazil",
      },
      {
        id: "edu-2",
        institution: "Universidade Presbiteriana Mackenzie",
        degree: "Bachelor of Business Administration",
        fieldOfStudy: "Business Administration",
        startDate: "2013",
        endDate: "2016",
        location: "São Paulo, Brazil",
      },
    ],
    skills: [
      { id: "s1", name: "Financial Planning & Analysis", level: 95 },
      { id: "s2", name: "Budget Management", level: 92 },
      { id: "s3", name: "Forecasting", level: 90 },
      { id: "s4", name: "Variance Analysis", level: 92 },
      { id: "s5", name: "Financial Reporting", level: 90 },
      { id: "s6", name: "Cost Control", level: 88 },
      { id: "s7", name: "SAP", level: 85 },
      { id: "s8", name: "Advanced Excel", level: 95 },
    ],
    languages: [
      { id: "l1", language: "Portuguese", proficiency: "Native", level: 100 },
      { id: "l2", language: "English", proficiency: "Fluent", level: 90 },
      { id: "l3", language: "Spanish", proficiency: "Intermediate", level: 75 },
    ],
    certifications: [
      { id: "c1", name: "ANBIMA CPA-20", issuer: "ANBIMA", date: "2020" },
      { id: "c2", name: "Financial Modeling & Valuation Analyst (FMVA)", issuer: "CFI", date: "2021" },
      { id: "c3", name: "Excel Skills for Business Specialization", issuer: "Coursera", date: "2019" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#000000",
      fontFamily: "sans",
    },
  },

  // ── 15. Condensed Rule: Ahmed Hassan (Head of Engineering, Cairo) ──
  "condensed-rule": {
    personalInfo: {
      fullName: "Ahmed Hassan",
      jobTitle: "Head of Engineering",
      email: "ahmed.hassan@email.com",
      phone: "+20 100 482 7391",
      location: "Cairo, Egypt",
      linkedin: "linkedin.com/in/ahmed-hassan",
      portfolio: "",
      photo: "",
    },
    summary:
      "Engineering leader with over 17 years of experience directing multidisciplinary teams across infrastructure, manufacturing, utilities, and industrial development projects. Brings strong expertise in project delivery, technical governance, asset reliability, process optimization, and cross-functional engineering leadership. Known for improving operational performance, strengthening safety standards, and delivering complex capital projects through disciplined planning and stakeholder alignment.",
    experience: [
      {
        id: "exp-1",
        jobTitle: "Head of Engineering",
        company: "RidaWorks Infrastructure",
        location: "Cairo, Egypt",
        startDate: "2020",
        endDate: "Present",
        currentlyWorking: true,
        description:
          "• Directed engineering strategy across civil, mechanical, and electrical teams supporting large-scale infrastructure programs.\n• Led 8 engineering managers and 120 technical staff, improving project delivery reliability across regional sites.\n• Drove design review, contractor coordination, and technical governance processes, reducing rework across major projects.",
      },
      {
        id: "exp-2",
        jobTitle: "Engineering Director",
        company: "Delta Industrial Solutions",
        location: "Alexandria, Egypt",
        startDate: "2016",
        endDate: "2020",
        currentlyWorking: false,
        description:
          "• Oversaw engineering delivery for manufacturing expansion projects, utilities upgrades, and plant modernization initiatives.\n• Scaled preventive maintenance and reliability programs that reduced equipment downtime across critical production lines.\n• Introduced engineering performance dashboards, enabling faster decisions on resources, budgets, and technical risks.",
      },
      {
        id: "exp-3",
        jobTitle: "Senior Engineering Manager",
        company: "Cairo Energy Services",
        location: "Cairo, Egypt",
        startDate: "2012",
        endDate: "2016",
        currentlyWorking: false,
        description:
          "• Managed engineering teams delivering power distribution upgrades, equipment installations, and site improvement projects.\n• Improved project control through milestones, design standards, and performance tracking.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "German University in Cairo",
        degree: "Executive Program in Operations Leadership",
        fieldOfStudy: "Operations Leadership",
        startDate: "2018",
        endDate: "2018",
        location: "Cairo, Egypt",
      },
      {
        id: "edu-2",
        institution: "Cairo University",
        degree: "Postgraduate Diploma in Project Management",
        fieldOfStudy: "Project Management",
        startDate: "2010",
        endDate: "2011",
        location: "Cairo, Egypt",
      },
      {
        id: "edu-3",
        institution: "Ain Shams University",
        degree: "Bachelor of Science in Mechanical Engineering",
        fieldOfStudy: "Mechanical Engineering",
        startDate: "1998",
        endDate: "2003",
        location: "Cairo, Egypt",
      },
    ],
    skills: [
      { id: "s1", name: "Engineering Leadership", level: 98 },
      { id: "s2", name: "Capital Project Delivery", level: 95 },
      { id: "s3", name: "Technical Governance", level: 92 },
      { id: "s4", name: "Asset Reliability", level: 90 },
      { id: "s5", name: "Maintenance Optimization", level: 92 },
      { id: "s6", name: "Contractor Management", level: 90 },
      { id: "s7", name: "Process Improvement", level: 88 },
      { id: "s8", name: "Risk Management", level: 92 },
      { id: "s9", name: "Budget Planning", level: 90 },
      { id: "s10", name: "Safety Compliance", level: 95 },
    ],
    languages: [
      { id: "l1", language: "Arabic", proficiency: "Native", level: 100 },
      { id: "l2", language: "English", proficiency: "Fluent", level: 95 },
      { id: "l3", language: "French", proficiency: "Conversational", level: 65 },
    ],
    certifications: [
      { id: "c1", name: "Certified Maintenance and Reliability Professional (CMRP)", issuer: "SMRP", date: "2017" },
      { id: "c2", name: "NEBOSH International General Certificate", issuer: "NEBOSH", date: "2016" },
      { id: "c3", name: "Primavera P6 Professional Fundamentals", issuer: "Oracle", date: "2015" },
      { id: "c4", name: "ISO 9001 Quality Management Systems Lead Auditor", issuer: "IRCA", date: "2019" },
    ],
    sectionOrder: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
    ],
    theme: {
      primaryColor: "#0F172A",
      fontFamily: "sans",
    },
  },
};

/**
 * Returns complete demo resume data for the specified template id.
 * Defaults to "classic-clear" if not found.
 */
export function getDemoDataForTemplate(templateId) {
  if (FLOWCV_DEMO_DATA[templateId]) {
    return JSON.parse(JSON.stringify(FLOWCV_DEMO_DATA[templateId]));
  }
  if (templateId === "modern" || templateId === "minimal") {
    return JSON.parse(JSON.stringify(FLOWCV_DEMO_DATA["true-blue"] || FLOWCV_DEMO_DATA["classic-clear"]));
  }
  if (templateId === "sidebar") {
    return JSON.parse(JSON.stringify(FLOWCV_DEMO_DATA["atlantic-blue"]));
  }
  return JSON.parse(JSON.stringify(FLOWCV_DEMO_DATA["classic-clear"]));
}
