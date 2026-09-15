---
layout: page
title: teaching
permalink: /teaching/
nav: true
nav_order: 5
---

<div class="teaching-index">
  {% assign courses = site.pages | where: "layout", "course" | sort: "year" | reverse %}
  {% for course in courses %}
  <article class="teaching-course">
    <div class="teaching-meta">
      <span>{{ course.semester | default: course.year | escape }}</span>
      <span>{{ course.institution | escape }}</span>
    </div>
    <div class="teaching-course-body">
      <h2><a href="{{ course.url | relative_url }}">{{ course.title | escape }}</a></h2>
      {% if course.banner != blank %}
      {% include figure.html path=course.banner class="teaching-banner" alt=course.banner_alt width=course.banner_width height=course.banner_height loading="lazy" %}
      {% endif %}
      {% if course.summary != blank %}<p class="teaching-summary">{{ course.summary | escape }}</p>{% endif %}
      <a class="teaching-course-link" href="{{ course.url | relative_url }}">Course information and lectures <span aria-hidden="true">→</span></a>
    </div>
  </article>
  {% endfor %}
</div>
