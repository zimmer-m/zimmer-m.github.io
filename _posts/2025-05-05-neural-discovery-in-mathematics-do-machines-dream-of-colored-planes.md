---
layout: distill
title: "Neural Discovery in Mathematics: Do Machines Dream of Colored Planes?"
date: 2025-04-05
description: "Our paper <b>Neural Discovery in Mathematics: Do Machines Dream of Colored Planes?</b> was accepted to <b>ICML 2025</b>! We show how NNs can find novel geometric colorings, leading to the first improvement in 30 years on a variant of the Hadwiger-Nelson problem."
tags: [deep-learning, ai4science, ai4math, combinatorics, geometry]
bibliography: neural_discovery_in_mathematics.bib
publication_type: "ICML25"
paper_url: "https://arxiv.org/abs/2501.18527"
giscus_comments: false
related_posts: false
authors:
  - name: Konrad Mundinger
    affiliations:
      name: Zuse Institute Berlin
  - name: Max Zimmer
    affiliations:
      name: Zuse Institute Berlin
  - name: Aldo Kiem
    affiliations:
      name: Zuse Institute Berlin
  - name: Christoph Spiegel
    affiliations:
      name: Zuse Institute Berlin
  - name: Sebastian Pokutta
    affiliations:
      name: Zuse Institute Berlin
---

## Do Machines Dream of Colored Planes?

The Hadwiger-Nelson problem is a deceptively simple question that has puzzled mathematicians for over 70 years: What is the minimum number of colors needed to color the entire infinite Euclidean plane such that no two points exactly one unit apart share the same color? This minimum number is called the *chromatic number of the plane*, denoted $\chi(\mathbb{R}^2)$.

Imagine trying to color a map, but instead of countries, you're coloring every single point on an infinite flat surface. The only rule is that if you pick any point, all points exactly one unit away (lying on a circle of radius 1 around it) must have a different color.

This problem sounds abstract, but it sits at the intersection of geometry (dealing with points and distances) and combinatorics (dealing with discrete structures like colors). While we know the answer must be 5, 6, or 7, closing this gap has proven incredibly difficult. Finding a valid 5-coloring or proving that 7 colors are truly necessary remains an open challenge. Lower bounds (proving at least $N$ colors are needed) often involve constructing intricate graphs like the Moser spindle (requiring 4 colors) or the 1581-vertex graph found by Aubrey de Grey in 2018 (requiring 5 colors) <d-cite key="DeGrey2018ChromaticNumber"></d-cite>. Upper bounds (showing that $N$ colors are sufficient) require finding an explicit coloring pattern for the entire plane, like the known hexagonal tiling that uses 7 colors <d-cite key="soifer2009mathematical"></d-cite>.

## A New Approach: Neural Networks for Mathematical Discovery

Finding new, valid colorings is hard. The plane is infinite and continuous, while the coloring choice is discrete. How can we explore the vast space of possible colorings efficiently? Traditional computational methods often struggle with this mix of continuous space and discrete constraints.

In our ICML 2025 paper, "Neural Discovery in Mathematics: Do Machines Dream of Colored Planes?", we introduce a new approach using neural networks (NNs) <d-cite key="mundinger2025neural"></d-cite>. The core idea is to reframe the combinatorial problem as a continuous optimization task that neural networks are well-suited to handle. Instead of trying to directly assign a specific color (a discrete choice) to each point, we train the NN to output a *probability distribution* over the available colors for any given point in the plane.

Let $f_\theta: \mathbb{R}^2 \to \Delta^{k-1}$ be a neural network parameterized by $\theta$, where $k$ is the number of colors and $\Delta^{k-1}$ is the $(k-1)$-dimensional probability simplex. For an input point $x \in \mathbb{R}^2$, the output $f_\theta(x) = (p_1, ..., p_k)$ represents the probability that point $x$ should receive color $i$.

