---
layout: page
title: duberste.in
tagline: Projects and musings at the intersection of computer science and social science
image: 
---
{% include JB/setup %}

## About me
I'm Andrew, a software engineer at [Uber](https://www.uber.com/) in San Francisco, California.
In college, I [presented]({{site.url}}/assets/poster1.pdf) [twice]({{site.url}}/assets/poster2.pdf) in Seattle and St. Louis for the [Society of Judgment and Decision-Making](http://www.sjdm.org/). 
I [program](http://www.github.com/ajduberstein) early and often.

## Blog

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

