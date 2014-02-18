---
layout: page
title : K-folds cross-validation
category : statistics
tagline : "Notes on re-sampling"
tags : [ big data, statistics]
---
{% include JB/setup %}

Recall that bias is how far a model is from the truth. Variance is the sensitivity of the model to small changes
in the test data.

There exists a bias-variance dilemma. We don't want to overfit a model to a particular test set&#8212;even though
it will be incredibly descriptive of our test set, it will have high variance (i.e., low flexibility).

Best solution to balance the two is a large designated test set, which is often not available.

Instead, the validation-set approach is very often used.

We fit a model to a training, and we validate it on a hold-out, or *validation*, set. If you've heard of *k-folds
cross-validation*, this is where that comes from.

There are drawbacks to the validation set approach. The validatoin of the test error can be variable, depending
on which observations are included. 

K-fold cross-validation addresses the problem with the validation set approach. The data is divided into *k* parts,
one of which is used for validation and the other *k - 1* used for training. 

*Caveat.* Since each training is only *(k-1)/k* as as the original training set, prediction error estimate will be biased upwards.



