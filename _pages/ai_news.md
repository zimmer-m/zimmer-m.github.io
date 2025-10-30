---
layout: blog
title: "AI news"
description: "recent news and discussions about AI and deep learning, using a shared database with <a href='https://pokutta.com'>Sebastian</a> - feel free to contribute using your github account."
permalink: /discussion/
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




{% assign supabase_url = "https://ldpqceoagkefnncounck.supabase.co" %}
{% assign supabase_anon_key = "sb_publishable_-9sEz0wbkhOus1iNeRaGYg_tenlDdmC" %}

{% include AN_news.html supabase_url=supabase_url supabase_anon_key=supabase_anon_key %}