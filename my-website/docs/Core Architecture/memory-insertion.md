---
sidebar_position: 4
slug: /memory-insertion-process
---

# Memory Insertion Process

A lot of thought went into engineering a robust memory insertion process because each memory insert for a user can contain information that might contradict an existing memory of the user. This memory pruning and updation protocol is at the heart of what makes Go Memory so effective. 

Go Memory ensures that when new memories or facts about the user are added, existing ones that might be outdated or contradictory are removed. 

How do we ensure that? Through the Continual Memory Updation Protocol. But let's first discuss how memory insertion happens from the moment the request arrives at the Go Memory server. 

### The Insertion Request

First, a list of messages, which is basically a normal conversation between an LLM and the user, is sent to the server along with the `userId`. 

Here is what the JSON payload for a memory insertion request looks like:

```json
{
  "userId": "user_12345",
  "messages": [
    {
      "role": "user",
      "content": "I am moving from New York to London next month for a new software engineering role."
    },
    {
      "role": "model",
      "content": "That is a big move! Congratulations on the new role in London."
    }
  ]
}
```

To make sure that the same request is not processed twice, Go Memory has strict idempotency checks in place, discussed at length in the **System Integrity, Optimizations & Idempotency** section.

### The Continual Memory Updation Protocol

The core of the continual memory updation protocol relies on a smart-thinking LLM evaluating **Existing Related Memories** (related to the new context) alongside **The New Memories** that the user wants to insert but are not yet in the DB. 

You want the LLM to look at the existing memories and the new conversation to determine the following:
1. Are there any new memory texts/facts that can/should be inserted into the DB?
2. If **No**, then SKIP memory insertion altogether.
3. If **Yes**, are they contradictory to the existing facts and memories of the user?
    * *If No:* Insert new memory facts. 
    * *If Yes:* DELETE contradictory facts and INSERT new updated facts. 

To actually implement this protocol, two separate LLM API calls are required:

#### 1. Query Expansion and Gatekeeping

The first LLM API call is used for the purpose of query expansion (the default model for this is `gemini-3-flash-preview` without thinking). To get the relevant existing memories of the user, you need to retrieve them via hybrid RAG (which is at the core of our memory retrieval pipeline). Doing that requires a query to be inserted into Qdrant. 

The first LLM API call achieves that by looking at the user + LLM conversation and generating an intent-heavy, keyword-based query. The embedding for this query is then prepared via the embedding engine (discussed at length in **Embedding Generation**). The embedding engine generates both the sparse AND the dense embedding of the query, which is then ingested into Qdrant to retrieve existing memories of the user. 

This first LLM API call also acts as a check for whether memory insertion is required or not. The LLM is given the conversation and is instructed to return a special keyword (`"SKIP"`). When `"SKIP"` is generated, it cuts the pipeline short, saving an API call and further memory introspection.

#### 2. Memory Pruning and Updation

If memory insertion IS required, and existing memories are provided (though that is not strictly necessary since there might be none related to the new insertions), the next LLM API call is triggered. 

This call (the default model for this is `gemini-3-flash-preview` on thinking level high) is given the necessary context + the system prompt (which can be found on GitHub) and it performs the memory pruning for us. 

It generates a JSON response based on a predefined schema detailing the actions the system needs to take (mainly on Qdrant). These actions are basically INSERTS and DELETES.

**Insert Action:**
An insert action does not have a `target_memory_id`, just the textual payload—the actual memory the LLM has extracted from the conversation to be inserted into the DB.
```json
{
  "action_type": "INSERT",
  "payload": "User lives in London, UK.",
  "target_memory_id": null
}
```

**Delete Action:**
A delete action does not have a textual payload, just the memory ID. Notice that the memory ID is not a UUID but a simple integer ID. This is due to prompt-based optimization that happens behind the scenes, discussed at length in the **System Integrity, Optimizations & Idempotency** section.
```json
{
  "action_type": "DELETE",
  "payload": null,
  "target_memory_id": 2
}
```

### Final Execution

This JSON response from the second LLM API call is then parsed, and the necessary adjustments (deletions and insertions) are made in Qdrant. The memory texts are extracted from the JSON payload, sent to the embedding engine for embedding generation, and then inserted into Qdrant. 

Finally, if any core memories are selected or queued for modification, they are sent to the Redis layer for their necessary pruning or insertion.s