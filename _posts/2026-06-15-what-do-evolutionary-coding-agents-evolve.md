---
layout: project-distill
title: "What Do Evolutionary Coding Agents Evolve?"
subtitle: "A closer look at what changes inside evolutionary code search runs."
date: 2026-06-15
permalink: /what-do-evolutionary-coding-agents-evolve/
description: "Our paper <b>What Do Evolutionary Coding Agents Evolve?</b> introduces EvoTrace, a dataset of 121 evolutionary code-search runs, and EvoReplay, a tool for inspecting and rerunning parts of those runs. The goal is to tell whether better scores come from new program structure, constant tuning, context changes, overfitting, or repeated code churn."
tags: [deep-learning, agentic-ai]
keywords: "evolutionary coding agents, language models, code search, EvoTrace, EvoReplay, evolutionary search, agentic AI"
og_image: "https://maxzimmer.org/assets/img/blog_img/evotrace/main_figure.png"
publication_type: "Preprint"
paper_url: "https://arxiv.org/abs/2605.20086"
code_url: "https://github.com/ZIB-IOL/EvoReplay"
paper_custom: "Dataset|https://huggingface.co/datasets/ZIB-IOL/EvoTrace"
project: true
giscus_comments: false
related_posts: false
authors:
  - name: Nico Pelleriti
    affiliations:
      name: Zuse Institute Berlin
  - name: Sree Harsha Nelaturu
    affiliations:
      name: Zuse Institute Berlin
  - name: Zhanke Zhou
    affiliations:
      name: Hong Kong Baptist University
  - name: Zongze Li
    affiliations:
      name: Hong Kong Baptist University
  - name: Max Zimmer
    affiliations:
      name: Zuse Institute Berlin
  - name: Bo Han
    affiliations:
      name: Hong Kong Baptist University and RIKEN AIP
  - name: Sebastian Pokutta
    affiliations:
      name: Zuse Institute Berlin
_styles: |
  .metric-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  .metric-card {
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
    padding: 1rem;
    background: var(--global-card-bg-color);
  }
  .metric-card strong {
    display: block;
    font-family: var(--global-font-sans);
    color: var(--global-theme-color);
    font-size: 1.45rem;
    line-height: 1;
    margin-bottom: 0.35rem;
  }
  .metric-card span {
    display: block;
    font-family: var(--global-font-sans);
    color: var(--global-text-color-light);
    font-size: 0.78rem;
    line-height: 1.35;
  }
  .result-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin: 1.5rem 0 2rem;
  }
  .result-list .project-card {
    padding: 1.25rem;
  }
  .method-flow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.9rem;
    margin: 1.5rem 0;
  }
  .method-flow .project-card {
    padding: 1rem;
  }
  .method-flow .step-label {
    display: inline-block;
    font-family: var(--global-font-sans);
    color: var(--global-theme-color);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.35rem;
  }
  @media (max-width: 768px) {
    .metric-strip,
    .result-list,
    .method-flow {
      grid-template-columns: 1fr;
    }
  }
---

<div class="hero-image-wrap">
  <img src="/assets/img/blog_img/evotrace/edit_taxonomy.png" alt="Taxonomy of code edits performed by evolutionary coding agents" data-zoomable>
  <p class="figure-caption">Nine recurring edit types found in EvoTrace. The paper asks which edits actually help, and when a better final score hides a weaker story.</p>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Question">The Question</h2>

Evolutionary coding agents keep a population of candidate programs, ask a language model to modify them, run the changed code, and keep the versions that score well. This setup has produced strong results in mathematical discovery and algorithm design, but the usual headline is still just one number: the best score reached by a run.

That score alone does not tell us what happened. A run might discover a new algorithm, tune constants in an existing one, reuse an idea that was already in the prompt context, overfit to the evaluator, or repeatedly add back code it had already deleted. This paper studies the run itself: every program, prompt, score, parent-child link, and evaluator output.

