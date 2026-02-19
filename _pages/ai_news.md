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

- [Brain Time](https://www.edge.org/conversation/brain-time) — David M. Eagleman
- [The Tail End](https://waitbutwhy.com/2015/12/the-tail-end.html) — Tim Urban
- [Laws of Tech: Commoditize Your Complement](https://gwern.net/complement) — Gwern
- [Musings on typicality](https://sander.ai/2020/09/01/typicality.html) — Sander Dieleman

---

### ai news

Recent news and discussions about AI and deep learning, using a shared database with [Sebastian](https://pokutta.com) — feel free to contribute using your GitHub account.

{% assign supabase_url = "https://ldpqceoagkefnncounck.supabase.co" %}
{% assign supabase_anon_key = "sb_publishable_-9sEz0wbkhOus1iNeRaGYg_tenlDdmC" %}

{% include AN_news.html supabase_url=supabase_url supabase_anon_key=supabase_anon_key %}