To train this network, we need a way to measure how "bad" a probabilistic coloring is. We define a differentiable loss function based on the problem's constraints. For the standard Hadwiger-Nelson problem, the constraint is that no two points at unit distance share the same color. The loss function calculates the expected probability that two points $x, y$ exactly one unit apart *do* share the same color:

$$
\mathcal{L}(\theta) = \mathbb{E}_{x \sim \mathcal{D}, \|y-x\|_2 = 1} [f_\theta(x)^T \cdot f_\theta(y)]
$$

Here, $\mathcal{D}$ is a distribution over points in the plane (in practice, sampled from a large region), $y$ is sampled uniformly from the unit circle around $x$, and $f_\theta(x)^T \cdot f_\theta(y)$ represents the probability that $x$ and $y$ receive the same color when sampled independently from their distributions $f_\theta(x)$ and $f_\theta(y)$.

Because the network outputs probabilities and the loss function involves expectations over these probabilities, the entire setup is differentiable with respect to the network parameters $\theta$. This allows us to use standard gradient descent algorithms (like Adam <d-cite key="kingma2014adam"></d-cite>) to minimize the loss. As the loss decreases, the network learns to assign probabilities such that points at unit distance are less likely to receive the same color.

The NN acts as a powerful function approximator, capable of learning complex, potentially non-repeating patterns directly from the geometric constraints, without needing us to guess the pattern beforehand. We use this not to find a fully automated proof, but as a tool to guide mathematical intuition <d-cite key="davies2021advancing"></d-cite>. The NN often discovers highly structured patterns that hint at formal mathematical constructions. When the loss converges to near-zero, the resulting probabilistic coloring often suggests a deterministic, valid coloring pattern.

## Dreaming Up New Colorings: Variants and a 30-Year Leap Forward

While finding a 6-coloring for the original problem remains elusive (our NNs consistently find patterns needing 7 colors, suggesting $\chi(\mathbb{R}^2)=7$), this approach proved highly successful on related variants where the forbidden distances are not uniform across all color pairs.

A key variant we studied is the $(1,1,1,1,1,d)$ coloring problem: coloring the plane with 6 colors such that five colors avoid unit distance pairs (distance = 1), while the sixth color must avoid pairs at a *different* distance, $d$. This is a specific instance of the general $(d_1, ..., d_k)$ coloring type, where color $i$ must avoid realizing distance $d_i$. For this variant, the loss function is modified to sum the conflict probabilities for each color $k$ with its specific forbidden distance $d_k$:

$$
\mathcal{L}_{variant}(\theta) = \sum_{k=1}^6 \mathbb{E}_{x \sim \mathcal{D}, \|y-x\|_2 = d_k} [f_\theta(x)_k \cdot f_\theta(y)_k]
$$

where $d_1=...=d_5=1$ and $d_6=d$. This loss penalizes pairs $(x, y)$ having the same color $k$ if their distance is the forbidden distance $d_k$.

Finding the set of all possible values for $d$ for which such a 6-coloring exists is itself a challenging open problem <d-cite key="Soifer1994SixRealizable"></d-cite>. Prior to our work, such colorings were only known to exist for $d$ in the range $[\sqrt{2}-1, 1/\sqrt{5}] \approx [0.414, 0.447]$ <d-cite key="hoffman1993almost"></d-cite>, <d-cite key="soifer1994infinite"></d-cite>.

We also explored other variants, such as the $(1,1,1,1,d_1,d_2)$ problem, where two colors have distinct forbidden distances $d_1$ and $d_2$. Our framework easily adapts by modifying the loss function to incorporate the specific distance constraints for each color pair.

<div class="figure-container">
    <img src="/assets/img/blog_img/neural_discovery_mathematics/heatmap_two_colors_free.png" alt="Heatmap showing minimum conflicts for (1,1,1,1,d1,d2) colorings" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Minimum conflict rate (log scale) found by the NN for the $(1,1,1,1,d_1,d_2)$ variant across different values of $d_1$ and $d_2$. Darker blue indicates lower conflict, suggesting potentially valid colorings exist in those regions. The diagonal corresponds to the $(1,1,1,1,1,d)$ case. <d-cite key="mundinger2025neural"></d-cite></div>
