---
sidebar_position: 2
slug: /dual-memory-system
---

# Dual Memory System

### Why Go Memory has a dual memory architecture

Every user ID has two memory profiles:
1. **General Memory Profile:** This is the running memory of the user and on memory retrieval results, this changes based on the input.
2. **Core Memory Profile:** This is the bare basic stuff about the user... like their name, location, age, sex, job/career/profession. These are returned on every memory retrieval request.

Go Memory was initially designed to just have a single memory profile of the user, but upon further introspection, a dual memory profile made much more sense. 

If the user asks something related to their project or an event, it makes sense to get vector search results based on their query/messages and fetch them to the agent. 

But if a user asks "Where should I go out today for lunch?", the AI agent needs to know something core about the user that the user has assumed a person close to them would know. They might not even notice/register the fact that they did not tell the LLM about where they live... which is the most important thing required to answer that question. Go Memory comes to the rescue here since the user query: "Where should I go out today for lunch" (or any query for that matter... any memory retrieval request) would fetch the core memory profile of the user and the LLM can use the necessary context to answer the question. 

For this reason... to provide context to LLMs for basic questions that the user might not even realise a prior contextual injection is required, and to then bridge the gap between the ignorance/statelessness of the LLM and the expectation of the user from a smart AI Agent... we introduced the core memory feature in Go Memory. 

### How Retrieval Works

Each memory retrieval request in Go Memory returns two types of memories: Core Memories and General Memories. 

Core Memories are returned on each request and should be given to the LLM only once at the start of the conversation with a suitable system prompt in place. 

General Memories, on the other hand, differ based on the messages you provided to the LLM and are the returned vector search results from Qdrant.



### Memory Object Structure

When you retrieve memories from Go Memory, each memory is returned as a JSON object. Here is the structure:

```json
{
  "memory_text": "User prefers high-performance backend infrastructure.",
  "type": "General",
  "memory_id": "123e4567-e89b-12d3-a456-426614174000",
  "userId":    "789e1234-e89b-45g4-u897-123421997789"
}
```

memory_text: The actual memory of the user.

type: Categorizes the memory as either General or Core.

memory_id: The unique UUID of that specific memory.

userId: The ID of the user whose memory has been provided.


### Architecture Flow

```mermaid
flowchart LR
    %% Request
    A[Memory Retrieval Request]
    
    %% Server
    A --> B[Go Memory Server]
    
    %% Memory Sources
    B --> C[Core Memories]
    B --> D[General Memories]
    
    %% Storage Backends
    C -->|Fetch| E[(Redis)]
    D -->|Vector Search| F[(Qdrant)]
    
    %% Merge
    E --> G[Combined Memory Response]
    F --> G
    
    %% Output
    G --> H[Response Returned to User]

