---
sidebar_position: 7
slug: /saving-api-tokens
---

# How Go Memory Saves You API Tokens

At their core, Large Language Models are stateless. To make an AI agent feel "smart" and personalized, developers historically resorted to the easiest method available: dumping the entire conversation history into the context window for every single prompt. 

While context windows have gotten massive, filling them up on every request is an incredibly sub-optimal way to build scalable applications. It spikes your latency and costs a fortune in LLM API fees.

Go Memory solves this by acting as an intelligent retrieval system and memory compression engine. It completely avoids sending entire conversation histories to the LLM with every request. Instead, it asynchronously extracts, stores, and injects only the most relevant information as needed, drastically reducing your input token usage.



### A Practical Example: The AI Coding Assistant

Let's say you are building an AI coding assistant. 

A user has been interacting with your agent for three weeks. Over that time, they have told the agent that they prefer Golang over Python, they use a Mac, they deploy on AWS using Docker, and they hate writing boilerplate test cases.

#### The Naive Approach (No Memory Layer)
To ensure the LLM remembers all these preferences, you have to pass the entire three-week conversation transcript into the prompt. You are sending thousands upon thousands of input tokens on every single API call, just so the LLM doesn't forget the user uses a Mac. Every time the user asks a simple question like, "How do I reverse a string?", you are paying for the LLM to read three weeks of unrelated chat history.

#### The Go Memory Approach
Go Memory has already extracted the actual facts from the conversation in the background using our continual memory updation protocol. The conversational fluff is discarded, and the actual state is persisted.

When the user makes a new request, Go Memory injects highly concentrated context:

1. **Core Memories:** Fetched instantly from Redis, the user's Core Memory profile simply holds: 
   ```json
   ["Prefers Golang", "Uses MacOS"]
   ```
2. **General Memories:** If the user asks a deployment or coding-related query, hybrid RAG fetches the relevant general memories from Qdrant:
   ```json
   ["Deploys on AWS via Docker", "Dislikes boilerplate testing"]
   ```

By combining these two tight arrays, you are providing exactly enough context to the LLM to curate and write the perfect code for the user. You achieve a highly personalized, stateful agent experience while only paying for a few dozen input tokens instead of thousands.