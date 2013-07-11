---
layout: page
title : Excel Shortcuts
category : Tools of the Trade
tagline: 
image: 
tags : [Excel, analysis, tools]
---
{% include JB/setup %}

##PivotTable

  - It won't do distinct counts. Instead, make what you're trying to count the row label in your table.
  - *Slicer* &#8212; removes variables of non-interest; a more powerful filter.
  - *Calculated Fields* &#8212; adds a custom calculation as a variable in the table. Go to Insert >> PivotTable tools - Options >> Fields, Items, &amp; Sets, and create a calculated field.

##Drop-downs

  - **Creating a button**: Go to your Developer tab >> Insert >> Combo Box. Place the button. Right-click the button and select "Format Control." The *Input Range* is the range of values you wish to display in your drop-down. *Cell Link* will be the cell that corresponds to the row number in the drop-down. This number will change based on what is currently chosen in your drop-down. 
  - Next, use an `INDEX` command &#8212; let your first input be a range of key values (that pair with your drop-down inputs) and your second input be the *Cell Link* you chose earlier.
  - **Linking to Values**: Link to a set of values in a table using the key values and `VLOOKUP` commands.
