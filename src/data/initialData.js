export const ALL_DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const DEFAULT_TIMING_SLOTS = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  morning: ['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM'],
  evening: ['04:00 PM', '05:00 PM', '06:30 PM', '07:30 PM'],
};

export const INITIAL_DOCTOR_PROFILE = {
  name: "Dr. Bharti",
  clinicName: "Greater Noida Aesthetic Dental Clinic",
  title: "Dental Surgeon & Aesthetic Specialist",
  qualification: "B.D.S. Lucknow, M.P.H. (Community Medicine), Fellowship in Medical Cosmetology",
  experience: "16+ Years Experience • 15,000+ Smiles Created",
  registrationNo: "DCI-99482104",
  bio: "Dr. Bharti is a renowned Dental Surgeon and Aesthetic Specialist. With advanced degrees from King George's Medical University / B.D.S. Lucknow, M.P.H., and Fellowship in Medical Cosmetology, she specializes in facial aesthetics, cosmetic smile transformations, laser whitening, painless root canals, and invisible aligners at Greater Noida Aesthetic Dental Clinic.",
  email: import.meta.env?.VITE_ADMIN_EMAIL || "dr.bhartidentalclinic@gmail.com",
  phone: "+91 88087 31295",
  whatsappNumber: "918808731295",
  address: "A 69, Sector P 3, Greater Noida",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  workingHours: {
    weekdays: "09:00 AM - 08:00 PM",
    saturday: "09:00 AM - 05:00 PM",
    sunday: "10:00 AM - 02:00 PM (Emergency Dental Only)"
  },
  timingSlots: DEFAULT_TIMING_SLOTS,
  certifications: [
    {
      title: "Fellow of ICOI (USA)",
      issuer: "International Congress of Oral Implantologists, USA",
      year: "2018",
      description: "Highest tier credential in advanced 3D computer-guided dental implants and bone augmentation surgery.",
      icon: "MilitaryTech"
    },
    {
      title: "Digital Smile Design (DSD) Master",
      issuer: "DSD International Center (Madrid, Spain)",
      year: "2020",
      description: "Facial harmony analysis, 3D aesthetic prototyping, and custom E-Max porcelain veneer designing.",
      icon: "AutoAwesome"
    },
    {
      title: "Invisalign Diamond Provider",
      issuer: "Align Technology (San Jose, USA)",
      year: "2021",
      description: "Top 1% clinical provider for complex adult and teen orthodontic clear aligner corrections.",
      icon: "WorkspacePremium"
    },
    {
      title: "MDS Prosthodontics (Gold Medalist)",
      issuer: "Government Dental College & Research Institute",
      year: "2012",
      description: "Ranked #1 in University post-graduate specialization in crowns, bridges, and full-mouth rehabilitations.",
      icon: "School"
    },
    {
      title: "Advanced Laser Dentistry Fellowship",
      issuer: "World Clinical Laser Institute (WCLI, USA)",
      year: "2019",
      description: "Biolase WaterLase dual-wavelength laser certified for painless root canals and bloodless gum shaping.",
      icon: "Verified"
    },
    {
      title: "Certified Nitrous Oxide Sedationist",
      issuer: "Society for the Advancement of Analgesia in Dentistry (SAAD)",
      year: "2016",
      description: "Painless relaxation dentistry protocols eliminating dental anxiety and fear of needles.",
      icon: "HealthAndSafety"
    }
  ]
};

