---
layout: page
title: blog
permalink: /blog/
description: Research summaries and paper TLDRs in deep learning, mathematics, and other topics.
nav: true
nav_order: 6
---

<div class="alert alert-info" role="alert">
  <i class="fas fa-tools"></i> Work in progress - blog posts coming soon!
</div>

<div class="post-list">
  {% for post in site.posts %}
  <div class="post-preview">
    <h2 class="post-title">
      <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </h2>
    <p class="post-meta">{{ post.date | date: '%B %-d, %Y' }}</p>
    <p class="post-description">{{ post.description }}</p>
  </div>
  {% endfor %}
</div> 