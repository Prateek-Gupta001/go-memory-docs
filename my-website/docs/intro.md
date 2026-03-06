---
sidebar_position: 1
slug: /
---

# Introduction to Go Memory

Go Memory is a high performance memory layer for AI Agents. We set out to build the fastest memory layer that we can build all the while maintaining high quality retrieval. 

While many existing memory solutions rely on complex Graph Databases or heavy read-time orchestration, Go Memory operates on a contrarian architectural philosophy: **High-quality inserts, dumb reads.** By shifting the computational burden of memory conflict resolution to the insertion phase via asynchronous background workers, retrieval is reduced to a lightning-fast hybrid RAG lookup. Even running on CPU boasts sub-100ms latency for memory retrieval.

### The Trade-off: Speed vs. Exhaustion

Go Memory is built for real-time agentic workflows where having memory is critical all the while optimizing for speed.
* On standard hardware (e.g., Ryzen 5 CPU), Go Memory consistently achieves **sub-100ms retrieval latency** (sub-50ms with GPU acceleration for embeddings).
* Go Memory was built to compete with existing memory solutions such as Mem0 without the overhead of Graph DBs using hybrid RAG. 
* If you need ultra-low latency while maintaining highly competitive retrieval quality (90-95% parity with slower systems), Go Memory is the optimal infrastructure.

### Core Architecture

Go Memory achieves this performance and quality through a robust, enterprise-grade stack:

* **Dual Memory Architecture:** Every user maintains two distinct profiles:
    * **Core Memory:** Long-term, persistent traits and foundational knowledge. (Cached via **Redis**).
    * **Running Memory:** Shorter-term, contextual events and interactions.
* **Continual Updation Protocol:** Upon insertion, an LLM evaluates the new memory against existing context (fetched via hybrid RAG). It actively prunes contradictions and replaces outdated facts, outputting a constrained JSON payload for precise database mutations.
* **Asynchronous Processing:** We believe that each memory job is extremely important and hence Memory jobs are reliably queued and delivered using **NATS-Jetstream**, ensuring fault tolerance and zero data loss during server outages.
* **Hybrid Search:** Utilizing **Qdrant** alongside a highly optimized Python gRPC microservice for generating both dense and sparse embeddings.

### Production Ready

Go Memory is designed to be self-hosted and observed in production environments from day one. The system includes full OpenTelemetry (Otel) coverage, exporting metrics and traces to **Prometheus** and **Jaeger**, with out-of-the-box **Grafana** visualization. It also features a native **MCP (Model Context Protocol) Server**, allowing LLMs to interface with the memory store directly.

---

**Ready to get started?** Head over to the [Quickstart](/docs/quickstart) to spin up the server and add your first memory.