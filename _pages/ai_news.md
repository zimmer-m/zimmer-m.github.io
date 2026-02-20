---
layout: blog
title: "ai news & links"
description: "a collection of interesting links, essays, and AI news."
permalink: /ai_news/
classes: wide
nav: true
nav_order: 7

---

<div class="post">
  <div class="header-bar" style="padding: 2rem; text-align: center;">
    <h1>{{ page.title }}</h1>
    <h2>{{ page.description }}</h2>
  </div>
<br>
</div>

### some essays & articles I find worth reading

<style>
  .links-section {
    margin-bottom: 1.5rem;
  }
  .links-category {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--global-theme-color);
    padding-bottom: 0.3rem;
    margin-bottom: 0;
    border-bottom: 2px solid var(--global-theme-color);
  }
  .links-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem 0;
  }
  .links-list li {
    border-bottom: 1px solid var(--global-divider-color);
  }
  .links-list li:last-child {
    border-bottom: none;
  }
  .link-entry {
    display: flex;
    align-items: baseline;
    padding: 0.35rem 0;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  .link-entry-main {
    flex: 1;
    min-width: 0;
  }
  .link-hint {
    color: var(--global-text-color-light);
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 0.5rem;
    opacity: 0.5;
    transition: opacity 0.2s ease, color 0.2s ease;
    user-select: none;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }
  .link-hint:hover {
    opacity: 1;
    color: var(--global-theme-color);
  }
  .link-hint .link-arrow {
    display: inline-block;
    font-size: 0.65rem;
    margin-right: 0.2rem;
    transition: transform 0.2s ease;
  }
  .link-hint.open .link-arrow {
    transform: rotate(90deg);
  }
  .link-desc {
    display: none;
    padding: 0.1rem 0 0.35rem 0;
    font-size: 0.85rem;
    color: var(--global-text-color-light);
    line-height: 1.45;
  }
  .link-desc.open {
    display: block;
  }
</style>

{%- assign sorted_links = site.data.links | sort: "year" | reverse -%}
{%- assign categories = sorted_links | map: "category" | uniq -%}
{%- for cat in categories %}
<div class="links-section">
  <div class="links-category">{{ cat }}</div>
  <ul class="links-list">
    {%- for link in sorted_links -%}
      {%- if link.category == cat %}
    <li>
      <div class="link-entry">
        <span class="link-entry-main">
          <a href="{{ link.url }}">{{ link.title }}</a> — {{ link.author }}, {{ link.year }}
        </span>
        {%- if link.description and link.description != "" %}
        <button class="link-hint" onclick="var d=this.closest('li').querySelector('.link-desc'); d.classList.toggle('open'); this.classList.toggle('open'); this.querySelector('.link-label').textContent=d.classList.contains('open')?'hide description':'show description';"><span class="link-arrow">&#9654;</span><span class="link-label">show description</span></button>
        {%- endif %}
      </div>
      {%- if link.description and link.description != "" %}
      <div class="link-desc">{{ link.description }}</div>
      {%- endif %}
    </li>
      {%- endif -%}
    {%- endfor %}
  </ul>
</div>
{%- endfor %}

---

### ai news

Recent news and discussions about AI and deep learning, using a shared database with [Sebastian](https://pokutta.com) — feel free to contribute using your GitHub account.

{% assign supabase_url = "https://ldpqceoagkefnncounck.supabase.co" %}
{% assign supabase_anon_key = "sb_publishable_-9sEz0wbkhOus1iNeRaGYg_tenlDdmC" %}

{% include AN_news.html supabase_url=supabase_url supabase_anon_key=supabase_anon_key %}
