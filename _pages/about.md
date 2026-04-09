---
layout: about
title: about
permalink: /
subtitle: |+
  <div class="about-callout about-callout-role">
  <b>DL Research Lead</b> at the <a href="https://iol.zib.de/learn">IOL Lab</a> of <a href="https://www.zib.de/">Zuse Institute Berlin</a><br>
  <b>PhD candidate in Mathematics</b> at <a href="https://www.tu.berlin/en/math">TU Berlin</a><br>
  <b>Advisor:</b> <a href="http://www.pokutta.com/">Prof. Dr. Sebastian Pokutta</a>
  </div>
  <div class="about-callout about-callout-hiring"><b>We are hiring!</b> We are seeking motivated PhD students to work on Deep Learning. Reach out or directly apply <a href="http://iol.zib.de/openings">here</a>.</div>

profile:
  align: left
  image: prof_pic.png
  image_circular: false # crops the image to make it circular
  address: 

news: true  # includes a list of news items
selected_papers: true # includes a list of papers marked as "selected={true}"
social: true  # includes social icons at the bottom of the page
---


<h3 class="section-header">Research</h3>

My research focuses on the <a href="/#efficiency" class="tag-link">Efficiency</a> of neural networks — from weight sparsity and quantization to KV cache compression and speculative decoding — on <a href="/#ai4math" class="tag-link">AI4Math</a>, and on <a href="/#agentic-ai" class="tag-link">Agentic AI</a>. I also work on <a href="/#optimization" class="tag-link">Optimization</a>, applying Deep Learning to <a href="/#sustainability" class="tag-link">sustainability challenges</a> (e.g., forest monitoring), and more recently the post-training paradigm. At ZIB, I lead the [iol.LEARN](https://iol.zib.de/research/iol-learn.html) Deep Learning group. Please take a look at my <a href="/#all" class="tag-link">list of publications</a> and feel free to reach out for questions or potential collaborations! You can find TLDRs of some of my papers on my [blog](/blog) and a collection of interesting links and AI news [here](/ai_news).

<style>
.pub-tiles-wrap { margin: 0.8rem 0 1.4rem 0; }
.pub-tiles-header { display: flex; align-items: baseline; gap: 0.8rem; margin-bottom: 0.6rem; }
.pub-tiles-label { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--global-text-color-light); }
.pub-tiles-all { font-size: 0.78rem; color: var(--global-theme-color); text-decoration: none; }
.pub-tiles-all:hover { text-decoration: underline; }
.pub-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
@media (max-width: 480px) { .pub-tiles { grid-template-columns: 1fr; } }
.pub-tile { border: 1px solid var(--global-divider-color); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; transition: box-shadow 0.15s ease; }
.pub-tile:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.pub-tile-img { width: 100%; height: 150px; object-fit: cover; display: block; background: var(--global-bg-color); }
.pub-tile-body { padding: 0.5rem 0.6rem 0.55rem; display: grid; grid-template-rows: auto 1fr auto auto; gap: 0.25rem; flex: 1; }
.pub-tile-tag { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--global-theme-color); }
.pub-tile-title { font-size: 0.82rem; line-height: 1.35; font-weight: 500; align-self: start; }
.pub-tile-title a { color: var(--global-text-color); text-decoration: none; }
.pub-tile-title a:hover { color: var(--global-theme-color); }
.pub-tile-venue { font-size: 0.75rem; color: var(--global-text-color-light); }
.pub-tile-buttons { display: flex; flex-wrap: wrap; gap: 0.3rem; padding-top: 0.15rem; }
.pub-tile-btn { font-size: 0.7rem; font-weight: 500; padding: 0.15rem 0.45rem; border: 1px solid var(--global-divider-color); border-radius: 3px; color: var(--global-text-color-light); text-decoration: none; transition: border-color 0.15s, color 0.15s; }
.pub-tile-btn:hover { border-color: var(--global-theme-color); color: var(--global-theme-color); text-decoration: none; }
</style>

<div class="pub-tiles-wrap">
  <div class="pub-tiles-header">
    <span class="pub-tiles-label">Highlighted recent publications</span>
    <a class="pub-tiles-all" href="/#all">view all →</a>
  </div>
  <div class="pub-tiles">
    {%- for paper in site.data.highlighted_papers %}
    <div class="pub-tile">
      <img class="pub-tile-img" src="/assets/img/publication_preview/{{ paper.preview }}" alt="{{ paper.title }}">
      <div class="pub-tile-body">
        <div class="pub-tile-tag"><a href="/#{{ paper.tag_id }}" class="tag-link" style="font-size:inherit;padding:0;">{{ paper.tag }}</a></div>
        <div class="pub-tile-title"><a href="{{ paper.pdf }}">{{ paper.title }}</a></div>
        <div class="pub-tile-venue">{{ paper.venue }}</div>
        <div class="pub-tile-buttons">
          {%- if paper.pdf %}<a class="pub-tile-btn" href="{{ paper.pdf }}">PDF</a>{%- endif %}
          {%- if paper.code %}<a class="pub-tile-btn" href="{{ paper.code }}">Code</a>{%- endif %}
          {%- if paper.blog %}<a class="pub-tile-btn" href="{{ paper.blog }}">Blog</a>{%- endif %}
        </div>
      </div>
    </div>
    {%- endfor %}
  </div>
</div>

<h3 class="section-header">Previously</h3>

I studied Mathematics at TU Berlin (BSc 2017, MSc 2021), with a semester abroad at the Università di Bologna. During my studies, I worked on combinatorial optimization with Leon Sering at the [COGA Group](https://www3.math.tu-berlin.de/coga/) and interned in the research groups of Prof. Sergio de Rosa at [Università degli Studi di Napoli Federico II](https://www.pastalab.unina.it/) and Prof. Marco Mondelli at [IST Austria](https://ist.ac.at/en/research/mondelli-group/). I joined the [IOL Lab](https://iol.zib.de) in 2020 as a student researcher, became a doctoral researcher in 2021, and have led the Deep Learning research group since 2024. I am also a member of the [Berlin Mathematical School](https://www.math-berlin.de) and the [MATH+ Cluster of Excellence](https://mathplus.de/). You can [find my full CV here](/cv).
