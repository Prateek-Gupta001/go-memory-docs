---
sidebar_position: 6
slug: /embedding-microservice
---

# Embedding Microservice

Embedding generation is an extremely core/fundamental operation to any RAG pipeline, and Go Memory is no exception to this. With some amount of pain, we discovered that having a Go monolith for Go Memory, which would have embedding generation coupled into it as well, would be very unreasonable, architecturally unstable, and sub-optimal. 

Embedding generation is an extremely CPU-intensive process that blocks the Go runtime and impairs its ability to handle concurrent requests and memory jobs. A higher load on the server can absolutely crash or freeze the server, resulting in a state where all the embedding jobs are full and the embedding generation is throttling the CPU. 

This is not ideal. Plus, if we ever want to scale the embedding service independently, it can't be done if it is not decoupled from the Go monolith. 

Also, Go has a nascent ecosystem for ML-embedding libraries and is just not the right language for the job if you want to build an embedding service. 

The sheer importance and need of scaling embedding generation, alongside Go's unstable ecosystem of embedding libraries and models (or the lack thereof), led us to decouple the embedding generation part of Go Memory into a lightweight gRPC Python Embedding Microservice. 



**Why Python?** Python has an excellent array of libraries and great support for embedding models, making the job incredibly easy. 

**Why gRPC?**
gRPC protobufs remove the latency overhead of decoding and encoding JSON payloads in traditional REST APIs and was exactly the right tool for the job. 

### The Models

The embedding microservice for Go Memory holds two models:
* `BAAI/bge-small-en-v1.5` for creating dense embeddings
* `prithivida/Splade_PP_en_v1` for creating sparse embeddings

We chose `bge-small-en-v1.5` because of its high-quality semantic embeddings and also its high speed. It was the right combination of speed and accuracy (as compared to `bge-m3`, which was extremely large with a higher RAM footprint and longer embedding generation times). 

`Splade_PP_en_v1` is state-of-the-art (SOTA) for sparse embedding generation and features neural search, which can activate terms not explicitly present in the input. 

### Implementation Details

The embedding microservice takes in a list of strings and returns the corresponding list of dense and sparse embeddings. 

In the actual embedding microservice logic, we chose to use the `fastembed` library. The dense embedding model utilizes asymmetric retrieval, which is handled using a `_Query_` prefix attached to the strings (more on that in the **System Integrity, Optimizations & Idempotency** section).

> **Note:** The current embedding microservice is in beta, and updates are underway for more optimized CPU consumption and faster embedding generation. Watch out for updates on our [Docker Hub repository](https://hub.docker.com/repository/docker/prateek329/embedding-service).