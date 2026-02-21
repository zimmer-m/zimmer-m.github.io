---
layout: blog
permalink: /publications/
title: publications
description: list of all my publications - you can filter by tag.
nav: true
nav_order: 1
---

<div class="post">
  <div class="header-bar">
    <h1>{{ page.title }}</h1>
    <h2>{{ page.description }}</h2>
  </div>
</div>

<div class="publication-tags">
  <a href="#" class="btn btn-sm active" role="button" data-tag="all">All</a>
  {% assign tags = site.data.publication_tags %}
  {% for tag in tags %}
    <a href="#{{ tag.tag }}" class="btn btn-sm" role="button" data-tag="{{ tag.tag }}">{{ tag.name }}</a>
  {% endfor %}
</div>

<div class="publications">
{% bibliography -f papers %}
</div>