export const INITIAL_SERVICES = [
  {
    id: "serv-1",
    title: "Precision Dental Implants",
    category: "Implantology",
    description: "Grade-5 bio-compatible titanium post with life-like zirconia crown. Permanent root replacement with lifetime structural warranty.",
    image: "/assets/treatments/dental_implants.jpg",
    technology: "Planmeca 3D Guided Navigation",
    idealFor: "Missing Single or Multiple Teeth",
    features: [
      "Lifetime structural manufacturer warranty",
      "Sub-millimeter 3D computer surgical guide",
      "Immediate temporary crown same-day option"
    ],
    icon: "HealthAndSafety",
    fee: "₹25,000 / $350",
    duration: "45 mins",
    isActive: true
  },
  {
    id: "serv-2",
    title: "Clear Invisible Aligners",
    category: "Orthodontics",
    description: "Custom 3D-scanned invisible aligners to straighten teeth discreetly without metal wires, brackets, or dietary restrictions.",
    image: "/assets/treatments/clear_aligners.jpg",
    technology: "SmartTrack Medical Polyurethane",
    idealFor: "Crowded Teeth, Gaps & Overbites",
    features: [
      "100% transparent & removable for dining",
      "iTero 5D digital scan with zero impression goo",
      "Predictable 3D smile outcome simulation"
    ],
    icon: "AutoAwesome",
    fee: "₹45,000 / $600",
    duration: "30 mins",
    isActive: true
  },
  {
    id: "serv-3",
    title: "Zoom 4 Laser Teeth Whitening",
    category: "Cosmetic",
    description: "Advanced Philips Zoom cold-light technology. Lightens natural enamel up to 8 shades in a single 45-minute visit with zero sensitivity.",
    image: "/assets/treatments/laser_whitening.jpg",
    technology: "Philips Zoom WhiteSpeed Cold LED",
    idealFor: "Tea, Coffee, Wine & Age Stains",
    features: [
      "Up to 8 shades lighter in just 45 minutes",
      "Amorphous Calcium Phosphate (ACP) enamel relief",
      "Complimentary take-home touchup kit"
    ],
    icon: "Star",
    fee: "₹6,500 / $90",
    duration: "45 mins",
    isActive: true
  },
  {
    id: "serv-4",
    title: "Porcelain Veneers & Smile Design",
    category: "Cosmetic",
    description: "Handcrafted 0.2mm ultra-thin E-Max ceramic shells correcting chips, gaps, alignment, and severe discoloration for a red-carpet smile.",
    image: "/assets/treatments/porcelain_veneers.jpg",
    technology: "Digital Smile Design & E-Max CAD/CAM",
    idealFor: "Chipped, Gapped or Darkened Teeth",
    features: [
      "0.2mm ultra-conservative enamel preparation",
      "Natural tooth translucency & stain resistance",
      "Live 3D smile preview prior to final placement"
    ],
    icon: "Verified",
    fee: "₹12,000 / $160",
    duration: "60 mins",
    isActive: true
  },
  {
    id: "serv-5",
    title: "Single-Visit Laser Root Canal",
    category: "Endodontics",
    description: "100% painless single-sitting treatment under digital surgical microscope with 3D warm vertical gutta-percha obturation.",
    image: "/assets/treatments/laser_root_canal.jpg",
    technology: "Carl Zeiss Microscope & WaterLase",
    idealFor: "Severe Toothache, Infection & Abscess",
    features: [
      "Completed in one comfortable 40-minute sitting",
      "Laser photo-acoustic canal sterilization (99.8%)",
      "Computerized Wand anesthesia for zero needle pinch"
    ],
    icon: "MedicalServices",
    fee: "₹5,500 / $75",
    duration: "40 mins",
    isActive: true
  },
  {
    id: "serv-6",
    title: "Ultrasonic Scaling & Airflow Polish",
    category: "Preventative",
    description: "Airflow ultrasonic plaque & calculus removal, stain erasure, deep gum pocket detox, and remineralizing fluoride polish.",
    image: "/assets/treatments/ultrasonic_scaling.jpg",
    technology: "EMS Swiss Piezon & Airflow Prophylaxis",
    idealFor: "Tartar Buildup, Bleeding Gums & Bad Breath",
    features: [
      "Gentle warm-water ultrasonic plaque removal",
      "Erythritol micro-powder stain lifting without grit",
      "Strengthens tooth enamel with fluoride varnish"
    ],
    icon: "CleanHands",
    fee: "₹1,800 / $25",
    duration: "30 mins",
    isActive: true
  },
  {
    id: "serv-7",
    title: "Painless Wisdom Tooth Extraction",
    category: "Surgery",
    description: "Atraumatic surgical impaction extraction with platelet-rich fibrin (PRF) therapy for rapid swelling-free healing.",
    image: "/assets/treatments/wisdom_tooth_extraction.jpg",
    technology: "Piezoelectric Bone Surgery & PRF Therapy",
    idealFor: "Impacted Wisdom Teeth & Jaw Crowding",
    features: [
      "Ultrasonic bone cutting spares soft nerves & tissue",
      "Autologous PRF healing plugs eliminate dry socket",
      "Optional twilight nitrous oxide sedation comfort"
    ],
    icon: "Shield",
    fee: "₹4,500 / $60",
    duration: "35 mins",
    isActive: true
  },
  {
    id: "serv-8",
    title: "Pediatric & Gentle Kids Dentistry",
    category: "Preventative",
    description: "Friendly preventive sealants, cavity restorations, space maintainers, and gentle fluoride treatments in a child-friendly lounge.",
    image: "/assets/treatments/pediatric_dentistry.jpg",
    technology: "No-Drill Icon Resin & Tell-Show-Do",
    idealFor: "Infants, Children & Anxious Teens",
    features: [
      "Gentle anxiety-free pediatric dentist approach",
      "No-drill dental cavity arrest with Icon resin",
      "Fun gift token & bravery certificate included"
    ],
    icon: "ChildCare",
    fee: "₹2,000 / $30",
    duration: "25 mins",
    isActive: true
  },
  {
    id: "serv-9",
    title: "Annual Dental Health & Wellness Plan",
    category: "Preventative",
    description: "Comprehensive 365-day preventive oral care pass including bi-annual ultrasonic cleanings, unlimited 3D digital diagnostics, priority emergency visits, and exclusive member discounts across all treatments.",
    image: "/assets/treatments/annual_health_plan.jpg",
    technology: "365-Day Preventive Wellness Pass",
    idealFor: "Individuals, Working Professionals & Families",
    features: [
      "2 Complimentary Ultrasonic Cleanings & Airflow Polishes",
      "Unlimited Digital Intraoral Exams & 3D Diagnostics",
      "15% Privileged Savings on All Restorations & Cosmetics",
      "Priority Same-Day Emergency Slot with VIP Concierge"
    ],
    icon: "CardMembership",
    fee: "From ₹3,499 / year",
    duration: "365 Days Coverage",
    isActive: true,
    isAnnualPlan: true
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "test-1",
    name: "Ananya Roy",
    rating: 5,
    comment: "I was terrified of dental implants after a sports injury. Dr. Jenkins used 3D computer guided surgery — literally zero pain and the crown looks 100% like my natural tooth! Plus the instant WhatsApp appointment pass kept me informed throughout.",
    date: "2026-08-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    service: "Precision Dental Implants"
  },
  {
    id: "test-2",
    name: "Rohan Kapoor",
    rating: 5,
    comment: "Did the Zoom Laser Whitening before my destination wedding. 8 shades lighter in just 45 minutes with zero sensitivity! Friends kept asking if I had veneers done. Absolutely world-class dental clinic!",
    date: "2026-08-22",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    service: "Zoom Laser Whitening"
  },
  {
    id: "test-3",
    name: "Dr. Meera Nambiar",
    rating: 5,
    comment: "As a surgeon myself, hygiene and equipment standards are paramount. Apex Dental Studio has top-tier sterilization and digital 3D jaw CBCT scanners. The clear aligners transformed my smile in 7 months.",
    date: "2026-08-28",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    service: "Clear Invisible Aligners"
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "Is dental implant surgery painful?",
    answer: "Not at all! We use localized micro-anesthesia and computer-guided 3D surgical templates. Most patients report feeling only mild pressure and resume normal desk work the very next morning.",
    category: "Implants"
  },
  {
    id: "faq-2",
    question: "How do Clear Invisible Aligners compare to metal braces?",
    answer: "Clear aligners are virtually invisible, custom 3D printed for your dental arch, and completely removable while eating and brushing. There are zero wire cuts or bracket emergencies, and treatment is often 30% faster.",
    category: "Orthodontics"
  },
  {
    id: "faq-3",
    question: "How long does Zoom Laser Teeth Whitening last?",
    answer: "Zoom 4 results typically last 1.5 to 3 years depending on dietary habits (coffee, tea, red wine). We also provide an enamel-strengthening maintenance kit to keep your shine radiant.",
    category: "Cosmetic"
  },
  {
    id: "faq-4",
    question: "Will I receive WhatsApp confirmation with pre-visit instructions?",
    answer: "Yes! Immediately after booking via our website or 24/7 AI Chatbot, an automated WhatsApp receipt with clinic GPS, slot time, and pre-appointment guidelines will be dispatched to your phone.",
    category: "Booking"
  },
  {
    id: "faq-5",
    question: "Can a Root Canal really be completed in a single visit?",
    answer: "Yes! Utilizing digital rotary endodontics, high-powered dental microscopes, and cold laser disinfection, 95% of our root canal therapies are completed pain-free in a single 40-minute appointment.",
    category: "Endodontics"
  }
];