<div class="metric-strip reveal">
  <div class="metric-card">
    <strong>121</strong>
    <span>evolutionary coding-search runs</span>
  </div>
  <div class="metric-card">
    <strong>16</strong>
    <span>math and algorithm-design tasks</span>
  </div>
  <div class="metric-card">
    <strong>10,672</strong>
    <span>unique generated programs</span>
  </div>
  <div class="metric-card">
    <strong>18,400</strong>
    <span>language-model calls with trace metadata</span>
  </div>
</div>

</div>
</div>

<div class="project-section alt">
<div class="project-section-inner" markdown="1">

<h2 data-nav="EvoTrace">EvoTrace</h2>

EvoTrace is a dataset of structured search traces from evolutionary coding systems that use language models. It covers 121 runs across four frameworks, five generator models, and 16 tasks: six Python mathematical-discovery tasks and ten C++ competitive programming problems from ALE-bench Lite.

Instead of saving only final scores, each trace saves what is needed to inspect and rerun the search: full program source, parent-child graph, prompts and context, evaluator outputs, execution logs, scores, and environment metadata.

<div class="project-grid cols-2 reveal">
  <div class="project-card">
    <h4 class="highlight-text">Math Discovery</h4>
    <p>Tasks include circle packing, Heilbronn placement, autocorrelation, uncertainty inequalities, and signal-processing objectives. These runs make it easier to separate new code structure from constant tuning.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Algorithm Design</h4>
    <p>ALE-bench tasks use an external judge and private test cases. This exposes cases where public best-so-far scores do not hold up on the private evaluation.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Multiple Frameworks</h4>
    <p>OpenEvolve, GEPA, EvoX, and ShinkaEvolve are normalized into a shared schema despite different selection, diversity, prompting, and routing strategies.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Replayable Artifacts</h4>
    <p>Full source and evaluator metadata are preserved, so candidates can be re-evaluated, simplified, replayed from the same prompt, tested with another model, or retuned.</p>
  </div>
</div>

</div>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="EvoReplay">EvoReplay</h2>

EvoReplay is the tool built on top of EvoTrace. It lets us pick a point in a saved run, rebuild the local search state around it, and then rerun, simplify, retune, or rejudge the candidate program.

<div class="figure-container reveal">
  <img src="/assets/img/blog_img/evotrace/main_figure.png" alt="Overview of EvoTrace and EvoReplay" style="max-width: 100%; border-radius: 8px;" data-zoomable>
  <p class="figure-caption" style="text-align: center; font-size: 0.85rem; color: var(--global-text-color-light); margin-top: 0.5rem;">EvoTrace records programs, graphs, prompts, scores, and metadata. EvoReplay uses those records for replay, retuning, static analysis, cycling detection, repair, context replay, and model substitution.</p>
</div>

<div class="method-flow reveal">
  <div class="project-card">
    <span class="step-label">Analyze</span>
    <h4>Read the edits</h4>
    <p>Convert backend-specific traces into one parent-child edit table with scores, prompts, and diffs.</p>
  </div>
  <div class="project-card">
    <span class="step-label">Intervene</span>
    <h4>Rerun the state</h4>
    <p>Rerun prompts, substitute models or contexts, repair candidates, and ablate program components.</p>
  </div>
  <div class="project-card">
    <span class="step-label">Compare</span>
    <h4>Check constant tuning</h4>
    <p>Retune exposed constants in a fixed program and compare that result with the evolutionary run.</p>
  </div>
</div>

</div>
</div>

<div class="project-section alt">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Edit Types">Which Edits Matter?</h2>

Every parent-child edit is labeled with one or more of nine edit types. The paper uses a language-model judge for this, then checks it against blind human re-annotation on a stratified sample of 200 edits.

The edits that happen most often are not the edits that help most often. Hyperparameter tuning is the most common label, but external dependencies, efficiency improvements, and architectural changes have the strongest per-edit odds of improving the score.

