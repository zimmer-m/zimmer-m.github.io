---
layout: distill
title: "[ICML24] Global-Scale Forest Height Estimation"
date: 2025-04-13
description: Our paper <b>Estimating Canopy Height at Scale</b> was accepted to ICML 2024! In this work, we present a novel framework for global-scale forest height estimation. Using a deep learning approach that leverages large amounts of satellite data with only sparsely distributed ground-truth height measurements from NASA's GEDI mission, we achieve state-of-the-art accuracy with MAE/RMSE of 2.43m/4.73m overall, significantly outperforming existing approaches. The resulting height map facilitates ecological analyses at a global scale.
tags: [deep-learning, ai4science, sustainability]
bibliography: estimating-canopy-height-at-scale.bib
publication_type: "ICML24"
paper_url: "https://arxiv.org/abs/2406.01076"
code_url: "https://github.com/AI4Forest/Global-Canopy-Height-Map"
paper_custom: "Map|https://worldwidemap.projects.earthengine.app/view/canopy-height-2020"
giscus_comments: false
related_posts: false
authors:
  - name: Jan Pauls
    affiliations:
      name: University of Münster
  - name: Max Zimmer
    affiliations:
      name: Zuse Institute Berlin
  - name: Una M. Kelly
    affiliations:
      name: University of Münster
  - name: Martin Schwartz
    affiliations:
      name: LSCE/IPSL, France
  - name: Sassan Saatchi
    affiliations:
      name: NASA JPL, Caltech
  - name: Philippe Ciais
    affiliations:
      name: LSCE/IPSL, France
  - name: Sebastian Pokutta
    affiliations:
      name: Zuse Institute Berlin
  - name: Martin Brandt
    affiliations:
      name: University of Copenhagen
  - name: Fabian Gieseke
    affiliations:
      name: University of Münster
---

## Intro: Why Forest Monitoring Matters

Imagine having to measure every tree on Earth. It seems impossible, yet knowing the health and structure of our forests is a very important part of battling climate change. Forests not only act as a natural carbon sink, absorbing around half of the $CO_2$ from human activities, but they also provide habitat for countless species and are a crucial source of biodiversity. But how can we monitor these massive ecosystems that cover nearly one-third of the Earth's land?

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/global_big.png" alt="Global canopy height map showing forest heights across the world" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Our new global canopy height map shows forest heights across the world, with colors indicating tree heights from 0m (black/purple) to 35m+ (yellow).</div>
</div>

Accurate forest height maps allow scientist to understand how much carbon our forests store and how it is distributed, to better identify and hence protect old-growth forests, as well as monitoring forest health and finally making informed decisions about forest conservation. Our new method provides more precise height estimates than previous maps, especially for short vegetation and complex forest areas. This enhances the ability of scientists and policymakers to understand and protect our forests resources.

## The Challenge of Global Forest Monitoring

Traditional forest monitoring relies on field workers manually measuring individual trees. While this approach provides highly accurate data, it becomes impractical when trying to assess forests at a large scale. Furthermore, there's a stark divide in monitoring capabilities: while industrialized nations have sufficient resources to conduct comprehensive forest surveys, many countries - particularly those home to crucial ecosystems like the Amazon rainforest and Congo Basin - lack the necessary resources to perform extensive monitoring of their forest landscapes.

Satellite technology offers a solution. Modern satellites can regularly observe the entire Earth, offering a consistent way to monitor forests and general vegetation ecosystems worldwide. In particular, the GEDI mission, which is a full-waveform laser system on the International Space Station, can measure the height of every tree on the surface of the Earth. In practice however, the GEDI measurements are sparsely-distributed, taking up only a tiny fraction of the Earth's total surface area. This is visible in the image below, where the GEDI measurements are shown in red/yellow dots.

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/Sentinel_GEDI.jpg" alt="Satellite imagery with height measurements" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Satellite image overlaid with actual tree height measurements (red/yellow dots) from NASA's GEDI laser system. As the GEDI system is onboard the ISS, you can clearly see the ISS flight paths in the image.</div>
</div>

The sparse distribution of GEDI measurements poses a challenge for creating a global map of forest heights. This is where deep learning, and in particular our research, comes into play. We introduce a new methodology to create a **detailed, global-scale map of forest heights** using supervised deep learning on satellite data. In particular, we combine:
- Radar images that can see through clouds (Sentinel-1) as input
- Optical images that show forest detail (Sentinel-2) as input
- Height measurements from NASA's GEDI laser system as ground truth labels

In other words, we train a model that takes satellite images as input and predicts the height of each pixel, training on the sparse GEDI measurements as ground truth labels. But learning heights from satellite images is not easy. Problems like clouds, mountains, and measurement angles make it challenging to get a good estimate of the height of the trees. We discuss our main challenges below:

### Challenge 1: Dealing with Clouds

Satellites follow fixed orbits and capture images on a regular schedule, regardless of cloud cover. While most regions experience clear skies at some point during the year, allowing us to select cloud-free images, tropical regions pose a unique challenge. The persistent cloud cover and high-altitude cirrus clouds in these areas make it difficult to obtain clear optical satellite imagery, necessitating innovative approaches to extract useful data.

### Challenge 2: Mountains and Measurements

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/CanopyProblem.png" alt="The challenge of measuring trees on slopes" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">How slopes can trick our measurements: The same tree might appear taller when measured on a slope, and even in the absence of trees, GEDI records a height measurement.</div>
</div>

