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

  <section class="teaching-experience" aria-labelledby="teaching-experience-heading">
    <h2 id="teaching-experience-heading">Assistant teaching experience</h2>
    <ul>
      <li>
        <span class="teaching-experience-date">2026</span>
        <div>
          <h3>Discrete Optimization and Machine Learning seminar</h3>
          <p>Student supervision · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2025</span>
        <div>
          <h3>Discrete Optimization and Machine Learning seminar</h3>
          <p>Student supervision · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2024</span>
        <div>
          <h3>Discrete Optimization and Machine Learning seminar</h3>
          <p>Student supervision · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2023</span>
        <div>
          <h3>Discrete Optimization and Machine Learning seminar</h3>
          <p>Student supervision · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2023</span>
        <div>
          <h3>Analysis I und Lineare Algebra für Ingenieurwissenschaften</h3>
          <p>Substitute lecture · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2022</span>
        <div>
          <h3>Discrete Optimization and Machine Learning seminar</h3>
          <p>Student supervision · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2021</span>
        <div>
          <h3>Discrete Optimization and Machine Learning seminar</h3>
          <p>Student supervision · TU Berlin</p>
        </div>
      </li>
      <li>
        <span class="teaching-experience-date">2020</span>
        <div>
          <h3>Robust Machine Learning</h3>
          <p>Tutorial · Combinatorial Optimization at Work (CO@Work) Workshop · Zuse Institute Berlin</p>
        </div>
      </li>
    </ul>
  </section>
</div>
