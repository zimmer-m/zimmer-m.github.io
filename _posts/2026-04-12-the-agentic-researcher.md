---
layout: project-distill
title: "The Agentic Researcher: A Practical Guide to AI-Assisted Research in Mathematics and Machine Learning"
date: 2026-04-12
permalink: /the-agentic-researcher/
description: "Our paper <b>The Agentic Researcher</b> presents an open-source framework that turns CLI coding agents into autonomous research assistants. Through methodological rules formulated as agent prompts, we enable sustained autonomous research sessions — including sessions running over 20 hours across multi-node GPU clusters without human intervention."
tags: [deep-learning, agentic-ai]
keywords: "agentic AI, AI-assisted research, autonomous research, Claude Code, coding agents, LLM research, scientific methodology"
og_image: "https://maxzimmer.org/assets/img/blog_img/agentic-researcher/terminal-1.png"
publication_type: "Preprint"
paper_url: "https://arxiv.org/abs/2603.15914"
code_url: "https://github.com/ZIB-IOL/The-Agentic-Researcher"
project: true
giscus_comments: false
related_posts: false
authors:
  - name: Max Zimmer
    affiliations:
      name: Zuse Institute Berlin
  - name: Nico Pelleriti
    affiliations:
      name: Zuse Institute Berlin
  - name: Christophe Roux
    affiliations:
      name: Zuse Institute Berlin
  - name: Sebastian Pokutta
    affiliations:
      name: Zuse Institute Berlin
---

<div class="hero-image-wrap">
  <img src="/assets/img/blog_img/agentic-researcher/terminal-1.png" alt="An autonomous research session dispatching experiments across 6 GPUs" data-zoomable>
  <p class="figure-caption">An autonomous research session running for over 8 hours, dispatching independent experiments across 6 GPUs with 10 active background tasks.</p>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Framework">The Framework</h2>

The Agentic Researcher is an open-source framework that turns CLI coding agents into autonomous research assistants. The core idea: encode scientific methodology as agent prompts, so that the agent follows the same principles a careful researcher would.

In practice, the researcher provides a research question, available tools, and relevant prior knowledge. The agent then takes over: it formalizes ideas, implements approaches, runs evaluations, analyzes results, and maintains a structured LaTeX report. Sessions can run for hours or days without human intervention, with the researcher checking in and steering as needed.

<div class="project-grid cols-3 reveal">
  <div class="project-card">
    <h4 class="highlight-text">Sandboxed</h4>
    <p>Runs in isolated containers (Docker, Podman, Apptainer) with filesystem access restricted to <code>/workspace</code>.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Model-Agnostic</h4>
    <p>Works with any CLI coding agent: Claude Code, OpenCode, Gemini CLI, or Codex CLI.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Scalable</h4>
    <p>From single-GPU laptops to multi-node Slurm clusters with GPU passthrough.</p>
  </div>
</div>

</div>
</div>

<div class="project-section alt">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Getting Started">Getting Started</h2>

