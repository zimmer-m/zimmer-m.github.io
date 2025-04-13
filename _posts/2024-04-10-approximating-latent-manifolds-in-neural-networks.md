---
layout: distill
title: "Approximating Latent Manifolds in Neural Networks via Vanishing Ideals"
date: 2025-04-10
description: Our preprint 'Approximating Latent Manifolds in Neural Networks via Vanishing Ideals' introduces a novel approach to understanding data representation in neural networks through vanishing ideals. This work uncovers the structure of latent spaces, supports network compression, and scales vanishing ideal algorithms to handle high-dimensional data. Additionally, it provides learning guarantees for these methods, marking the first application of vanishing ideals to latent representations.
bibliography: approximating-latent-manifolds-in-neural-networks.bib
paper_url: "https://arxiv.org/abs/2502.15051"
tags: [ml, deep-learning, neural-networks, algebraic-geometry]
giscus_comments: false
related_posts: false
authors:
  - name: Nico Pelleriti
    affiliations: 
      name: Zuse Institute Berlin
  - name: Max Zimmer
    affiliations: 
      name: Zuse Institute Berlin
  - name: Elias Wirth
    affiliations: 
      name: Zuse Institute Berlin
  - name: Sebastian Pokutta
    affiliations: 
      name: Zuse Institute Berlin
---



## Manifold Hypothesis and Algebraic Geometry

Deep learning has significantly advanced AI, but what makes it so effective? One possible explanation is the *Manifold Hypothesis*. 
This hypothesis posits that real-world data, although seemingly complex and high-dimensional, actually resides on simpler, low-dimensional structures known as manifolds<d-cite key="fefferman2013testing"></d-cite>. 
These manifolds can be conceptualized as locally Euclidean spaces, meaning they resemble flat, Euclidean space in sufficiently small neighborhoods.



<div class="figure-container">
    <img src="/assets/img/blog_img/approximating-latent-manifolds-in-neural-networks/manifold_nn.png" alt="Manifold Neural Network" style="max-width: 80%;" class="zoomable" data-zoomable>
    <div class="figure-caption">The baseline NN output is interpreted as class probabilities. The truncated NN output is interpreted using the manifold hypothesis, suggesting that classes lie on distinct manifolds. We characterize these manifolds using a set of polynomials, capturing their underlying structure. The depicted manifold is a visualization of a Calabi–Yau manifold.</div>
</div>




What makes this even more interesting is that certain types of these manifolds often have mathematical descriptions using polynomial equations. For example, a sphere - one of the simplest manifolds - can be described by a single polynomial equation: $x^2 + y^2 + z^2 = 1$. This connection between geometry and algebra inspired our work: we discovered that by analyzing neural networks layer by layer, we could characterize how data manifolds transform via vanishing ideals. 

## Applying Vanishing Ideal Algorithms to Latent Spaces
Vanishing ideal algorithms, which construct approximately vanishing polynomials, have garnered significant attention recently<d-cite key="livni_vanishing_2013,wirth_conditional_2024,wirth_approximate_2023"></d-cite>. Given a set of data representations in the form of vectors $v_1, \dots, v_m \in \mathbb{R}^n$, an approximately vanishing polynomial is defined as a polynomial $p$ such that $p(v_i) \leq \epsilon$ for all $i \in [m]$. These polynomials can then be used to describe the data manifold as a compact set of polynomials.  

Despite their potential, these algorithms face two main technical challenges: they struggle with the high dimensionality of data and tend to produce an excessive number of polynomials. 


### High Dimensionality 

We addressed the challenges of high dimensionality through the following approaches:

- **Stochastic Vanishing Ideal Algorithms**: By using stochastic methods, we efficiently handle large datasets by processing subsets of data points, enforcing the approximately vanishing property only on these subsets.
- **Principal Component Analysis (PCA)**: We applied PCA to reduce the dimensionality of data representations, simplifying the data while retaining essential features.
- **Tanh Rescaling**: This technique was used to normalize data values, keeping them within the unit cube and improving numerical stability for the polynomial computations. 
- **Reduced Arithmetic Precision**: We employed reduced precision in arithmetic operations to handle memory issues. 