<div class="project-grid cols-2 reveal">
  <div class="figure-card">
    <img src="/assets/img/blog_img/evotrace/edit_label_prevalence.png" alt="Prevalence of edit labels in EvoTrace" data-zoomable>
    <p class="figure-caption">The search spends much of its effort on hyperparameter tuning and local refinement.</p>
  </div>
  <div class="figure-card">
    <img src="/assets/img/blog_img/evotrace/edit_helpfulness_odds_ratio.png" alt="Helpfulness odds ratio of edit labels in EvoTrace" data-zoomable>
    <p class="figure-caption">External dependencies, efficiency improvements, and architectural changes help most often per edit.</p>
  </div>
</div>

<div class="figure-card reveal">
  <img src="/assets/img/blog_img/evotrace/edit_enrichment_best_so_far.png" alt="Best-so-far enrichment by edit label" data-zoomable>
  <p class="figure-caption">Best-so-far updates are enriched for the edit types that help, rather than simply matching the all-edits base rate.</p>
</div>

</div>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Findings">Main Findings</h2>

Looking at the full trace changes how we read the final score. Several improvements are real, but the same score increase can come from different causes.

<div class="result-list reveal">
  <div class="project-card">
    <h4 class="highlight-text">Rare edits drive many gains</h4>
    <p>External dependencies, efficiency improvements, and architectural changes help more often than their raw frequency would suggest.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Cycling is systematic</h4>
    <p>Across all 121 runs, about 30% of added code lines are byte-identical lines that were previously deleted in the same lineage. The cycling rate grows over the run in 118 of 121 cases.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Replays work, exact copies do not</h4>
    <p>Across 36 breakthrough events, same-prompt replays have median parse success 1.00 and evaluator success 1.00, but median exact-match rate 0.00. They still recover a median 0.76 of the original score.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Tuning explains many late wins</h4>
    <p>A 24-call Bayesian-optimization pass over constants improves 22 of 36 probed intermediate programs. It matches or exceeds the run's final best on 13 of 15 intermediate programs.</p>
  </div>
  <div class="project-card">
    <h4 class="highlight-text">Public scores can mislead</h4>
    <p>On ALE-bench, the private-test check covers 30 run/problem pairs. Two of the four frameworks overfit on at least 30% of the problems they were scored on.</p>
  </div>
</div>

<div class="figure-card reveal">
  <img src="/assets/img/blog_img/evotrace/loc_hparam.png" alt="Program size and numeric-literal count over evolutionary runs" data-zoomable>
  <p class="figure-caption">Math runs tend to accumulate modest program-size and numeric-literal growth, while ALE runs refine already-large seeds at roughly constant size.</p>
</div>

</div>
</div>

<div class="project-section alt">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Takeaway">Takeaway</h2>

Evolutionary coding agents should not be judged only by the best score they reach. The same final number can mean a new algorithm, a better constant setting, overfitting to public feedback, repeated code churn, or an old idea resurfacing from the prompt context.

EvoTrace and EvoReplay make those cases measurable. They let us ask whether a run found a new idea, whether the same prompt reliably gives a similar result, whether simple retuning would have matched it, and how much search budget is spent bringing old code back.

</div>
</div>

<div class="project-section">
<div class="project-section-inner" markdown="1">

<h2 data-nav="Citation">Citation</h2>

If you find this work useful, please consider citing our paper:

<div class="citation-box">
  <div class="citation-header">
    <span>BibTeX</span>
    <button class="bibtex-copy-btn" onclick="copyBibtex()"><span id="copy-text">Copy</span></button>
  </div>
  <pre id="bibtex-content">@article{pelleriti2026what,
  title={What Do Evolutionary Coding Agents Evolve?},
  author={Nico Pelleriti and Sree Harsha Nelaturu and Zhanke Zhou and Zongze Li and Max Zimmer and Bo Han and Sebastian Pokutta},
  journal={arXiv preprint arXiv:2605.20086},
  year={2026}
}</pre>
</div>

</div>
</div>
