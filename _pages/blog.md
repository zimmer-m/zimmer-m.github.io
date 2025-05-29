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
<br>
</div>


{% assign series_posts = site.posts | where_exp: "item", "item.series_title" %}
{% if series_posts.size > 0 %}
<h2>Post Series</h2>
<div class="series-list-container">
  <div class="series-list">
    {% for post in series_posts %}
      <a href="{{ post.url | prepend: site.baseurl }}" class="series-box">
        <div class="series-title">{{ post.series_title }}</div>
      </a>
    {% endfor %}
  </div>
</div>

{% endif %}

<hr class="solid">

<div class="posts-container">
  <h2>Recent Posts</h2>
  <div class="post-list">
    {% for post in site.posts %}
    {% if post.hidden != true %}
    <div class="post-preview">
      <h2 class="post-title">
        <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
      </h2>
      <p class="post-meta">
        {{ post.date | date: '%B %-d, %Y' }} • 
        {% assign words = post.content | number_of_words %}
        {% assign read_time = words | divided_by: 180 | plus: 1 %}
        {{ read_time }} min read
        {% if post.tags %}
          • 
          {% for tag in post.tags %}
            <a class="tag" href="{{ '/blog/tag/' | prepend: site.baseurl }}{{ tag }}">{{ tag }}</a>
          {% endfor %}
        {% endif %}
      </p>
      <p class="post-description">{{ post.description }}</p>
    </div>
    {% endif %}
    {% endfor %}
  </div>
</div> 