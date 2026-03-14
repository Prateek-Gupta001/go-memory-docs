---
sidebar_position: 2
slug: /get-memory
title: Get Memory
description: Retrieve relevant memories for a user based on a specific query or conversation context.
---

# Get Memory

Retrieves relevant stored memories for a specific user. You can fetch memories by providing either a direct search string (`query`) or an array of conversation messages (`messages`) to extract context automatically. 

## HTTP Request

`POST /get_memory`

### Request Body

The request requires a JSON body containing the user identifier and the retrieval parameters. 

> **Important:** You must provide **exactly one** of either `query` or `messages`. Providing both or neither will result in a `400 Bad Request` error (and a `ValueError` in the Python SDK).

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | **Yes** | The unique identifier for the user whose memories are being retrieved. |
| `query` | `string` | No* | A direct text query used to find semantically similar memories. |
| `messages` | `array` | No* | A list of message objects representing the conversation history. Must contain at least one message if provided. |
| `threshold` | `float` | No | The similarity threshold for memory retrieval. Defaults to `0.65` if not provided. |
| `core` | `bool` | No | Decides if core memories are to be sent to the client. True by default unless false is passed. |


**Message Object Structure:**
If using the `messages` array, each item must be formatted as follows:
* `role` (string): The author of the message (e.g., `"user"`, `"model"`).
* `content` (string): The text body of the message.

**Example Request Payload:**
```json
{
  "userId": "user_123",
  "threshold": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "Need to buy a new cycle" 
    },
    {
      "role": "model",
      "content": "That sounds exciting! Do you have an itinerary yet?"
    }
  ],
}
```

---

## Response

Returns an array of memory objects that meet the semantic threshold criteria. 

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Memory Object Structure:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `memory_text` | `string` | The actual content of the stored memory. |
| `type` | `string` | The category of the memory. Returns either `"core"` or `"general"`. |
| `memory_id` | `string` | The unique identifier for this specific memory entry. |
| `userId` | `string` | The user ID associated with this memory. |

**Example Response:**
```json
[
  {
    "memory_text": "User is planning to buy a new cycle.",
    "type": "general",
    "memory_id": "mem_89abc...",
    "userId": "user_123"
  }
]
```

### Error Responses

The API will return standard HTTP status codes along with an error payload if the request fails.

* **`400 Bad Request`**: Returned if the JSON is malformed, neither `query` nor `messages` are provided, or if the `messages` array is empty.
* **`500 Internal Server Error`**: Returned if the backend storage mechanism fails to retrieve the memories.

---

## Python SDK

You can retrieve memories using the `get_memory` method in the Go Memory Python client. The SDK enforces strict validation, raising a `ValueError` if you attempt to send both `messages` and `query` simultaneously.

### Usage

**Example 1: Using a direct query**
```python
from gomemory import GoMemoryClient

client = GoMemoryClient(base_url="http://localhost:9000")

memories = client.get_memory(
    user_id="user_123",
    query="I like dogs",
    threshold=0.7
)

for memory in memories:
    print(f"Memory: {memory.memory_text}, Type: {memory.type}")
```

**Example 2: Using conversation messages**
```python
from gomemory import GoMemoryClient, Message, Role

client = GoMemoryClient(base_url="http://localhost:9000")

messages_context = [
    Message(role=Role.USER, content="Need to buy a new cycle"),
    Message(role=Role.MODEL, content="That sounds exciting! Do you have an itinerary yet?")
]

memories = client.get_memory(
    user_id="user_123",
    messages=messages_context,
    threshold=0.65
)

for memory in memories:
    print(f"Retrieved: {memory.memory_text}")
```