These techniques allowed us to construct generators of the approximate vanishing ideals for moderately sized datasets, such as CIFAR10 and CIFAR100 in several ResNet architectures. 

### Number of Polynomials

While these techniques enabled us to compute polynomials that approximately vanish, the sheer number of these polynomials made evaluation extremely costly and thus intractable. We addressed this issue by introducing a *pruning approach*. Instead of using every polynomial we constructed, we retained only a small subset. 



<div class="figure-container">
    <img src="/assets/img/blog_img/approximating-latent-manifolds-in-neural-networks/pruning.png" alt="Pruning of Polynomials" style="max-width: 90%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Illustration of our pruning approach. We start by removing polynomials with the lowest pruning scores, such as $p_2$ and $p_4$. Rows with only zero entries, indicating non-contributing monomials, are also removed. This leaves only essential monomials $y$, $x^2$, and $y^2$ for the final computation.</div>
</div>



To select this subset, we introduced a scoring function. For each polynomial we know by construction it vanishes approximately on instances of its own class $j$. However, if it also vanishes on the instances $z^k_1, \dots, z^k_{m_k}$ of other classes $k \neq j$, then it does not describe the class specific manifolds but rather the manifold of the entire dataset.

$$
    s(p) = \min_{k \neq j} \frac{1}{m_k}\sum_{i=1}^{m_k}\left|p(z^k_i)\right|.
$$

Finally, we specifically employed vanishing ideal algorithms which construct *sparse* polynomials. This means, after pruning, few monomial terms need to be evaluated, further increasing efficiency. 


## The VI-Net Training Pipeline

By following these steps, we can create a streamlined set of polynomials that integrate into a pretrained neural network for classification. Here's a brief overview of our process:

#### Step 1: Truncating the Network

We start with a pretrained neural network and truncate it at an intermediate layer. This truncated network captures the essential features of the input data but may not be sufficient for final classification.

#### Step 2: Computing Vanishing Ideals

For each class, we compute generators of the approximate vanishing ideal of its latent representations. These generators are polynomials that approximately vanish on the data points of that class but not on points from other classes.

#### Step 3: Pruning

We prune the generators to manage complexity and remove non-discriminatory ones. The remaining generators form a polynomial layer that replaces the final layers of the original network. This layer is followed by a simple linear classifier.

#### Step 4: Finetuning

We finetune the polynomial layer, healing the damage of the truncation of layers and removal of polynomials. 

## Results: Performance and Efficiency

We performed extensive experiments to validate our findings empirically. We found that a substantial number of layers can be replaced by a polynomial layer and that VI-Net can make baseline NNs faster, with competitive accuracy.

### Accuracy

Our experiments show that VI-Net achieves comparable accuracy to the original networks while significantly reducing the number of parameters, even achieving moderate speed ups for inference. 

<div class="figure-container">
    <img src="/assets/img/blog_img/approximating-latent-manifolds-in-neural-networks/cifar100.png" alt="Performance of VI-Net" style="max-width: 80%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Comparison of linear probing, randomly generated monomials, and VI-Net. Linear probing uses a linear classifier on the truncated network. Random monomials add non-linearity but lack our method's discriminative power. VI-Net uses polynomials from vanishing ideals, tailored to the data's structure, significantly outperforming other methods.</div>
</div>

