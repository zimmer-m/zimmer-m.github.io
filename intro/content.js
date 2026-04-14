const defined = {

  hero: {
    name: "Max Zimmer",
    tagline: "I study how to make deep learning efficient — and what we can discover when it is.",
    subtitle: "Deep Learning Research Lead · PhD Candidate in Mathematics",
    affiliations: [
      { label: "Zuse Institute Berlin", url: "https://www.zib.de/", abbr: "ZIB" },
      { label: "TU Berlin", url: "https://www.tu.berlin/", abbr: "TU Berlin" },
      { label: "MATH+", url: "https://mathplus.de/", abbr: "MATH+" }
    ]
  },

  who: {
    name: "Max Zimmer",
    photo: "/assets/img/prof_pic.png",
    photoAlt: "Max Zimmer",
    bio: "I lead the iol.LEARN deep learning research group at Zuse Institute Berlin and am a PhD candidate in Mathematics at TU Berlin, advised by Sebastian Pokutta. My research sits at the intersection of efficient deep learning, AI-driven mathematical discovery, and the development of agentic research tools.",
    roles: [
      { title: "Deep Learning Research Lead", org: "iol.LEARN group, Zuse Institute Berlin", url: "https://iol.zib.de/research/iol-learn.html" },
      { title: "PhD Candidate in Mathematics", org: "Technische Universität Berlin", url: "https://www.tu.berlin/en/math" },
      { title: "Visiting Researcher", org: "INRIA Paris (hosted by Alexandre d'Aspremont), Feb–Apr 2026", url: "https://www.di.ens.fr/~aspremon/" },
      { title: "Member", org: "Berlin Mathematical School & MATH+ Cluster of Excellence", url: "https://mathplus.de/" }
    ],
    education: [
      { degree: "PhD in Mathematics", inst: "TU Berlin", year: "2021–present", detail: "Advisor: Prof. Dr. Sebastian Pokutta" },
      { degree: "MSc in Mathematics", inst: "TU Berlin", year: "2018–2021", detail: null },
      { degree: "Semester abroad", inst: "Università di Bologna", year: "2016–2017", detail: null },
      { degree: "BSc in Mathematics", inst: "TU Berlin", year: "2013–2017", detail: null }
    ],
    experience: [
      { role: "Research Intern", inst: "IST Austria", year: "2020", detail: "Hosted by Prof. Marco Mondelli" },
      { role: "Student Research Assistant", inst: "COGA Group, TU Berlin", year: "2018–2020", detail: null },
      { role: "Research Intern", inst: "Univ. Naples Federico II", year: "2018", detail: "Hosted by Prof. Sergio De Rosa" }
    ]
  },

  research: [
    {
      id: "efficiency",
      name: "Efficiency",
      desc: "Neural network pruning, weight sparsity, quantization, KV cache compression, and speculative decoding — making models smaller and faster without losing what matters.",
      icon: "fa-solid fa-bolt"
    },
    {
      id: "ai4math",
      name: "AI4Math",
      desc: "Using deep learning to tackle open problems in mathematics — from classifying real algebraic curves to computer-assisted proofs and neural discovery.",
      icon: "fa-solid fa-square-root-variable"
    },
    {
      id: "agentic-ai",
      name: "Agentic AI",
      desc: "Building autonomous multi-agent systems that can design experiments, write code, and conduct scientific research with minimal human oversight.",
      icon: "fa-solid fa-robot"
    },
    {
      id: "sustainability",
      name: "Sustainability",
      desc: "Applying deep learning to environmental monitoring — global canopy height estimation from satellite imagery for forest conservation and climate science.",
      icon: "fa-solid fa-leaf"
    },
    {
      id: "optimization",
      name: "Optimization",
      desc: "First-order methods, Frank-Wolfe algorithms, and the mathematical foundations that connect optimization theory to deep learning practice.",
      icon: "fa-solid fa-chart-line"
    }
  ],

  highlights: [
    {
      text: "ICML 2025 — Oral Presentation",
      detail: "\"Neural Discovery in Mathematics: Do Machines Dream of Colored Planes?\" — one of approximately 1.5% of submissions selected for oral presentation."
    },
    {
      text: "Deep Learning Research Lead",
      detail: "Leading the iol.LEARN group at Zuse Institute Berlin since 2024, supervising research across efficiency, AI4Math, and sustainability."
    },
    {
      text: "Visiting Researcher — INRIA Paris",
      detail: "Research visit hosted by Alexandre d'Aspremont at INRIA, Feb–Apr 2026."
    },
    {
      text: "MATH+ & Berlin Mathematical School",
      detail: "Member of two of Berlin's leading mathematical research programs: the MATH+ Cluster of Excellence and the Berlin Mathematical School graduate school."
    }
  ],

  selectedWork: [
    {
      title: "The Agentic Researcher: A Practical Guide to AI-Assisted Research",
      tag: "Agentic AI",
      venue: "2026",
      preview: "/assets/img/publication_preview/agentic_researcher.png",
      desc: "An open-source framework that turns CLI coding agents into autonomous research assistants, enabling sustained research sessions running over 20 hours across multi-node GPU clusters without human intervention.",
      pdf: "https://arxiv.org/abs/2603.15914",
      code: "https://github.com/ZIB-IOL/The-Agentic-Researcher",
      blog: "https://maxzimmer.org/the-agentic-researcher"
    },
    {
      title: "Neural Discovery in Mathematics: Do Machines Dream of Colored Planes?",
      tag: "AI4Math",
      venue: "ICML 2025 · Oral",
      preview: "/assets/img/publication_preview/colordreaming.png",
      desc: "A neural network approach to the Hadwiger–Nelson problem that discovered two new 6-colorings — the first progress in 30 years on a key variant involving different forbidden distances.",
      pdf: "https://arxiv.org/abs/2501.18527",
      code: "https://github.com/ZIB-IOL/neural-discovery-icml25",
      blog: "https://maxzimmer.org/blog/2025/neural-discovery-in-mathematics-do-machines-dream-of-colored-planes"
    },
    {
      title: "SparseSwaps: Tractable LLM Pruning Mask Refinement at Scale",
      tag: "Efficiency",
      venue: "2025",
      preview: "/assets/img/publication_preview/sparseswaps.png",
      desc: "A scalable method for refining pruning masks in large language models, enabling tractable mask optimization at the scale of modern LLMs.",
      pdf: "https://arxiv.org/abs/2512.10922",
      code: "https://github.com/ZIB-IOL/SparseSwaps",
      blog: null
    },
    {
      title: "ECHOSAT: Estimating Canopy Height Over Space And Time",
      tag: "Sustainability",
      venue: "2026",
      preview: "/assets/img/publication_preview/echosat.png",
      desc: "The first global and temporally consistent tree height map at 10m resolution spanning seven years, using a Vision Transformer with a self-supervised growth loss to capture natural tree development and disturbances.",
      pdf: "https://arxiv.org/abs/2602.21421",
      code: "https://github.com/ai4forest/echosat",
      blog: "https://maxzimmer.org/blog/2026/echosat"
    }
  ],

  blog: [
    {
      title: "The Agentic Researcher",
      date: "Apr 2026",
      tag: "Agentic AI",
      desc: "A practical guide to AI-assisted research in mathematics and machine learning.",
      url: "https://maxzimmer.org/the-agentic-researcher"
    },
    {
      title: "ECHOSAT",
      date: "Mar 2026",
      tag: "Sustainability",
      desc: "Estimating canopy height over space and time with satellite data.",
      url: "https://maxzimmer.org/blog/2026/echosat"
    },
    {
      title: "Neural Discovery in Mathematics",
      date: "May 2025",
      tag: "AI4Math",
      desc: "Do machines dream of colored planes? An ICML 2025 oral.",
      url: "https://maxzimmer.org/blog/2025/neural-discovery-in-mathematics-do-machines-dream-of-colored-planes"
    },
    {
      title: "Latent Manifolds via Vanishing Ideals",
      date: "May 2025",
      tag: "AI4Math",
      desc: "Understanding neural network representations through algebraic geometry.",
      url: "https://maxzimmer.org/blog/2025/approximating-latent-manifolds-in-neural-networks"
    },
    {
      title: "Temporal Dynamics in Tree Canopy Height",
      date: "May 2025",
      tag: "Sustainability",
      desc: "First 10m temporal canopy height map of Europe, at ICML 2025.",
      url: "https://maxzimmer.org/blog/2025/capturing-temporal-dynamics-in-tree-canopy-height"
    },
    {
      title: "Global-Scale Forest Height Estimation",
      date: "Apr 2025",
      tag: "Sustainability",
      desc: "A deep learning framework for global canopy height mapping, at ICML 2024.",
      url: "https://maxzimmer.org/blog/2025/estimating-canopy-height-at-scale"
    }
  ],

  contact: {
    heading: "Get in Touch",
    subtext: "Interested in collaboration, joining the group, or just want to chat about research?",
    cta: [
      { label: "maxzimmer.org", url: "https://maxzimmer.org" },
      { label: "iol.zib.de/learn", url: "https://iol.zib.de/research/iol-learn.html" },
      { label: "zimmer@zib.de", url: "mailto:zimmer@zib.de" }
    ],
    social: [
      { icon: "fa-brands fa-x-twitter", label: "X / Twitter", url: "https://x.com/maxzimmerberlin" },
      { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", url: "https://www.linkedin.com/in/zimmer-max" },
      { icon: "fa-solid fa-graduation-cap", label: "Google Scholar", url: "https://scholar.google.com/citations?user=WmWwh1kAAAAJ" }
    ]
  },

  footer: {
    links: [
      { label: "IOL Lab", url: "https://iol.zib.de" },
      { label: "Zuse Institute Berlin", url: "https://www.zib.de/" },
      { label: "TU Berlin", url: "https://www.tu.berlin/" },
      { label: "MATH+", url: "https://mathplus.de/" },
      { label: "Berlin Mathematical School", url: "https://www.math-berlin.de" }
    ]
  }

};
