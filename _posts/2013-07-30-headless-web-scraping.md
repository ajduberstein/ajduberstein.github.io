---
layout: page 
title : Headless Web-scraping with PhantomJS and GhostDriver 
category : Tools of the Trade
tagline: Setup for Mac OS X and an Ubuntu VM on Windows 7
image: http://phantomjs.org/images/phantomjs-logo.png
tags : [ web-crawling, phantomjs, python, ubuntu, virtualbox]
---
{% include JB/setup %}

Inspired by [Steven Fruchter's blog post](http://fruchterco.com/post/53164489086/python-headless-web-browser-scraping-on-amazon-linux),
and in need of a scraping tool that could trigger jQuery functions, I decided to implement my own headless
Python web-scraper. However, Fruchter had an Amazon EC2 instance &#8212; I didn't want one. Here's how to webscrape for two
different operating systems, Ubuntu 12.04 LTS and Mac OS X.

- ##Mac OS X setup is phenomneally easy, as always.
In fact, you can follow Fruchter's instructions *almost* precisely. Install [Homebrew](http://brew.sh/) and install pip,
the Python package manager. Also, instead of using a `wget`, which doesn't come standard on Mac OS X, a `git clone` 
or going to the [phantom-js homepage](http://phantomjs.org/) will work just as well. Just make sure to copy
the phantom-js executable to /usr/bin.

- ##Ubuntu is probably just as easy, but I was on a VM behind a proxy.
  0.  I had an Ubuntu 12.04 LTS VM and Oracle VM VirtualBox already installed. My machine is Windows 7.
  1.  Set your `$HTTP_PROXY` and `$HTTPS_PROXY` environment variables. Find a friendly networking expert to find
      out what your proxy name is, and if your HTTP vs. HTTPS values are different.
  2.  Used the Bridged Adapter for your networking purposes in your VM.
  3.  Search the Ubuntu guest OS for "Networks," and set the proxy variables in the same fashion as step 1.
  4.  In Terminal, set `http_proxy` by using `sudo set http_proxy=<proxy-name>` and do the analogous thing for `https_proxy`.
  5.  Use `sudo -E easy_install <package-name>` instead of pip. To that effect, install easy_install. You may 
      have to set the proxy variables in apt-get. Google this. `sudo -E` insists the system use environment
      variables.
  6.  Proceed as Fruchter intended, or, if that doesn't work, use this [blog post](http://python.dzone.com/articles/python-testing-phantomjs).

There may be a step 7. You might have to change your crawler's header if your proxy server rejects the crawler.
Try following the advice [here](https://coderwall.com/p/9jgaeq), with the caveat that I have not yet tried it.

##Why are http proxies there?
Proxies give all machines connected to a network the same IP when sending information out into the world and receiving it.
They exist for security purposes, masking the identity of individual machines.
##Why does open-source software obey them?
Seeing that they exist for security purposes, an machine that could sidestep the proxy would be at risk.
Thus, most open-source softare packages honor the proxy server.
