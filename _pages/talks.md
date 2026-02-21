---
layout: blog
permalink: /talks/
title: talks & activities
description: talks, posters, events, and other activities.
nav: true
nav_order: 5
---

<div class="post">
  <div class="header-bar">
    <h1>talks</h1>
    <h2>{{ page.description }}</h2>
  </div>
</div>

<style>
.talks-section {
  margin-bottom: 2rem;
}
.talks-section-header {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--global-theme-color);
  padding-bottom: 0.3rem;
  border-bottom: 2px solid var(--global-theme-color);
  margin-bottom: 0.75rem;
}
.talks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.talks-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--global-divider-color);
}
.talks-list li:last-child {
  border-bottom: none;
}
.talk-date {
  font-size: 0.85rem;
  color: var(--global-text-color-light);
  margin-right: 0.5rem;
}
.talk-venue {
  font-weight: 600;
}
.talk-location {
  font-size: 0.85rem;
  color: var(--global-text-color-light);
}
.talk-details {
  margin-top: 0.15rem;
  font-size: 0.85rem;
}
.talk-links {
  font-size: 0.8rem;
}
.talk-links a {
  color: var(--global-theme-color);
  text-decoration: none;
}
.talk-links a:hover {
  text-decoration: underline;
}
.talk-sep {
  color: var(--global-text-color-light);
  padding: 0 0.15rem;
}
</style>

{% assign all_presentations = site.data.talks | sort: "date" | reverse %}
{% assign talks_only = "" | split: "" %}
{% assign posters_only = "" | split: "" %}
{% for activity in all_presentations %}
  {% if activity.presentation_type == "talk" %}
    {% assign talks_only = talks_only | push: activity %}
  {% else %}
    {% assign posters_only = posters_only | push: activity %}
  {% endif %}
{% endfor %}

{% if talks_only.size > 0 %}
<div class="talks-section">
  <h3 class="talks-section-header">talks</h3>
  <ul class="talks-list">
  {% for activity in talks_only %}
    <li>
      <span class="talk-date">{{ activity.date | date: "%m/%Y" }}</span>
      <span class="talk-venue">{{ activity.venue }}</span><span class="talk-location">, {{ activity.location }}</span>
      <div class="talk-details">
        <span class="talk-links">
          {% if activity.slides %}<a href="{{ activity.slides }}">slides</a>{% endif %}
          {% if activity.video %}{% if activity.slides %}<span class="talk-sep"> · </span>{% endif %}<a href="{{ activity.video }}">video</a>{% endif %}
        </span>
        {% if activity.slides or activity.video %}<span class="talk-sep"> · </span>{% endif %}
        {% if activity.link %}<em><a href="{{ activity.link }}">{{ activity.description }}</a></em>{% else %}<em>{{ activity.description }}</em>{% endif %}
      </div>
    </li>
  {% endfor %}
  </ul>
</div>
{% endif %}

{% if posters_only.size > 0 %}
<div class="talks-section">
  <h3 class="talks-section-header">posters</h3>
  <ul class="talks-list">
  {% for activity in posters_only %}
    <li>
      <span class="talk-date">{{ activity.date | date: "%m/%Y" }}</span>
      <span class="talk-venue">{{ activity.venue }}</span><span class="talk-location">, {{ activity.location }}</span>
      <div class="talk-details">
        <span class="talk-links">
          {% if activity.poster %}<a href="{{ activity.poster }}">poster</a>{% endif %}
          {% if activity.slides %}{% if activity.poster %}<span class="talk-sep"> · </span>{% endif %}<a href="{{ activity.slides }}">slides</a>{% endif %}
          {% if activity.video %}{% if activity.poster or activity.slides %}<span class="talk-sep"> · </span>{% endif %}<a href="{{ activity.video }}">video</a>{% endif %}
        </span>
        {% if activity.poster or activity.slides or activity.video %}<span class="talk-sep"> · </span>{% endif %}
        {% if activity.link %}<em><a href="{{ activity.link }}">{{ activity.description }}</a></em>{% else %}<em>{{ activity.description }}</em>{% endif %}
      </div>
    </li>
  {% endfor %}
  </ul>
</div>
{% endif %}

{% assign all_events = site.data.events | sort: "date" | reverse %}
{% if all_events.size > 0 %}
<div class="talks-section">
  <h3 class="talks-section-header">event participation</h3>
  <ul class="talks-list">
  {% for activity in all_events %}
    <li>
      <span class="talk-date">{{ activity.date | date: "%m/%Y" }}</span>
      {% if activity.link %}<a href="{{ activity.link }}" class="talk-venue">{{ activity.venue }}</a>{% else %}<span class="talk-venue">{{ activity.venue }}</span>{% endif %}<span class="talk-location">, {{ activity.location }}</span>
    </li>
  {% endfor %}
  </ul>
</div>
{% endif %}

{% assign reviewing_activities = site.data.other | sort: "date" | reverse %}
{% if reviewing_activities.size > 0 %}
<div class="talks-section">
  <h3 class="talks-section-header">reviewing</h3>
  <p class="reviewing-inline">{% for activity in reviewing_activities %}{{ activity.venue }}{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
</div>
{% endif %}
