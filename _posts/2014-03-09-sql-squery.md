---
layout: page
title : The Penultimate Puzzle Problem
category : sql
tagline : "A brainteaser for SQL fanatics"
tags : [ sql, big_data]
---
{% include JB/setup %}

I know many programmers who find the declarative syntax of SQL numbing and simplistic, but I'd argue that it can have its moments.
Here's a SQL puzzle I encountered last week that I think is genuinely interesting: Suppose you had a web log table 
like the one below and you had to find what action users took before they signed up for your website.
Assume you have no <code>LAG</code> function. How would you address it in ANSI SQL?

    | USER_ID | ACT            | TS |
    |---------|----------------|----|
    | A       | home           | 1  |
    | A       | signup         | 2  |
    | B       | home           | 1  |
    | B       | search_results | 2  |
    | B       | signup         | 3  |
    | B       | confirmation   | 4  |
    | C       | search_results | 1  |
    | C       | signup         | 2  |
    | D       | signup         | 1  |

We can see that users hit the home page once and the search_results page twice before signing up for the site.

It's tricky and exercises every major muscle group of SQL programming, utilizing joins, aggregates, filtering, and subqueries.

To get the answer, here's my response:

```sql
SELECT p0.act
  , COUNT(act) AS times_done
  FROM
  pages p0
  RIGHT JOIN
    (SELECT pages.user_id
    , MAX(pages.ts) AS latest
      FROM pages
      RIGHT JOIN 
        (SELECT user_id
              , ts
              FROM pages
        WHERE act = 'signup'
        ) signup_times
      ON signup_times.user_id = pages.user_id
      WHERE pages.ts < signup_times.ts
      GROUP BY pages.user_id
    ) prev
  ON p0.user_id = prev.user_id
  AND p0.ts = prev.latest
  GROUP BY act;
```

If you want to go a level deeper, list the number of times there was no action before signup.

[Here's a SQL fiddle page with live data, should you want to give it a try.](http://sqlfiddle.com/#!4/651a48/1)
