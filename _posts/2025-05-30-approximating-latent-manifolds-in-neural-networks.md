---
layout: distill
title: "Approximating Latent Manifolds in Neural Networks via Vanishing Ideals"
date: 2025-05-30
description: Our ICML25 paper <b>Approximating Latent Manifolds in Neural Networks via Vanishing Ideals</b> introduces a novel approach to understanding data representation in neural networks through vanishing ideals. To characterize the structure of latent spaces, we scale vanishing ideal algorithms to handle high-dimensional data. The resulting algebraic characterizations can be used to replace standard network layers with more compact and efficient polynomial layers, leading to significant parameter reduction and potential improvements in inference speed while maintaining competitive performance.
bibliography: approximating-latent-manifolds-in-neural-networks.bib
publication_type: "ICML25"
paper_url: "https://arxiv.org/abs/2502.15051"
code_url: "https://github.com/ZIB-IOL/approximating-neural-network-manifolds"
tags: [deep-learning, algebraic-geometry, manifold-learning, computational-algebra]
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

## The Manifold Hypothesis

A foundational concept in understanding the efficacy of deep neural networks is the *Manifold Hypothesis* <d-cite key="fefferman2013testing"></d-cite>. This hypothesis posits that real-world, high-dimensional data (such as images or text) does not uniformly occupy the vastness of the space it lives in. Instead, it tends to concentrate on or near lower-dimensional *manifolds*. For example, while an image might be represented by thousands of pixel values, the set of images depicting a particular object class (e.g., "cats") might form a manifold with a much smaller inherent dimensionality, accounting for variations like pose, lighting, and individual appearance.

Neural networks are often conceptualized as learning complex functions that progressively transform these input data manifolds. Through successive layers, a network can reshape and disentangle these manifolds, ideally leading to representations in its *latent spaces* where the data becomes more structured or even linearly separable for tasks like classification <d-cite key="brahma_why_2016"></d-cite>. For instance, the initially intertwined manifolds of "cat" and "dog" images might be transformed such that, in a deeper layer, they occupy distinct, more easily distinguishable regions of the latent space.

To characterize these latent manifolds, we seek to find their algebraic descriptions. Fortunately, many manifolds encountered in such settings can be described as the zero set of a system of polynomial equations. Such a system formally defines an *algebraic variety*. For example, a sphere in three-dimensional Euclidean space, representing a simple manifold, is defined by all points $(x, y, z)$ that satisfy the single polynomial equation $x^2 + y^2 + z^2 - r^2 = 0$. This algebraic perspective is central to our work, which pursues two primary objectives. First, we investigate whether these complex latent manifolds can be accurately described by a relatively small set of simple polynomial equations. The aim is to see if concise algebraic descriptions can capture the essential geometry of class-specific data representations within neural networks. Second, we explore how such polynomial characterizations, if obtainable, can be leveraged for class separation. The core idea is that even if data points from different classes are not yet linearly separable in a given latent space, their underlying manifold structures, once captured by these polynomials, might offer a direct path to distinguishing them. This is particularly interesting from an efficiency standpoint, as it suggests the possibility of replacing multiple complex, dense layers with more structured and potentially more compact polynomial computations, a concept we will explore through *vanishing ideals*.

<div class="figure-container">
    <img src="/assets/img/blog_img/approximating-latent-manifolds-in-neural-networks/manifold_nn.png" alt="Manifold Neural Network" style="max-width: 80%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Neural networks transform input data manifolds. The output of a baseline NN (left) is often class probabilities. Our approach (right) considers the output of a truncated NN, where data from different classes may lie on distinct latent manifolds. We characterize these manifolds using polynomial equations derived from vanishing ideals.</div>
</div>

## An Algebraic View on Latent Manifolds

Recall that the latent manifolds we aim to characterize can often be described as *algebraic varieties*—the zero set of a system of polynomial equations. When we process data through a neural network up to a certain layer, the resulting activations (our points in latent space) can be viewed as a finite set of samples $\mathbf{Z} = \\{\mathbf{z}_1, \\dots, \mathbf{z}_m\\}$ drawn from such an underlying manifold. From this set of samples, we can seek to find its algebraic description by computing the *vanishing ideal* $\mathcal{I}(\mathbf{Z})$, which is the set of all polynomials $p$ such that $p(\mathbf{z}_i) = 0$ for all $\mathbf{z}_i \\in \mathbf{Z}$. These polynomials approximate the algebraic structure of the variety containing $\mathbf{Z}$, noting that a sample of the manifold is of course also only an approximation to the manifold itself.

While $\mathcal{I}(\mathbf{Z})$ itself contains infinitely many polynomials, Hilbert's Basis Theorem guarantees that it can be finitely generated. This means there exists a finite set of polynomials, known as *generators*, from which all other polynomials in the ideal can be derived through polynomial combinations and multiplications. The primary goal of vanishing ideal algorithms is to find such a set of generators, thereby providing a concise algebraic description of the data's underlying structure.

