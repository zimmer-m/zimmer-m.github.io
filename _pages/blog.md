---
layout: blog
title: blog
permalink: /blog/
nav: true
nav_order: 6
---

<div class="post">
  <div class="header-bar" style="padding: 2rem; text-align: center;">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>

</div>

<!--<div class="alert alert-info" role="alert">
  <i class="fas fa-tools"></i> Work in progress - blog posts coming soon!
</div>-->
<br>
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