### Efficiency
Our pruning strategy effectively manages the number of newly introduced polynomials, enabling the construction of VI-Net models that are more parameter-efficient and often exhibit faster inference times.

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th colspan="6" class="table-header">CIFAR-10 (ResNet-18)</th>
      </tr>
      <tr>
        <th>Model</th>
        <th>Total</th>
        <th>Base</th>
        <th>Poly</th>
        <th>Acc (%)</th>
        <th>Throughput (img/s)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>VI-Net18-Tiny</td>
        <td>1.86M</td>
        <td>0.68M</td>
        <td>1.18M</td>
        <td>88.62</td>
        <td>100798 ± 20506</td>
      </tr>
      <tr>
        <td>VI-Net18-Small</td>
        <td>2.84M</td>
        <td>2.18M</td>
        <td>0.66M</td>
        <td>92.66</td>
        <td>79307 ± 15576</td>
      </tr>
      <tr>
        <td>VI-Net18-Medium</td>
        <td>4.35M</td>
        <td>3.96M</td>
        <td>0.39M</td>
        <td>92.92</td>
        <td>71851 ± 13987</td>
      </tr>
      <tr>
        <td>VI-Net18-Large</td>
        <td>9.20M</td>
        <td>8.81M</td>
        <td>0.39M</td>
        <td>93.02</td>
        <td>62086 ± 11291</td>
      </tr>
      <tr class="border-top">
        <td>ResNet18</td>
        <td>11.24M</td>
        <td>11.24M</td>
        <td>-</td>
        <td>92.89</td>
        <td>66533 ± 12577</td>
      </tr>
    </tbody>
    <thead>
      <tr>
        <th colspan="6" class="table-header">CIFAR-100 (ResNet-34)</th>
      </tr>
      <tr>
        <th>Model</th>
        <th>Total</th>
        <th>Base</th>
        <th>Poly</th>
        <th>Acc (%)</th>
        <th>Throughput (img/s)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>VI-Net34-Tiny</td>
        <td>3.52M</td>
        <td>2.85M</td>
        <td>0.67M</td>
        <td>71.94</td>
        <td>42064 ± 7247</td>
      </tr>
      <tr>
        <td>VI-Net34-Small</td>
        <td>5.88M</td>
        <td>5.21M</td>
        <td>0.67M</td>
        <td>74.03</td>
        <td>37611 ± 6502</td>
      </tr>
      <tr>
        <td>VI-Net34-Medium</td>
        <td>14.60M</td>
        <td>14.20M</td>
        <td>0.40M</td>
        <td>74.66</td>
        <td>29285 ± 5791</td>
      </tr>
      <tr>
        <td>VI-Net34-Large</td>
        <td>19.32M</td>
        <td>18.92M</td>
        <td>0.40M</td>
        <td>74.78</td>
        <td>27862 ± 5358</td>
      </tr>
      <tr class="border-top">
        <td>ResNet34</td>
        <td>20.35M</td>
        <td>20.35M</td>
        <td>-</td>
        <td>74.75</td>
        <td>28253 ± 4290</td>
      </tr>
    </tbody>
  </table>
  <div class="table-caption">Performance Comparison for VI-Net. Total Parameters is the sum of Baseline Parameters (truncated ResNet) and Polynomial Parameters (generated expansions), measured in millions (M). Throughput is measured on the test split (batch size 256), averaged across 5 random seeds with standard deviation indicated.</div>
</div>

### Generalization Properties

One of the key theoretical advantages of VI-Net is its improved generalization properties. The spectral complexity of VI-Net is provably lower than that of the original network under certain choices of hyperparameters. Therefore, VI-Net has in theory improved generalization properties and our representation in the form of polynomials is in some sense more compact than the removed layers. 


## Conclusion

VI-Net represents a novel approach to neural network compression that combines insights from manifold learning and algebraic geometry. By replacing final layers with polynomial transformations derived from vanishing ideals, we achieve improvements in efficiency while maintaining accuracy.

Future work could explore:
- Application to larger models and datasets
- Integration with other compression techniques
- Theoretical analysis of the learned polynomial structures

For those interested in the technical details, you can find our full research paper [here](https://arxiv.org/abs/2502.15051).