---
layout: page
title : Git Tricks
category : Tools of the Trade
tagline: "Reasons to appreciate good version control"
image: http://git-scm.com/images/logos/downloads/Git-Logo-2Color.png
tags : [ Git, tricks, tools, version control]
---
{% include JB/setup %}

[Git](http://git-scm.com/) seems to be universal knowledge these days amongst programmers. 

There are a bunch of reasons to like it, which I believe keep it from being antiquated as of yet:

1. **Git can be used offline.**
    All version control can be done without an active internet connection. A 
    backup is simply best practice, but local use of Git is also possible, 
    should you find yourself unable to access wireless but still wanting 
    version control for your current project.
2.**Git is distributed.**
    Files can be backed up elsewhere (GitHub, obviously), and collaboration is simple.
3. **Branching is easy.**
    Anyone still using SVN simply doesn't understand what they're missing.
4. **It's clean.**
    Relative to other software versioning (like [SVN](http://en.wikipedia.org/wiki/Apache_Subversion)), Git uses far fewer files. It's neat and doesn't clutter your directory listing.

Great tutorials are a Google search away, so I won't even bother diving into that.  

Great command line tricks I don't believe other people are discussing enough in their blog posts:

+ `gitk` is a GUI that helps visualize merging and branching. 
It provides a neat synopsis of changes for each commit and offers a search
feature for all commits, including author and messages for commits.
+ `git stash` saves changes temporarily &#8212; suppose you had to revert to an earlier commit
but had already begun work on your next one. You can use `git stash` on your current work,
roll back to your previous commit, and then use `git stash apply` to add your new work. 
Additionally, `git stash clear` cleans out the current stash.
+ `git branch -d <branch-name>` deletes a specified branch, cleaning up your repository.
+ `git remote show origin` is a quick way to view the origin repository.
