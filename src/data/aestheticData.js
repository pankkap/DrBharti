export const AESTHETIC_CATEGORIES = [
  'All',
  'Facial Glow',
  'Anti-Aging',
  'Laser Treatments',
  'Clarifying & Peels',
  'Hair & Scalp',
];

export const AESTHETIC_TREATMENTS = [
  {
    id: 'aes-1',
    title: 'HydraFacial MD® 7-Step Deep Detox',
    category: 'Facial Glow',
    tagline: 'Instant Red-Carpet Radiance & Vortex Blackhead Extraction',
    description: 'Medical-grade hydra-dermabrasion combining vortex deep pore extraction, lactic & glycolic micro-exfoliation, hyaluronic acid hydration infusion, and soothing LED phototherapy.',
    image: '/assets/aesthetic/hydrafacial.jpg',
    technology: 'Vortex-Fusion® Technology & Blue/Red LED',
    idealFor: 'Clogged Pores, Dull Complexion, Dehydration & Congested T-Zone',
    downtime: 'Zero Downtime',
    results: 'Instant Dewy Glow (Lasts 3–4 Weeks)',
    fee: '₹4,500 / session',
    duration: '45 mins',
    features: [
      'Painless vortex suction of blackheads & debris',
      'Targeted infusion of peptides & antioxidants',
      'Includes calming LED phototherapy soothing mask',
      'Safe for all skin types, immediate makeup readiness'
    ],
    protocol: [
      'Step 1: Gentle Lymphatic Drainage',
      'Step 2: Deep Cleansing & Glycolic Exfoliation',
      'Step 3: Vacuum Extraction of Impurities',
      'Step 4: Hyaluronic Acid & Peptide Infusion',
      'Step 5: Medical LED Light Rejuvenation'
    ]
  },
  {
    id: 'aes-2',
    title: 'Botox® Dynamic Wrinkle Smoothing',
    category: 'Anti-Aging',
    tagline: 'Natural Facial Expression Preservation with US-FDA Neuromodulators',
    description: 'Precision anti-wrinkle micro-injections targeting forehead horizontal lines, glabella frown lines, crow’s feet around eyes, gummy smile reduction, and masseter jaw slimming for facial harmonization.',
    image: '/assets/aesthetic/botox.jpg',
    technology: 'Allergan Botox® / Xeomin® (US-FDA Approved)',
    idealFor: 'Forehead Creases, Crow’s Feet, Frown Lines & Gummy Smiles',
    downtime: 'Minimal (2–4 hours redness)',
    results: 'Onset in 3–5 days, lasts 4–6 months',
    fee: '₹350 / unit',
    duration: '30 mins',
    features: [
      'Sub-millimeter micro-needle injection technique',
      'Preserves natural facial mobility — never frozen',
      'Doctor-administered facial muscle mapping',
      'Complimentary 14-day touch-up assessment'
    ],
    protocol: [
      'Comprehensive 3D facial muscle dynamics assessment',
      'High-potency topical numbing applied for 15 minutes',
      'Micro-droplet injections at key neuromuscular junctions',
      'Post-procedure cooling compress and care guidelines'
    ]
  },
  {
    id: 'aes-3',
    title: 'Hyaluronic Lip & Facial Contouring',
    category: 'Anti-Aging',
    tagline: 'Sculpted Cheekbones, Hydrated Lips & Balanced Facial Symmetry',
    description: 'High-cohesive cross-linked hyaluronic acid dermal fillers crafted to restore volume loss, smooth deep nasolabial laugh lines, refine lip contour, and sculpt the chin and jawline with natural proportion.',
    image: '/assets/aesthetic/lip_filler.jpg',
    technology: 'Juvéderm® Ultra XC & Voluma / Restylane®',
    idealFor: 'Thin Lips, Marionette Lines, Sunken Cheeks & Chin Retrusion',
    downtime: '1–2 days mild swelling',
    results: 'Instant results, lasts 12–18 months',
    fee: '₹18,000 / syringe (1ml)',
    duration: '40 mins',
    features: [
      'Integrated lidocaine for virtually painless delivery',
      'Reversible, safe biocompatible hyaluronic matrix',
      'Customized lip architecture (Russian or Classical technique)',
      'Immediate volumization with soft, natural texture'
    ],
    protocol: [
      'Facial profile harmony and golden ratio proportion mapping',
      'Topical anesthetic cream & gentle nerve block if requested',
      'Micro-cannula / micro-needle precision placement',
      'Gentle sculpting and symmetry verification'
    ]
  },
  {
    id: 'aes-4',
    title: 'Hollywood Carbon Laser Rejuvenation',
    category: 'Laser Treatments',
    tagline: 'Q-Switched Nd:YAG Laser Porcelain Glow & Pore Tightening',
    description: 'Liquid medical carbon lotion penetrates deep into pores to absorb sebum and contaminants, followed by Q-switched Nd:YAG laser pulses that vaporize impurities, stimulate neocollagenesis, and erase stubborn sun spots.',
    image: '/assets/aesthetic/carbon_laser.jpg',
    technology: 'Q-Switched Nd:YAG 1064nm Dual-Pulse Laser',
    idealFor: 'Enlarged Pores, Active Acne, Oily Skin & Sun Hyperpigmentation',
    downtime: 'Zero Downtime',
    results: 'Silky smooth texture & pore shrinkage from 1st session',
    fee: '₹3,800 / session',
    duration: '40 mins',
    features: [
      'Ablates clogged sebum and eliminates acne-causing bacteria',
      'Stimulates deep dermal collagen contraction',
      'Instant lightening of surface tan and uneven pigmentation',
      'Zero peeling or social downtime — immediate return to routine'
    ],
    protocol: [
      'Double cleanse and gentle botanical degreasing',
      'Application of organic nano-carbon suspension',
      'Protective optical shielding for patient eyes',
      'Two-pass Q-Switched laser photo-acoustic toning',
      'Calming botanical aloe mask and broad-spectrum SPF 50+'
    ]
  },
  {
    id: 'aes-5',
    title: 'Medical Clarifying & Glow Peels',
    category: 'Clarifying & Peels',
    tagline: 'Customized Dermatological Peels for Melasma & Pigmentation',
    description: 'Physician-grade multi-acid formulations (Glycolic, Salicylic, Ferulic, TCA, and L-Arginine) tailored to resurface dead epidermal layers, lighten stubborn melasma, refine rough texture, and reveal glass skin radiance.',
    image: '/assets/aesthetic/chemical_peel.jpg',
    technology: 'Medical-Grade AHA, BHA & Retinol Peels',
    idealFor: 'Melasma, Post-Acne Dark Spots, Rough Texture & Sun Damage',
    downtime: '1–3 days micro-flaking (optional gentle peels zero downtime)',
    results: 'Luminous tone & even texture across 3–4 sessions',
    fee: '₹2,500 / session',
    duration: '30 mins',
    features: [
      'Customized pH and concentration matched to your Fitzpatrick skin type',
      'Safe for sensitive Indian and Asian skin tones',
      'Targets stubborn epidermal and dermal pigmentation',
      'Post-peel soothing antioxidant barrier serum included'
    ],
    protocol: [
      'Digital skin analysis checking sebum and sensitivity levels',
      'Targeted barrier protection on sensitive facial contours',
      'Layered application of acid peel under monitored timing',
      'Neutralizing rinse and cold cryo-roller soothing massage',
      'Hydrating hyaluronic lock and medical barrier cream'
    ]
  },
  {
    id: 'aes-6',
    title: 'Fractional RF Microneedling (MNRF)',
    category: 'Anti-Aging',
    tagline: 'Deep Dermal Remodeling for Acne Scars & Skin Tightening',
    description: 'Gold-plated insulated micro-needles penetrate deep into the reticular dermis delivering targeted radiofrequency thermal energy, stimulating massive new collagen and elastin production to smooth cratered scars and firm sagging skin.',
    image: '/assets/aesthetic/microneedling.jpg',
    technology: 'Fractional Micro-Needle Radiofrequency (MNRF)',
    idealFor: 'Deep Ice-Pick & Boxcar Acne Scars, Sagging Jowls & Large Pores',
    downtime: '24–48 hours mild sunburn sensation',
    results: 'Progressive remodeling over 3 months, permanent collagen lift',
    fee: '₹6,500 / session',
    duration: '50 mins',
    features: [
      'Adjustable 0.5mm – 3.5mm depth targeting deep scar tissue',
      'Spares the epidermis, minimizing post-inflammatory pigmentation',
      'Combines mechanical microneedling with thermal RF energy',
      'Significant improvement in skin elasticity and firmness'
    ],
    protocol: [
      'High-grade topical numbing for 30 minutes for comfortable experience',
      'Antiseptic surgical cleansing of treatment zones',
      'Calibrated multi-depth fractional RF passes across face & neck',
      'Infusion of regenerative growth factor serum',
      'Cooling biocellulose calming mask application'
    ]
  },
  {
    id: 'aes-7',
    title: 'Autologous PRP Scalp & Hair Restoration',
    category: 'Hair & Scalp',
    tagline: 'High-Yield Platelet-Rich Plasma Growth Factor Therapy',
    description: 'Using the patient’s own concentrated blood platelets loaded with vascular endothelial and epidermal growth factors, autologous PRP is micro-injected into dormant hair follicles to arrest hair shedding and stimulate thicker hair density.',
    image: '/assets/aesthetic/hair_prp.jpg',
    technology: 'Centrifuged High-Yield Autologous PRF / PRP',
    idealFor: 'Androgenetic Alopecia, Postpartum Hair Thinning & Receding Hairline',
    downtime: 'Zero Downtime',
    results: 'Reduced shedding within 4 weeks; visible thickening in 3 months',
    fee: '₹5,000 / session',
    duration: '45 mins',
    features: [
      '100% natural and biocompatible — zero risk of allergic rejection',
      'Up to 5x baseline concentration of platelet growth factors',
      'Micro-needle mesotherapy delivery for optimal follicle delivery',
      'Combined with scalp biotin and peptide revitalization spray'
    ],
    protocol: [
      'Painless blood draw (15ml) into specialized separator tubes',
      'High-precision centrifugation separating platelet-rich plasma',
      'Application of scalp topical cooling spray / anesthetic',
      'Precision micro-papular injections directly at follicle roots',
      'Post-care advice and personalized home trichology regimen'
    ]
  }
];