Mountainous terrain poses unique measurement challenges. GEDI's laser technology measures the height difference between the highest and lowest points within a 25-meter diameter circle. On steep slopes, this can distort measurements in two ways: trees may appear artificially taller than their true height, and even bare slopes register as having "height" due to the elevation change within the measurement circle.

### Challenge 3: Location Accuracy

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/gedi_shift.png" alt="Shifted measurements example" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Sometimes our measurements are slightly offset from their true location (each circle shows a height measurement).</div>
</div>

Even with accurate height measurements, GPS and satellite positioning errors can cause misalignment between the reported and actual measurement locations. This spatial offset presents a critical challenge: How can we train a reliable model when our ground-truth training data may be shifted from its true position?

## Our Approach to Forest Height Estimation
<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/pipeline.png" alt="Our processing pipeline" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Overview of our approach: from satellite data to the global height map.</div>
</div>

Our solution involves three main components, which we will explain below:

(1) **Multiple Types of Satellite Data**

Our approach leverages two complementary satellite data sources from ESA: Sentinel-2's high-resolution optical imagery (similar to Google Maps) and Sentinel-1's radar data. The radar signals can penetrate clouds and even some vegetation layers, providing crucial data in areas where optical sensors are limited. We combine these inputs with height measurements from NASA's GEDI laser system on the International Space Station, which serve as our ground truth labels.

(2) **Smart Cloud Handling**

Although we use radar data, it is still beneficial to use optical data as often as possible, as it has a higher level of detail. We therefore try to construct a cloud-free image where possible. Sentinel-2 does not only capture a single image per year, but an image of the entire globe every 6 days. We therefore make use of all images and mask out clouds from every image. Lastly, we combine all images into a single image by taking the per-pixel median of all non-cloud pixel values. This step effectively removes almost all clouds from the image and reduced noise and inter-year-variability.

(3) **Model Training**

We used a special loss function to address location erros in our ground-truth measurements. Our loss function allows the model to shift the measurements within a certain range if it is similar for all nearby measurements. Secondly, we pre-filter our labels to remove measurements that were taken on areas with a great slope.



### Results: Comparing to existing maps

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/global_and_regional_comparison.png" alt="Comparison of different approaches" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Comparison of our map (second row) with previous global maps and a detailed regional map (our benchmark). Notice the improved detail in our results.</div>
</div>

Visually, our new method shows significant improvements over existing global maps, successfully surpassing their accuracy and detail levels. Specifically, we achieve better detail in forest structure, more accurate height estimates, and clearer distinction between forest and non-forest areas. The visual quality of our results even closely approaches that of specialized regional maps.


Let's look at how well our method performs quantitatively. We compared our results with the two other existing global canopy height maps, namely the one from Lang et al. <d-cite key="langHighresolutionCanopyHeight2023"></d-cite> and the one from Potapov et al. <d-cite key="potapovMappingGlobalForest2021"></d-cite>, reporting metrics for all ground-truth measurements as well as only for ground-truth measurements with a height greater than 5m to emphasize the error on trees.

<div class="table-container">
<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Mean Absolute Error</th>
            <th>Root Mean Square Error</th>
            <th>Mean Absolute Error (for labels > 5m)</th>
            <th>Root Mean Square Error (for labels > 5m)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Lang et al.</td>
            <td>6.47m</td>
            <td>8.62m</td>
            <td>8.80m</td>
            <td>11.02m</td>
        </tr>
        <tr>
            <td>Potapov et al.</td>
            <td>6.92m</td>
            <td>9.25m</td>
            <td>10.01m</td>
            <td>12.43m</td>
        </tr>
        <tr>
            <td><strong>Our Method</strong></td>
            <td><strong>2.43m</strong></td>
            <td><strong>4.73m</strong></td>
            <td><strong>4.45m</strong></td>
            <td><strong>6.72m</strong></td>
        </tr>
    </tbody>
</table>
<div class="table-caption">Performance comparison of different canopy height estimation methods.</div>
</div>

*Our method achieves significantly lower errors across all metrics. For trees taller than 5m, we maintain this advantage with a mean absolute error of just 4.45m.* To better understand where our method performs well and where there's still room for improvement, let's look at the error distribution across different tree heights:

<div class="figure-container">
    <img src="/assets/img/blog_img/estimating-canopy-height-at-scale/error_height_distribution.png" alt="Error distribution across tree heights" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Error analysis across different height ranges. The boxes show the distribution of errors for each height range, with negative errors indicating underestimation. Notice how we (blue) maintain lower error rates and less variance, especially for trees up to 30m.</div>
</div>

Looking at this analysis in detail, our method shows excellent performance for trees up to 20m in height, with strong accuracy continuing through the medium height ranges. However, we must acknowledge that very tall trees, particularly those above 30m, remain a significant challenge. This is especially pronounced in tropical forests, where canopy heights can exceed 40m - an important area we need to address in future work. Nevertheless, even with these challenges in tall tree estimation, our approach demonstrates notably lower error variance compared to previous methods across most height ranges.



## Conclusion

Creating accurate global forest height maps is crucial for understanding and protecting our planet's forests. Our method combines the latest satellite technology with machine learning to produce the most detailed and accurate global forest height map to date. While we've made significant progress, there's still more to explore. Future improvements could include:
- Even better handling of mountainous regions
- More frequent updates to track changes over time
- Reducing the error for very tall trees

Want to explore forest heights in your area? Our global canopy height map is available on Google Earth Engine. You can view our predicted forest height information for any location on Earth here: [worldwidemap.projects.earthengine.app/view/canopy-height-2020](https://worldwidemap.projects.earthengine.app/view/canopy-height-2020).