The full source code and documentation are available at [github.com/ZIB-IOL/The-Agentic-Researcher](https://github.com/ZIB-IOL/The-Agentic-Researcher).

### Installation

```bash
git clone https://github.com/ZIB-IOL/The-Agentic-Researcher.git
cd The-Agentic-Researcher
./scripts/install.sh
```

### Configuration

Run `agentic-researcher --setup` to configure your environment. This stores settings in `~/.config/agentic-researcher/config.sh` and covers:

- **Container runtime**: Docker, Podman, or Apptainer (Linux)
- **CLI tool**: Claude Code (default), OpenCode, Gemini CLI, or Codex CLI
- **Authentication**: OAuth or API key for the chosen tool
- **Bind directories**: Additional filesystem paths to mount into the container
- **Environment variables**: Proxy settings, custom endpoints

### Starting a Session

```bash
# Build the container (first time only)
agentic-researcher --build

# Launch on the current directory
agentic-researcher

# Or target a specific project
agentic-researcher ~/my-project

# Auto-approve all agent operations
agentic-researcher --yolo
```

Inside the container, run `/setup_research_plan` to initialize a new project. The agent will ask about your research goals, evaluation metrics, compute budget, and constraints. It then creates the instruction file (`CLAUDE.md`, `GEMINI.md`, or `AGENTS.md` depending on your tool), initializes `report.tex` and `TODO.md`, and begins autonomous execution.

### Resuming a Session

Relaunching on an existing project automatically restores context. The agent reads `report.tex`, `TODO.md`, and the git log to pick up where it left off.

### Multi-Node Dispatch

For cluster environments with Slurm:

```bash
# Requires Apptainer and an active allocation
agentic-researcher --multi-node

# Validate the setup first
agentic-researcher --multi-node --test
```

The agent uses git worktrees for parallel sessions, so independent experiments run on separate copies of the codebase without interfering with each other.

</div>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Experiment Loop">The Experiment Loop</h2>

<div class="figure-container reveal">
  <img src="/assets/img/blog_img/agentic-researcher/framework_overview.png" alt="Overview of the agentic research framework" style="max-width: 100%; border-radius: 8px;" data-zoomable>
  <p class="figure-caption" style="text-align: center; font-size: 0.85rem; color: var(--global-text-color-light); margin-top: 0.5rem;">Overview of the framework. The researcher writes a persistent instruction file that governs the CLI agent. The agent runs inside a sandbox and follows an eight-step experiment loop, with each step linked to the commandments that govern it.</p>
</div>

Once initialized, the agent follows an eight-step loop for each experiment:

1. **Explore** the current state of the project and prior results
2. **Plan** the next experiment based on the research plan and findings so far
3. **Implement** the approach, making minimal, targeted changes
4. **Evaluate** in tiers: crash test (seconds), small-scale signal (minutes), then full evaluation
5. **Analyze** results against the hypothesis and prior experiments
6. **Record** everything in `report.tex` with a fixed structure: goal, hypothesis, method, implementation, results, analysis, next steps
7. **Commit** with structured messages: `exp(E001): description -- metric=value`
8. **Iterate** back to step 1

Negative results are documented with the same rigor as positive ones. Every experiment is committed to git, making the full history reproducible and auditable.

</div>
</div>

<div class="project-section alt">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Commandments">The Ten Commandments</h2>

What makes autonomous sessions productive is not the underlying LLM but the methodological rules governing it. Without these rules, agents drift from the plan, fabricate results, or abandon promising directions after minor setbacks. We encode these rules as prompts that the agent follows throughout the session.

### Integrity

<div class="project-grid cols-3 reveal">
  <div class="project-card">
    <h4>I. Never Break a Promise</h4>
    <p>If you say "I will do X," do it. Under-promise, over-deliver.</p>
  </div>
  <div class="project-card">
    <h4>II. Never Manipulate Evaluation</h4>
    <p>No changing metrics, test sets, or fixed parameters. No hardcoding results or cherry-picking seeds.</p>
  </div>
  <div class="project-card">
    <h4>III. Never Fabricate Citations</h4>
    <p>Every bibliography entry must be verified against the actual source.</p>
  </div>
</div>

### Scientific Rigor

<div class="project-grid cols-3 reveal">
  <div class="project-card">
    <h4>VI. One Variable Per Experiment</h4>
    <p>Change exactly one thing. If two things change and the metric improves, you cannot know which helped.</p>
  </div>
  <div class="project-card">
    <h4>VII. Evaluate in Tiers</h4>
    <p>Tier 1 (seconds): does it run? Tier 2 (minutes): any signal? Tier 3: full evaluation for the report.</p>
  </div>
  <div class="project-card">
    <h4>VIII. Bound Your Expectations</h4>
    <p>Identify the theoretical best case before implementing. Know whether a 2% gain is nearly optimal or barely scratching the surface.</p>
  </div>
</div>

### Autonomy and Documentation

<div class="project-grid cols-2 reveal">
  <div class="project-card">
    <h4>IV. Complete All Work Before Reporting</h4>
    <p>Finish every task that does not need user input. Report once with all results.</p>
  </div>
  <div class="project-card">
    <h4>V. Make It Work Before Moving On</h4>
    <p>An experiment crash is a bug, not a bad idea. Investigate, fix, and re-run.</p>
  </div>
  <div class="project-card">
    <h4>IX. Record Everything</h4>
    <p>Every experiment gets a subsection in report.tex. Include failures. If it is not in the report, it did not happen.</p>
  </div>
  <div class="project-card">
    <h4>X. Verify Before Claiming</h4>
    <p>Write verification scripts, not explanations. Actively try to falsify claims.</p>
  </div>
</div>

Beyond these universal rules, the framework includes domain-specific commandments for compute-intensive research (one experiment per GPU, context window hygiene, systematic memory management, multi-node discovery) and mathematical research (derivations before code, precise notation, counterexample-first reasoning).

</div>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Case Studies">Case Studies</h2>

We validate the framework through six case studies spanning deep learning and mathematics. All figures below were produced autonomously by the agent and taken directly from the agent's reports.

### Optimizer Exploration for LLM Pretraining

Given a memory budget, the agent explored modifications to the Muon optimizer for LLM pretraining. It discovered that normalizing the momentum buffer and adding weight decay provide nearly additive improvements. The one-variable commandment was critical: it allowed isolating each contribution and identifying the best combination.

<div class="project-grid cols-2 reveal">
  <div class="figure-card">
    <img src="/assets/img/blog_img/agentic-researcher/paper_final_perplexity.png" alt="Final validation perplexity comparison" data-zoomable>
    <p class="figure-caption">Final validation perplexity (agent-generated plot). The agent's best modification achieves ~5% improvement over Muon and ~8% over AdamW.</p>
  </div>
  <div class="figure-card">
    <img src="/assets/img/blog_img/agentic-researcher/paper_training_curves.png" alt="Training curves" data-zoomable>
    <p class="figure-caption">Training curves over the full run and final 3,000 iterations (agent-generated plot). The improvements are consistent throughout training.</p>
  </div>
</div>

<p style="text-align: center; font-size: 0.9rem; color: var(--global-text-color-light);"><em>40+ experiments over 20+ hours of autonomous operation.</em></p>

### Weight Reconstruction in LLM Pruning

While debugging a broken pruning algorithm, the agent observed severe activation imbalance and proposed a simple 10-line post-pruning weight correction. The method reduces perplexity by 18 to 50% across five model scales and three architectures, with less than 1% compute overhead.

<div class="project-grid cols-2 reveal">
  <div class="figure-card">
    <img src="/assets/img/blog_img/agentic-researcher/scaling_model_size.png" alt="Scaling behavior across model sizes" data-zoomable>
    <p class="figure-caption">Relative perplexity improvement vs. model size (agent-generated plot). The effect peaks at 49.4% for 1.5B parameters at 60% sparsity.</p>
  </div>
  <div class="figure-card">
    <img src="/assets/img/blog_img/agentic-researcher/scaling_absolute_ppl.png" alt="Absolute perplexity comparison" data-zoomable>
    <p class="figure-caption">Absolute perplexity at 60% sparsity (agent-generated plot). RIA+Recon consistently outperforms the baseline across all model sizes.</p>
  </div>
</div>

### Further Case Studies

<div class="project-grid cols-2 reveal">
  <div class="project-card">
    <h4 class="highlight-text">Column Ordering in LLM Quantization</h4>
    <p>Investigated seven GPTQ column ordering strategies. The effect varies by two orders of magnitude across architectures (0.1% on Gemma, 74% on Llama). 9 of 24 experiments were negative results, each documented with the same rigor as positive ones.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Lower Bounds for Frank-Wolfe</h4>
    <p>Proved tight lower bounds for Frank-Wolfe on uniformly convex sets, resolving an open question. Over 30 verification scripts using BigFloat arithmetic confirmed the results to less than 0.2% relative error.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Multi-Variable Dual Tightening</h4>
    <p>Generalized dual tightening in the Boscia solver. Symbolic verification (2,387 checks) and numerical verification (487 checks) caught an inverted bound in the initial derivation, preventing incorrect conclusions.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Maximal Real Solutions in Power Networks</h4>
    <p>Characterized maximum real solutions for K7 power flow networks through systematic computational search, identifying 192 nontrivial solutions complementing theoretical approaches.</p>
  </div>
</div>

</div>
</div>

<div class="project-section alt">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Citation">Citation</h2>

If you find this work useful, please consider citing our paper:

<div class="citation-box">
  <div class="citation-header">
    <span>BibTeX</span>
    <button class="bibtex-copy-btn" onclick="copyBibtex()"><span id="copy-text">Copy</span></button>
  </div>
  <pre id="bibtex-content">@article{zimmer2026agentic,
  title={The Agentic Researcher: A Practical Guide to AI-Assisted Research in Mathematics and Machine Learning},
  author={Max Zimmer and Nico Pelleriti and Christophe Roux and Sebastian Pokutta},
  journal={arXiv preprint arXiv:2603.15914},
  year={2026}
}</pre>
</div>

</div>
</div>