export const INITIAL_GALLERY = [
  {
    id: "gal-1",
    title: "Private VIP Dental Operatory Suite",
    category: "Operatory",
    description: "Ergonomic Italian memory-foam dental chair with ceiling entertainment screens and noise-cancelling headphones.",
    imageUrl: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal-2",
    title: "In-House German CAD/CAM 3D Milling Lab",
    category: "Technology",
    description: "Dentsply Sirona robotic milling unit crafting monolithic zirconia crowns and E-Max veneers in under 45 minutes.",
    imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal-3",
    title: "Planmeca 3D CBCT Diagnostic Lab",
    category: "Radiology",
    description: "Ultra-low radiation 3D cone-beam tomography providing sub-millimeter anatomical bone mapping for guided implants.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal-4",
    title: "Class-B 7-Stage Hospital Sterilization Bay",
    category: "Hygiene",
    description: "Triple-pulse vacuum autoclaves, automated pouch sealers, and air purification exceeding CDC & OSHA standards.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal-5",
    title: "Luxury Reception & Patient Lounge",
    category: "Lounge",
    description: "Serene boutique hotel ambiance featuring complimentary espresso bar, high-speed WiFi, and zero-wait check-in desk.",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal-6",
    title: "Microscopic Endodontic & Implant Suite",
    category: "Surgery",
    description: "Carl Zeiss surgical magnification microscope and Biolase WaterLase laser for precision painless tooth preservation.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "APT-803",
    patientName: "Pankaj Kapoor",
    mobile: "9466585014",
    email: "pankaj.kapoor@example.com",
    age: "36",
    gender: "Male",
    address: "Model Town, Metro City",
    problem: "Painless Wisdom Tooth Removal",
    preferredDate: "2026-09-08",
    preferredTime: "10:30 AM",
    message: "Requested consultation with 20% discount coupon.",
    status: "Pending",
    promoCode: "APEXR898HW",
    source: "Website Form (20% Code: APEXR898HW)",
    createdAt: "2026-09-07T09:26:00Z"
  },
  {
    id: "APT-801",
    patientName: "Kavita Singhal",
    mobile: "9729280731",
    email: "kavita.singhal@example.com",
    age: "29",
    gender: "Female",
    address: "B-402, Pinnacle Palms, Metro City",
    problem: "Clear Invisible Aligners Consultation",
    preferredDate: "2026-09-10",
    preferredTime: "11:00 AM",
    message: "Interested in invisible braces for wedding in 6 months.",
    status: "Approved",
    source: "AI Chatbot",
    createdAt: "2026-09-04T10:00:00Z"
  },
  {
    id: "APT-802",
    patientName: "Vikram Malhotra",
    mobile: "9729280731",
    email: "vikram.m@example.com",
    age: "42",
    gender: "Male",
    address: "Villa 18, Lake View Enclave, Metro City",
    problem: "Precision Dental Implant Assessment",
    preferredDate: "2026-09-11",
    preferredTime: "04:30 PM",
    message: "Missing lower right molar, need permanent tooth replacement.",
    status: "Pending",
    source: "Website",
    createdAt: "2026-09-04T11:30:00Z"
  }
];