However, in practice, data from neural network latent spaces is often noisy, and we only have a finite number of samples. Attempting to find polynomials that vanish *perfectly* on these samples is typically impossible. Moreover, even if such polynomials were found, they would describe the specific sample set $\mathbf{Z}$ rather than generalizing to the underlying manifold $U$ from which $\mathbf{Z}$ was drawn. Therefore, instead of exact vanishing, we seek polynomials that *approximately vanish* on the data. That is, we look for polynomials $p$ such that $p(\mathbf{z}_i)^2 \\leq \\psi$ for all $\mathbf{z}_i \\in \mathbf{Z}$, where $\\psi > 0$ is a small tolerance. Algorithms such as the Oracle Approximate Vanishing Ideal (OAVI) algorithm <d-cite key="wirth_conditional_2024,wirth_approximate_2023"></d-cite> or the Approximate Buchberger-Möller (ABM) algorithm <d-cite key="limbeck_computation_2014"></d-cite> are designed to find such approximate generators, building upon foundational work <d-cite key="livni_vanishing_2013"></d-cite><d-cite key="HELDT20091566"></d-cite> and offering a robust way to characterize manifolds from noisy, finite samples. Applying these algorithms to the high-dimensional, large-scale data found in neural network latent spaces presents its own set of computational challenges, which we address with specific strategies.

Our first main goal is to characterize the structure of class-specific data manifolds as they are represented in the latent spaces of pre-trained neural networks. This involves applying vanishing ideal algorithms to the activation vectors produced by an intermediate layer of the network.

However, applying these algorithms directly to the latent space data presents significant computational challenges:
1.  **High Dimensionality:** Latent spaces, even in intermediate layers, can possess hundreds of dimensions. This poses a problem for standard vanishing ideal algorithms due to the combinatorial explosion in the number of potential monomial terms.
2.  **Large Sample Sizes:** Neural networks are typically trained on huge datasets, leading to a large number of activation vectors that need to be processed by the vanishing ideal algorithms.
3.  **Generator Overload and Quality:** Vanishing ideal algorithms can produce a huge number of generator polynomials. Many of these might be dense (involving many monomial terms) or lack the crucial property of being discriminative between different classes.

To address these challenges, we employ the following techniques:
*   **Stochastic Vanishing Ideal Computation:** Instead of processing all data points for a class at once, we use stochastic variants of the algorithms. These operate on random subsets (mini-batches) of the latent activations, significantly reducing computational load and memory requirements.
*   **Dimensionality Reduction:** Before applying vanishing ideal algorithms, we use PCA on the latent activations.
*   **Data Preprocessing for Numerical Stability:** To improve the numerical stability of polynomial computations, latent activations are rescaled (e.g., via a Tanh transformation to map them into the $[-1,1]^n$ hypercube). We also explore using reduced arithmetic precision, which can further alleviate computational demands.
*   **Selection of Discriminative and Sparse Generators through Pruning:** Despite the aforementioned optimizations, the initial set of computed generators can still be very large, resulting in a large number of polynomials to evaluate during inference. We address this by removing (or pruning) polynomials that are not discriminative of the class. For each class, we evaluate its candidate polynomials. A polynomial is deemed valuable if it is *discriminative*—meaning it effectively vanishes (evaluates to near zero) on samples of its own class while remaining significantly non-zero on samples from other classes. Polynomials that don't sufficiently meet this criterion are discarded. Alongside discriminative power, we prioritize *sparsity*: we favor polynomials with fewer monomial terms, as these are computationally more efficient to evaluate. Algorithms like ABM <d-cite key="limbeck_computation_2014"></d-cite> and OAVI <d-cite key="wirth_conditional_2024,wirth_approximate_2023"></d-cite> (especially when OAVI is used with the Frank-Wolfe algorithm) are good at producing such sparse polynomials. This dual-pruning strategy is essential: it not only selects for the most discriminative polynomials but also significantly reduces their total number and the complexity of their evaluation, leading to a compact and effective algebraic characterization of each class manifold.

<div class="figure-container">
    <img src="/assets/img/blog_img/approximating-latent-manifolds-in-neural-networks/pruning.png" alt="Pruning of Polynomials" style="max-width: 90%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Illustration of our pruning process. Starting with a full set of monomials and generated polynomials (columns), we first prune polynomials with low discriminative scores (e.g., $p_2, p_4$). Due to the induced sparsity, many monomial rows may become all-zero (e.g., $x, xy, x^3$), indicating they no longer contribute to any remaining polynomial. These rows are also effectively removed, leading to a compact representation using only essential monomials (e.g., $y, x^2, y^2$).</div>
</div>

## VI-Net: Replacing Network Layers with Polynomial Expansions

Now that we have established methods for approximating the class-specific manifolds in a neural network's latent space via their (approximate) vanishing ideal generators, we can make use of this algebraic insight. A primary goal is to enhance the efficiency of pre-trained neural networks. Deep networks, while powerful, often contain many computationally expensive layers. We propose replacing a significant portion of these final layers with a single, more structured *polynomial layer* built from the pruned generators discussed earlier.

