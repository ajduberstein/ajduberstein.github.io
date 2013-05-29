---
layout: page
title: Posts
tagline: Data science, social science, computer science
---
{% include JB/setup %}

## About me
I'm a data analyst at [dunnhumby](http://dunnhumby.com) and a 2013 college graduate in Cincinnati, Ohio.

If you're interested, you can find out more about me from any of the following locations:
<ul>
<li> <a href="http://www.github.com/ajduberstein"> GitHub</a> </li>
<li> <a href="http://www.twitter.com/ajdstein"> Twitter</a> </li>
<li> <a href="http://www.linkedin.com/pub/andrew-duberstein/37/330/896">LinkedIn</a> </li>
</ul>

## Blog

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