export const AESTHETIC_PILLARS = [
  {
    title: 'Doctor-Led Clinical Cosmetology',
    description: 'Every assessment and procedure is personally executed by Dr. Bharti, holding a certified Fellowship in Medical Cosmetology, ensuring profound facial anatomical knowledge and patient safety.',
    icon: 'VerifiedUser'
  },
  {
    title: '100% US-FDA Approved Products',
    description: 'We exclusively utilize genuine Allergan Botox®, Juvéderm®, and medical-grade sterile formulations with full barcode traceability and zero grey-market products.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Facial Harmony & Subtle Natural Beauty',
    description: 'Our aesthetic philosophy centers on enhancing your intrinsic elegance. We avoid artificial, "overdone," or frozen results, aiming for refreshed and youthful balance.',
    icon: 'AutoAwesome'
  },
  {
    title: 'Zero Downtime & Hospital Sterility',
    description: 'Experience clinical treatments designed for busy executives, brides, and professionals. Stringent surgical-grade sterilization ensures maximum safety and rapid recovery.',
    icon: 'HealthAndSafety'
  }
];

export const AESTHETIC_FAQS = [
  {
    question: 'Are aesthetic and cosmetology treatments safe when performed by Dr. Bharti?',
    answer: 'Absolutely. Dr. Bharti holds a specialized Fellowship in Medical Cosmetology alongside her 16+ years of surgical experience. Medical doctors possess detailed knowledge of facial vascular anatomy, cranial nerves, and dermal layers, ensuring exponentially safer outcomes compared to non-medical salons or beauticians.'
  },
  {
    question: 'Will Botox make my face look frozen or unnatural?',
    answer: 'Not at our clinic. We adhere to conservative "baby Botox" micro-dosing protocols that soften dynamic wrinkles and prevent deep etched lines while completely preserving your natural facial expressions, smiling, and eyebrow movement.'
  },
  {
    question: 'How long do HydraFacial and Carbon Laser results last?',
    answer: 'HydraFacial delivers an immediate glass-skin luminosity that typically lasts 3 to 4 weeks. With monthly maintenance, skin texture, sebum balance, and pore size improve permanently. Carbon Laser Peel gives visible pore tightening from the very first session.'
  },
  {
    question: 'Is there any downtime after Dermal Fillers or RF Microneedling?',
    answer: 'Dermal fillers have virtually zero downtime; you might experience slight pinpoint redness or mild swelling for 24–48 hours that can easily be concealed. Fractional RF Microneedling typically causes mild pinkness resembling a light sunburn for 24 hours, after which you can resume your regular routine.'
  },
  {
    question: 'How do I book an aesthetic consultation with Dr. Bharti?',
    answer: 'You can select any aesthetic procedure directly from this page to book an online appointment slot, or contact our clinic concierge via WhatsApp at +91 88087 31295 for a confidential aesthetic assessment.'
  }
];