</div>

Focusing on the $(1,1,1,1,1,d)$ variant, our NN approach, exploring different values of $d$, discovered patterns that led us to formalize **two new families of 6-colorings** <d-cite key="2024_SixcoloringsExpansion"></d-cite>.

<div class="figure-container">
    <img src="/assets/img/blog_img/neural_discovery_mathematics/complete_nn_comparison_compact.jpeg" alt="Neural network output inspiring a formal 6-coloring" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Left: A coloring pattern suggested by the neural network. Right: The formalized mathematical construction derived from the NN's output. This coloring is of type $(1,1,1,1,1,d)$ for a range of $d$. <d-cite key="2024_SixcoloringsExpansion"></d-cite></div>
</div>

These two new colorings are visualized below:

<div class="figure-container">
  <div style="display: flex; flex-wrap: wrap; justify-content: space-around; align-items: flex-start; margin-bottom: 0.5em;">
      <div style="flex: 1; min-width: 300px; margin: 0.5em;">
          <img src="/assets/img/blog_img/neural_discovery_mathematics/firstcoloring_complete.jpeg" alt="First new 6-coloring pattern" style="width: 100%;" class="zoomable" data-zoomable>
      </div>
      <div style="flex: 1; min-width: 300px; margin: 0.5em;">
          <img src="/assets/img/blog_img/neural_discovery_mathematics/secondcoloring_complete.jpeg" alt="Second new 6-coloring pattern" style="width: 100%;" class="zoomable" data-zoomable>
      </div>
  </div>
  <div class="figure-caption">Left: Our first novel 6-coloring pattern, valid for $d \in [0.354, 0.553]$. Red avoids distance $d$ (shown for $d=0.45$), others avoid distance 1. Right: Our second novel pattern, valid for $d \in [0.418, 0.657]$. Red avoids distance $d$ (shown for $d=0.657$ and $d=0.418$), others avoid distance 1. <d-cite key="2024_SixcoloringsExpansion"></d-cite></div>
</div>

Together, these NN-inspired constructions **significantly expand the known continuum of realizable distances** $d$ to $[0.354, 0.657]$, representing the first progress on this problem variant in 30 years.

<div class="figure-container">
    <img src="/assets/img/blog_img/neural_discovery_mathematics/distance_vs_conflicts.jpeg" alt="Conflict rate vs distance d for (1,1,1,1,1,d) colorings" style="max-width: 100%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Minimum conflict rate found by NNs across different distances $d$. The orange region shows the previously known range of $d$ for valid 6-colorings, while the blue region shows the significantly expanded range enabled by our new NN-discovered constructions.</div>
</div>

## Conclusion and Outlook

Our work demonstrates that reformulating combinatorial geometry problems as continuous optimization tasks solvable by neural networks can be a powerful engine for mathematical discovery. While the NNs don't provide formal proofs themselves, they can explore vast solution spaces and uncover complex patterns, providing the crucial insights needed for mathematicians to construct novel solutions.

The discovery of new 6-colorings for the Hadwiger-Nelson variant is a testament to this approach. We believe this framework holds promise for tackling other challenging problems in discrete mathematics and geometry where mixed discrete-continuous aspects have hindered progress. Perhaps machines *can* dream of colored planes, and their dreams can help us understand mathematics more deeply.

If this work is helpful for your research, please consider citing our paper:

```bibtex
@inproceedings{mundinger2025neural,
  title={Neural Discovery in Mathematics: Do Machines Dream of Colored Planes?},
  author={Mundinger, Konrad and Zimmer, Max and Kiem, Aldo and Spiegel, Christoph and Pokutta, Sebastian},
  booktitle={Forty-second International Conference on Machine Learning},
  year={2025},
  url={https://arxiv.org/abs/2501.18527},
  note={To appear}
}
```

