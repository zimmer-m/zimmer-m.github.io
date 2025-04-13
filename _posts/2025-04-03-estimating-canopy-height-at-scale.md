---
layout: post
title: "[ICML24] Global-Scale Forest Height Estimation"
date: 2025-04-03
description: A summary of our recent ICML 2024 paper on estimating canopy height from satellite data
tags: [ml, ai4science, sustainability]
giscus_comments: true
related_posts: false
toc:
  sidebar: left
---

<div class="alert alert-info" role="alert">
<strong>TL;DR:</strong> Our paper "Estimating Canopy Height at Scale" was accepted at ICML 2024! In this work, we (Jan Pauls, Max Zimmer, Una M. Kelly, Martin Schwartz, Sassan Saatchi, Philippe Ciais, Sebastian Pokutta, Martin Brandt, and Fabian Gieseke) present a novel framework for global-scale forest height estimation. Using a deep learning approach that leverages large amounts of satellite data with only sparsely distributed ground-truth height measurements from NASA's GEDI mission, we achieve state-of-the-art accuracy with MAE/RMSE of 2.43m/4.73m overall, significantly outperforming existing approaches. The resulting height map facilitates ecological analyses at a global scale.
</div>

# Why Forest Monitoring Matters

Imagine having to measure every tree on Earth. It seems impossible, yet knowing the health and structure of our forests is a very important part of battling climate change. Forests not only act as a natural carbon sink, absorbing around half of the CO2 from human activities, but they also provide habitat for countless species and are a crucial source of biodiversity. But how can we monitor these massive ecosystems that cover nearly one-third of the Earth's land?

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/global_big.png" alt="Global canopy height map showing forest heights across the world" class="zoomable" data-zoomable>
    <div class="figure-caption">Our new global canopy height map shows forest heights across the world, with colors indicating tree heights from 0m (black/purple) to 35m+ (yellow)</div>
</div>

## The Challenge of Global Forest Monitoring

Traditional forest monitoring involves people measuring trees in the field. Although this method creates high-quality data, it is impractical for large-scale monitoring. Additionally, while most first-world countries have the resources to survey their forests and do the foregoing analysis, many poorer countries, especially in the tropical regions housing the Amazonas rainforest and Congo Basin, lack the resources for extensive surveys.

Satellite technology offers a solution. Modern satellites can regularly observe the entire Earth, offering a consistent way to monitor forests and general vegetation ecosystems worldwide. But converting satellite images into accurate height measurements is not easy. Problems like clouds, mountains, and measurement angles make it challenging to get a good estimate of the height of the trees.

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/Sentinel_GEDI.jpg" alt="Satellite imagery with height measurements" class="zoomable" data-zoomable>
    <div class="figure-caption">Satellite image overlaid with actual tree height measurements (red/yellow dots) from NASA's GEDI laser system. As the GEDI system is onboard the ISS, you can clearly see the ISS flight paths in the image.</div>
</div>

Our research introduces a new method to create a **detailed, global-scale map of forest heights** using machine learning and satellite data. We combine:
- Radar images that can see through clouds (Sentinel-1)
- Optical images that show forest detail (Sentinel-2)
- Height measurements from NASA's GEDI laser system

## Why This Matters

Accurate forest height maps allow scientist to understand how much carbon our forests store and how it is distributed, to better identify and hence protect old-growth forests, as well as monitoring forest health and finally making informed decisions about forest conservation. Our new method provides more precise height estimates than previous maps, especially for short vegetation and complex forest areas. This enhances the ability of scientists and policymakers to understand and protect our forests resources.

## The Challenges of Measuring Trees from Space

When measuring forest heights globally, we face several challenges. We showcase our main challenges below:

### Challenge 1: Dealing with Clouds

The satellite cannot decide when to take an image so it is inherent that sometimes the view is obstructed by clouds. In most areas it is however possible to select a point in time with a clean image. For the tropics however, clouds and cirrus are a constant issue and new methods are needed.

### Challenge 2: Mountains and Measurements

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/CanopyProblem.png" alt="The challenge of measuring trees on slopes" class="zoomable" data-zoomable>
    <div class="figure-caption">How slopes can trick our measurements: The same tree might appear taller when measured on a slope, and even in the absence of trees, GEDI records a height measurement.</div>
</div>

Another challenge arises in mountainous regions. When using laser technology like GEDI to measure tree heights from space, steep slopes can give misleading results. For example, a tree might appear taller than it is because it's on a slope. Additionally, even without trees, GEDI records a height measurement since it measures the height difference between the highest and lowest points within a 25-meter diameter circle.

## Challenge 3: Location Accuracy

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/gedi_shift.png" alt="Shifted measurements example" class="zoomable" data-zoomable>
    <div class="figure-caption">Sometimes our measurements are slightly offset from their true location (each circle shows a height measurement)</div>
