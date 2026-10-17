---
layout: blog
title: blog
seo_title: Research Blog
seo_description: Notes on papers and research projects.
schema_type: CollectionPage
permalink: /blog/
nav: true
nav_order: 6
---

<div class="sx-page sx-bloglist">

  <header class="sx-head">
    <div class="sx-eyebrow"><b>Blog</b><span>{{ site.posts | where_exp: "item", "item.hidden != true" | size }} posts</span></div>
    <h1>{{ site.blog_name | capitalize }}</h1>
    <p class="sx-lede">{{ site.blog_description | slice: 0 | upcase }}{{ site.blog_description | slice: 1, 500 }}</p>
  </header>

{% capture series_cards %}
  {%- for entry in site.data.series -%}
    {%- assign series_key = entry[0] -%}
    {%- assign series = entry[1] -%}
    {%- assign series_docs = site.documents | where: "series", series_key -%}
    {%- assign series_first = nil -%}
    {%- assign series_written = 0 -%}
    {%- for ch in series.chapters -%}
      {%- assign doc = series_docs | where: "chapter", ch.code | first -%}
      {%- if doc and ch.status != "planned" -%}
        {%- assign series_written = series_written | plus: 1 -%}
        {%- unless series_first -%}{%- assign series_first = doc -%}{%- endunless -%}
      {%- endif -%}
    {%- endfor -%}
    {%- if series_first %}
    <article class="sx-seriescard">
      <a class="sx-seriescard-head" href="{{ series.url | default: series_first.url | relative_url }}">
        <small>{{ series.kicker | default: "A series" }} · {{ series_written }} of {{ series.chapters | size }}</small>
        <strong>{{ series.title | escape }}</strong>
      </a>
      <ol>
        {%- for ch in series.chapters -%}
          {%- assign doc = series_docs | where: "chapter", ch.code | first -%}
          {%- if doc and ch.status != "planned" %}
        <li><a href="{{ doc.url | relative_url }}"><span class="sx-code">{{ ch.code }}</span><span>{{ ch.title | escape }}</span></a></li>
          {%- else %}
        <li class="is-planned"><span><span class="sx-code">{{ ch.code }}</span><span>{{ ch.title | escape }}<span class="sx-soon">soon</span></span></span></li>
          {%- endif -%}
        {%- endfor %}
      </ol>
    </article>
    {%- endif -%}
  {%- endfor -%}
{% endcapture %}
{% assign series_cards = series_cards | strip %}
{% if series_cards != "" %}
  <section class="sx-listsec" aria-labelledby="series-heading">
    <h2 id="series-heading" class="sx-listlabel">Series</h2>
    <div class="sx-seriesgrid">
      {{ series_cards }}
    </div>
  </section>
{% endif %}

  <section class="sx-listsec" aria-labelledby="posts-heading">
    <h2 id="posts-heading" class="sx-listlabel">All posts</h2>
    <ol class="sx-postlist">
      {%- for post in site.posts -%}
      {%- if post.hidden != true -%}
        {%- assign words = post.content | number_of_words -%}
        {%- assign read_time = words | divided_by: 180 | plus: 1 -%}
        {%- assign post_series = site.data.series[post.series] %}
      <li>
        <div class="sx-eyebrow">
          {%- if post.publication_type %}<b>{{ post.publication_type | escape }}</b>{% endif %}
          <span>{{ post.date | date: "%B %-d, %Y" }}</span>
          <span>{{ read_time }} min read</span>
          {%- if post_series and post_series.chapters.size > 1 -%}
            {%- for ch in post_series.chapters -%}
              {%- if ch.code == post.chapter %}<span>{{ post_series.title | escape }} · part {{ forloop.index }}</span>{% endif -%}
            {%- endfor -%}
          {%- endif %}
        </div>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.subtitle | default: post.description }}</p>
        {%- if post.tags.size > 0 %}
        <ul class="sx-chips">
          {%- for tag in post.tags %}<li><a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a></li>{% endfor %}
        </ul>
        {%- endif %}
      </li>
      {%- endif -%}
      {%- endfor %}
    </ol>
  </section>
</div>
