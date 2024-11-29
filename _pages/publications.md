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
  {% assign tags = site.data.publication_tags %}
  {% for tag in tags %}
    <a href="{{ '/publications/tag/' | relative_url }}{{ tag.tag }}" class="btn btn-sm z-depth-0" role="button">{{ tag.name }}</a>
  {% endfor %}
</div>

<div class="publications">
{% bibliography -f papers %}
</div>