The fundamental concept is based on how these polynomial generators can achieve class separation. Even if data classes are not linearly separable in the chosen latent space of the truncated network, their distinct manifold structures, captured by the polynomial generators $\\{p_i^k\\}_{i=1}^{n_k}$ for each class $k$, can lead to *polynomial separability*. We achieve this by constructing a transformation $G$ as follows. For any latent vector $\mathbf{z}$ (the output of the truncated network), this transformation is defined as:

$$ G(\mathbf{z}) = (|p_1^1(\mathbf{z})|, \dots, |p_{n_1}^1(\mathbf{z})|, \dots, |p_1^K(\mathbf{z})|, \dots, |p_{n_K}^K(\mathbf{z})|) $$

Here, $p_i^k$ is the $i$-th generator for class $k$, $K$ is the total number of classes, and $n_k$ is the number of generators for class $k$. The crucial property of this transformation is that if the input latent vector $\mathbf{z}$ belongs to a particular class $j$, its own generators $p_i^j(\mathbf{z})$ will evaluate to values very close to zero (as they *approximately vanish* on class $j$'s manifold). Conversely, the generators $p_i^l(\mathbf{z})$ for other classes $l \neq j$ will likely evaluate to significantly non-zero values. The output vector $G(\mathbf{z})$ thus has near-zero entries for the block of features corresponding to the true class $j$ and larger values for other blocks. This structure makes the transformed features linearly separable by a simple linear classifier. Our architecture that implements this approach is named *VI-Net*, and it represents our second main contribution.

The VI-Net training pipeline is as follows:
1.  **Truncate Network:** Start with a pre-trained neural network $\phi$ and truncate it at an intermediate layer $L'$.
2.  **Compute Vanishing Ideals:** For each class $k$, extract the latent activations $\mathbf{Z}^k = \phi_{L'}(\mathbf{X}^k)$ and compute a set of approximate vanishing ideal generators using the adapted algorithms described above. Here, $\mathbf{X}^k$ is the set of samples from class $k$.
3.  **Prune Generators:** Apply the pruning strategy to select the most discriminative and sparse polynomials for each class.
4.  **Construct Polynomial Layer:** Use the selected and pruned generators $\\{p_i^k\\}_{i=1}^{n_k}$ for all classes to implement the transformation $G(\mathbf{z})$ as defined above.
5.  **Fine-tune:** Append a simple linear classifier to the polynomial layer. Then, fine-tune the coefficients of the polynomials within the polynomial layer and the weights of the linear classifier using standard gradient descent.



This approach offers several potential benefits, primarily from an *efficiency perspective*:
*   **Parameter Reduction:** The polynomial layer, especially after pruning, can have significantly fewer parameters than the multiple convolutional or fully connected layers it replaces. This leads to smaller model sizes.
*   **Computational Speed-up:** Evaluating a typically sparse polynomial layer can be faster than executing several dense layers, potentially increasing inference throughput.

Our experiments demonstrate these benefits. For example, VI-Net variants built on ResNet architectures for CIFAR-10 and CIFAR-100 achieve classification accuracy comparable to the original, larger baseline networks, even when a substantial number of layers are replaced.

<div class="figure-container">
    <img src="/assets/img/blog_img/approximating-latent-manifolds-in-neural-networks/cifar100.png" alt="Performance of VI-Net on CIFAR-100" style="max-width: 80%;" class="zoomable" data-zoomable>
    <div class="figure-caption">Comparison on CIFAR-100 (ResNet-34) showing test accuracy versus the percentage of convolutional layers removed. Replacing layers with a simple linear head causes a sharp performance drop. VI-Net, using structured polynomials from vanishing ideals, maintains competitive accuracy far better than a layer of random monomials, demonstrating the importance of the algebraic structure discovered.</div>
</div>

VI-Nets can be significantly more parameter-efficient and exhibit higher throughput, as shown in the table below.

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th colspan="6" class="table-header">CIFAR-10 (ResNet-18)</th>
      </tr>
      <tr>
        <th>Model</th>
        <th>Total Params</th>
        <th>Base Params</th>
        <th>Poly Params</th>
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
  </table>
  <div class="table-caption">Performance of VI-Net variants. "Total Params" (Millions) = "Base Params" (truncated ResNet) + "Poly Params" (polynomial layer). VI-Nets achieve comparable accuracy to baselines with fewer parameters and often higher throughput.</div>
</div>

## Conclusion and Outlook

This research creates a practical connection between manifold learning in neural networks and computational algebra. By adapting vanishing ideal algorithms, we effectively characterize the algebraic structure of class-specific manifolds within deep network latent spaces. The proposed VI-Net architecture demonstrates that these algebraic characterizations can construct polynomial layers to replace standard network components. This in turn yields models that are more parameter-efficient and can achieve faster inference while maintaining competitive accuracy.

To reference this work in your research, please use the following citation:

```bibtex
@inproceedings{pelleriti2025approximatinglatentmanifoldsneural,
  title = {Approximating Latent Manifolds in Neural Networks via Vanishing Ideals},
  author = {Pelleriti, Nico and Zimmer, Max and Wirth, Elias and Pokutta, Sebastian},
  booktitle = {Forty-second International Conference on Machine Learning},
  year = {2025},
  url = {https://openreview.net/forum?id=WYlerYGDPL},
}
```