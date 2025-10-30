---
layout: blog
permalink: /talks/
title: talks & activities
description: talks, posters, events, and other activities.
nav: true
nav_order: 5
---

<div class="post">
  <div class="header-bar" style="padding: 2rem; text-align: center;">
    <h1>{{ page.title }}</h1>
    <h2>{{ page.description }}</h2>
  </div>
<br>
</div>

{% assign all_presentations = site.activities_talks | sort: "date" | reverse %}
{% if all_presentations.size > 0 %}
### talks and posters
{% for activity in all_presentations %}
* {{ activity.date | date: "%m/%Y" }} • **{{ activity.venue }}**, {{ activity.location }}  
  {% if activity.presentation_type == "talk" %}Invited Talk{% else %}Poster{% endif %}{% if activity.slides %} • [[slides]]({{ activity.slides }}){% endif %}{% if activity.poster %} • [[poster]]({{ activity.poster }}){% endif %}{% if activity.video %} • [[video]]({{ activity.video }}){% endif %} • {% if activity.link %}*<a href="{{ activity.link }}">{{ activity.description }}</a>*{% else %}*{{ activity.description }}*{% endif %}

{% endfor %}
{% endif %}

{% assign all_events = site.activities_events | sort: "date" | reverse %}
{% if all_events.size > 0 %}
### event participation
{% for activity in all_events %}
* {{ activity.date | date: "%m/%Y" }} • {% if activity.link %}**[{{ activity.venue }}]({{ activity.link }})**{% else %}**{{ activity.venue }}**{% endif %}, {{ activity.location }}
{% endfor %}
{% endif %}

{% assign reviewing_activities = site.activities_other | sort: "date" | reverse %}
{% if reviewing_activities.size > 0 %}
### reviewing
{% for activity in reviewing_activities %}
* **{{ activity.venue }}**
{% endfor %}
{% endif %}
