---
sidebar_position: 3
slug: /storage-architecture
---

# Storage Architecture

We use Redis for storing Core Memories and Qdrant (https://qdrant.tech) (a vector database) for storing General Memories. 

To understand why, we need to understand how these memories are retrieved. 

**General Memories** are vector search results derived from the query prepared by the memory retrieval request payload. Since vector search using cosine similarity is such a core operation in our memory layer, it was best to use Qdrant as our vector DB. It stores the text and the embeddings, executing the cosine similarity in Rust itself to output search results in a few milliseconds. 

**Core Memories** are always part of the response and don't need to be extracted selectively based on the user query. Since they must be retrieved on *every* memory request, we needed a solution with extremely fast read times. Redis is the industry standard for this, making it the obvious choice as our key-value store for a user's core memories. The user ID is the key, and the value is a list of core memories.



### Idempotency Checks

Each memory ID is a SHA hash of the `userID` + `memory_text`. This virtually guarantees that the exact same memory text cannot be stored twice for one user. 

If the memory text is even slightly different (which is highly plausible in LLM-generated memories), it will produce a different hash. However, the continual memory updation and pruning protocols ensure this never becomes an issue, as the memory state is constantly curated by thinking LLMs to replace outdated or conflicting context.

### Optimizing Retrieval Latency and Compute

Each Qdrant payload contains the `userID` as a Field Index, making user ID-based lookups happen in O(1) time.This is done to ensure strict isolation and speed.

Furthermore, Qdrant uses its gRPC interface as the default client in its Golang SDK. This makes overall retrieval significantly faster by completely stripping out the latency and compute overhead associated with serializing and decoding JSON payloads in REST.

### Retrieval Quality

Qdrant features built-in Hybrid RAG support via Reciprocal Rank Fusion (RRF). By natively supporting sparse vectors alongside dense embeddings and combining them with RRF, the system significantly increases output quality. We talk about this at length on the memory retrieval page.