export const INITIAL_WHATSAPP_SETTINGS = {
  provider: "evolution_go",
  serverUrl: import.meta.env?.VITE_EVOLUTION_SERVER_URL || "https://wa.beta-labs.in",
  instanceName: import.meta.env?.VITE_EVOLUTION_INSTANCE_NAME || "dr_bharti",
  apiKey: import.meta.env?.VITE_EVOLUTION_API_KEY || "",
  doctorWhatsAppNumber: "918808731295",
  isLiveApiEnabled: true,
};

export const INITIAL_DISCOUNT_CONFIG = {
  isEnabled: true,
  discountPercentage: '20% OFF',
  discountHeadline: '20% OFF',
  discountSubtext: 'Exclusive discount for new patients!',
  validityDays: 10,
  codePrefix: 'APEX',
  tabLabel: 'GET DISCOUNT',
};

export const INITIAL_DISCOUNT_LEADS = [
  {
    id: "lead-0",
    phone: "+91 9466585014",
    code: "APEXR898HW",
    discount: "20% OFF",
    status: "Booked",
    createdAt: "2026-09-07T09:20:00Z",
  },
  {
    id: "lead-1",
    phone: "+91 9876543210",
    code: "APEX98LU",
    discount: "20% OFF",
    status: "Claimed",
    createdAt: "2026-09-07T08:30:00Z",
  },
  {
    id: "lead-2",
    phone: "+91 9729280731",
    code: "APEX20VM",
    discount: "20% OFF",
    status: "Booked",
    createdAt: "2026-09-07T07:15:00Z",
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "PAT-9466585014",
    name: "Pankaj Kapoor",
    mobile: "9466585014",
    email: "pankaj.kapoor@example.com",
    age: "36",
    gender: "Male",
    bloodGroup: "B+",
    address: "Model Town, Metro City",
    lastVisit: "2026-09-08",
    lastProblem: "Painless Wisdom Tooth Removal",
    totalVisits: 1,
    notes: "New patient consultation with 20% discount coupon.",
    createdAt: "2026-09-07T09:26:00Z",
  },
  {
    id: "PAT-9729280731",
    name: "Kavita Singhal",
    mobile: "9729280731",
    email: "kavita.singhal@example.com",
    age: "29",
    gender: "Female",
    bloodGroup: "O+",
    address: "B-402, Pinnacle Palms, Metro City",
    lastVisit: "2026-09-10",
    lastProblem: "Clear Invisible Aligners Consultation",
    totalVisits: 2,
    notes: "Interested in invisible braces for wedding in 6 months.",
    createdAt: "2026-09-04T10:00:00Z",
  },
  {
    id: "PAT-9876543210",
    name: "Vikram Malhotra",
    mobile: "9729280731",
    email: "vikram.m@example.com",
    age: "42",
    gender: "Male",
    bloodGroup: "A+",
    address: "Villa 18, Lake View Enclave, Metro City",
    lastVisit: "2026-09-11",
    lastProblem: "Precision Dental Implant Assessment",
    totalVisits: 1,
    notes: "Missing lower right molar, need permanent tooth replacement.",
    createdAt: "2026-09-04T11:30:00Z",
  },
];

