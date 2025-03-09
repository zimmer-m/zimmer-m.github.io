---
layout: page
permalink: /talks/
title: talks & activities
description: talks, posters, events, and other activities.
nav: true
nav_order: 5
---
{% assign all_presentations = site.activities | where: "type", "presentation" | sort: "date" | reverse %}
{% if all_presentations.size > 0 %}
### talks and posters
{% for activity in all_presentations %}
* {{ activity.date | date: "%m/%Y" }} • **{{ activity.venue }}**, {{ activity.location }}  
  {% if activity.presentation_type == "talk" %}Invited Talk{% else %}Poster{% endif %}{% if activity.slides %} • [[slides]]({{ activity.slides }}){% endif %}{% if activity.poster %} • [[poster]]({{ activity.poster }}){% endif %} • *{{ activity.description }}*

{% endfor %}
{% endif %}

{% assign all_events = site.activities | where: "type", "event" | sort: "date" | reverse %}
{% if all_events.size > 0 %}
### event participation
{% for activity in all_events %}
* {{ activity.date | date: "%m/%Y" }} • {% if activity.link %}**[{{ activity.venue }}]({{ activity.link }})**{% else %}**{{ activity.venue }}**{% endif %}, {{ activity.location }}
{% endfor %}
{% endif %}

{% assign reviewing_activities = site.activities | where: "type", "reviewing" | sort: "date" | reverse %}
{% if reviewing_activities.size > 0 %}
### other activities
{% for activity in reviewing_activities %}
* {{ activity.date | date: "%m/%Y" }} • **{{ activity.venue }}**
{% endfor %}
{% endif %}
