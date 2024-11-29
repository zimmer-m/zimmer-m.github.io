---
layout: page
permalink: /publications/
title: publications
description: List of all my publications.
nav: true
nav_order: 1
---

<div class="publication-tags">
  <h2>Filter by tag</h2>
  <a href="#" class="btn btn-sm z-depth-0 active" role="button" data-tag="all">All</a>
  {% assign tags = site.data.publication_tags %}
  {% for tag in tags %}
    <a href="#{{ tag.tag }}" class="btn btn-sm z-depth-0" role="button" data-tag="{{ tag.tag }}">{{ tag.name }}</a>
  {% endfor %}
</div>

<div class="publications">
{% bibliography -f papers %}
</div>
