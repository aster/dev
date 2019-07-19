---
layout: default
title: oh! my jk
---

# Welcome to my jk home page!

<ul>
{% for post in site.posts %}
    <li>
        <a href="{{post.url}}">{{post.date | date_to_long_string}} : {{post.title}}
    </a>
    <p>{{post.excerpt}}</p>
    </li>
{% endfor %}

</ul>