</div>

Even when the measurement itself is correct, the reported measurement location is not. This poses a challenge for training our model: How can it learn accurately if the training data isn't lined up correctly?

# Our Solution: A Smart Approach to Forest Mapping

## How It Works

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/pipeline.png" alt="Our processing pipeline" class="zoomable" data-zoomable>
    <div class="figure-caption">Overview of our approach: from satellite data to global height map</div>
</div>

Our solution involves three main components, which we will explain below:

1. **Multiple Types of Satellite Data**

We use multi-source satellite images. We use classical optical data (similar to Google Maps) from ESA's Sentinel-2 mission and radar data from ESA's Sentinel-1 mission. Radar data has the big advantage over optical data that its signal can penetrate clouds and, depending on the wavelength, even some layers of vegetation. Our labels are derived from the GEDI mission, which is a full-waveform laser system on the International Space Station.

2. **Smart Cloud Handling**

Although we use radar data, it is still beneficial to use optical data as often as possible, as it has a higher level of detail. We therefore try to construct a cloud-free image where possible. Sentinel-2 does not only capture a single image per year, but an image of the entire globe every 6 days. We therefore make use of all images and mask out clouds from every image. Lastly, we combine all images into a single image by taking the per-pixel median of all non-cloud pixel values. This step effectively removes almost all clouds from the image and reduced noise and interyear variability.

3. **Model Training**

We used a special loss function to address location erros in our ground-truth measurements. Our loss function allows the model to shift the measurements within a certain range if it is similar for all nearby measurements. Secondly, we pre-filter our labels to remove measurements that where taken on areas with a great slope.

# Results: How Well Does It Work?

## Comparing with Existing Maps

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/global_and_regional_comparison.png" alt="Comparison of different approaches" class="zoomable" data-zoomable>
    <div class="figure-caption">Comparison of our map (second row) with previous global maps and a detailed regional map (our benchmark). Notice the improved detail in our results</div>
</div>

Our new method shows significant improvements over existing global maps, successfully surpassing their accuracy and detail levels. Specifically, we achieve better detail in forest structure, more accurate height estimates, and clearer distinction between forest and non-forest areas. The quality of our results even closely approaches that of specialized regional maps

## Quantitative Results

Let's look at how well our method performs in numbers. We compared our results with the two other existing global canopy height maps and report our metrics for all ground-truth measurements as well as only for ground-truth measurements with a height greater than 5m to put a focus on the error on trees.

<div class="table-container">
<div class="table-caption">Performance comparison of different canopy height estimation methods</div>

| Method | Mean Absolute Error | Root Mean Square Error | Mean Absolute Error (for labels > 5m) | Root Mean Square Error (for labels > 5m) |
|-|-|-|-|-|
| Lang et al. | 6.47m | 8.62m | 8.80m | 11.02m
| Potapov et al. | 6.92m | 9.25m | 10.01m | 12.43m
| **Our Method** | **2.43m** | **4.73m** | **4.45m** | **6.72m** 

*Our method achieves significantly lower errors across all metrics. For trees taller than 5m, we maintain this advantage with a mean absolute error of just 4.45m.*
</div>

To better understand where our method performs well and where there's still room for improvement, let's look at the error distribution across different tree heights:

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/error_height_distribution.png" alt="Error distribution across tree heights" class="zoomable" data-zoomable>
    <div class="figure-caption">Error analysis across different height ranges. The boxes show the distribution of errors for each height range, with negative errors indicating underestimation. Notice how our method (blue) maintains lower error rates and less variance, especially for trees up to 30m.</div>
</div>

Looking at this analysis in detail, our method shows excellent performance for trees up to 20m in height, with strong accuracy continuing through the medium height ranges. However, we must acknowledge that very tall trees, particularly those above 30m, remain a significant challenge. This is especially pronounced in tropical forests, where canopy heights can exceed 40m - an important area we need to address in future work. Nevertheless, even with these challenges in tall tree estimation, our approach demonstrates notably lower error variance compared to previous methods across most height ranges.

# Try It Yourself!

Want to explore forest heights in your area? Our global canopy height map is available on Google Earth Engine. You can view our predicted forest height information for any location on Earth.

[Explore the Interactive Map](https://worldwidemap.projects.earthengine.app/view/canopy-height-2020)

# Conclusion

Creating accurate global forest height maps is crucial for understanding and protecting our planet's forests. Our method combines the latest satellite technology with machine learning to produce the most detailed and accurate global forest height map to date.

While we've made significant progress, there's still more to explore. Future improvements could include:
- Even better handling of mountainous regions
- More frequent updates to track changes over time
- Reducing the error for very tall trees

For those interested in the technical details, you can find our full research paper [here](https://arxiv.org/abs/2406.01076) and the source code on [GitHub](https://github.com/AI4Forest/Global-Canopy-Height-Map).