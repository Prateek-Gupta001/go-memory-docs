---
sidebar_position: 5
slug: /memory-retrieval-process
---

# Memory Retrieval Process (sub-100ms CPU, sub-50ms GPU)

One of the most competitive advantages of using Go Memory is that the memory retrieval time is the fastest for any memory layer in the business that maintains an acceptable memory retrieval quality. The memory retrieval quality of Go Memory rivals that of mem0 while blowing them out of the water in terms of speed. The accuracy and quality are expected to bump up even further and beat mem0 in v2 of Go Memory, which will introduce concurrent scraping... allowing longer messages to be used for memory retrieval. 

Currently, it's strongly advised to use two-turn conversations (one user turn + one LLM turn) or at highest three-turn conversations to be sent to the Go Memory servers for retrieval. Go Memory prioritizes the last text that is provided by either the user or the LLM and cuts off the response at 500 characters. If your messages exceed that threshold, then any text or intent expressed by the user for an event won't be captured and won't be used for retrieval. Hence, two-turn conversations serve best for this area, and Go Memory retrieval speeds ensure that the reads are fast and barely stop the user-LLM conversation.

**This however is temporary as in the next v2 version Go Memory will support concurrent chunking which will handle long input prompts extremely well.**
Concurrent chunking would make Go Memory robust for longer input sequences thereby eliminating any need of recursive memory retrieval at every turn or sending shorter conversations only. 

### Retrieval Input Types

The Memory retrieval endpoint supports two types of inputs:

1. **Messages:** The user-LLM conversation. 
2. **UserQuery:** A user query or a text sentence that can be prepared by an LLM via tool calling for trying to know/find out about the memories of the user.

The `userQuery` method was designed mainly for LLMs to access Go Memory via tool-calling and is surprisingly effective. The `messages` endpoint is more of a hacky way which provides you with memories at every turn of the conversation whether the LLM wants it or not. The `userQuery` gives more control to the LLM to access memory whenever it needs to, though it adds latency (mainly on the LLM part since generating a tool call adds time to the otherwise already "time-consuming" LLM response generation). The `messages` method, on the other hand, is much faster. 

The developer needs to make this tradeoff: giving more control to the LLM (thereby adding roughly 1 second to the total response time by the LLM) or using the `messages` method to provide context to the LLM at every step of the conversation irrespective of whether the LLM needs or wants that context. 

**Our Recommendation:** Use the `userQuery` if you're already using a heavy, deep-thinking LLM like Gemini 3 Pro or the o1 model series by OpenAI. They already have high thinking times of around 10-12 seconds before responding, and another tool call over that adding just a second wouldn't change the experience too much. Use the `messages` method for all other use cases.

### The Retrieval Pipeline



The core mechanism for how memory retrieval works is to first create a `userQuery`. Even if you use the `messages` method, a user query is the thing that is prepared/extracted from it (if you use the `userQuery` method, then THAT userQuery IS the query that is used for hybrid RAG). 

It is then sent to the embedding engine for embedding generation. Upon receiving the embeddings from the embedding engine/microservice, those embeddings are fed into Qdrant for Hybrid RAG, and Redis is queried simultaneously to get the core memories of the user. 

The results are combined and then sent back to the user. 

Another important point is that CORE Memories of the user are ALWAYS sent to the LLM because they are deemed to be necessary for even vague or mundane questions that might be asked by the user. Hence, the developer can either fetch them once and then set `send_core_memories=false` (coming up in the next version of the SDK).

These memories can then be fed to the LLM to provide it the necessary context to answer the user queries. The speed with which memory retrieval happens in Go Memory positions it as a near-realtime memory system that can't hurt the flow of the conversation between the user and the LLM. The worst-case scenario is that the memory results are empty and an empty text is provided to the LLM, which has a near-zero effect on the performance of any chatbot system.

### The Importance of Core Memories

Another thing to point out is the sheer relevancy and importance the Core Memory feature provides to developers. Retrieving solely the core memories is a 10ms response-time endpoint (because they are stored in Redis, which has incredibly fast reads) which will be available in v2 of the Python SDK and also in the MCP server. 

Adding core memories of the user can never hurt the performance of any conversation and is basically free and reliable context for the LLM. Even if standard memory retrieval is not performed or outputs an empty list, injecting the core memories of the user will always improve the flow and scope of the conversation with the AI Agent at the expense of a one-time API request of 10ms (or even less if self-hosted).

### A Broader Vision

This moves us to a possible broader vision for Go Memory: to be the one-stop-shop for the memories of all the users interacting with chatbots ANYWHERE. 

Having a unique UUID for every user that can be reused/stored by the user themselves and then given to any chat-LLM interface that the user interacts with. A centralized Go Memory server would then allow any user to use/share their `userId` with an LLM-chatbot interface, which can then request the core memories (or general memories) of the user irrespective of the application. 

Since providing core memories of the user can never hurt the performance (unless for personal reasons, which is why we have delete endpoints for all types of memories), what you could have is a cohesive and personalized system for AI Agents to connect to the users using them on a deeper, personalized level.