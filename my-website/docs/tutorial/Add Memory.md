---
sidebar_position: 3
slug: /add-memory
title: Add Memory
description: Asynchronously queue a conversation context for memory insertion and processing.
---

# Add Memory

Submits a conversation history to be processed and stored as memory. 

This is an **asynchronous** endpoint. Instead of blocking while the memory is processed, it immediately returns a `ReqId` (Request ID). You can use this ID to poll the status of the memory insertion job.

This endpoint is idempotent. If you submit the exact same messages for the same user, the server will recognize it as a duplicate job and return the existing `ReqId` with a `200 OK` status, preventing duplicate memory entries.

## HTTP Request

`POST /add_memory`

### Request Body

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | **Yes** | The unique identifier for the user. |
| `messages` | `array` | **Yes** | An array of message objects representing the conversation to be memorized. Must contain at least one message. |

**Message Object Structure:**
* `role` (string): The author of the message (e.g., `"user"`, `"model"`).
* `content` (string): The text content of the message.

**Example Request Payload:**
```json
{
  "userId": "4bdc091b-eaa5-4d42-bbba-3cd798b9d294",
  "messages": [
    {
      "role": "user",
      "content": "My son's name is Todd the Great"
    },
    {
      "role": "model",
      "content": "Sure let me search it up!?."
    }
  ]
}
```

---

## Response

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

| Field | Type | Description |
| :--- | :--- | :--- |
| `ReqId` | `string` | A deterministic UUID representing the background job. |
| `Msg` | `string` | A status message indicating if the job was newly queued or already existed. |

**Example Response (New Job):**
```json
{
  "ReqId": "a94a8fe5-ccb1-9ba6-1c4c-0873d391e987",
  "Msg": "Memory Insertion Job has been queued for insertion!"
}
```

**Example Response (Duplicate/Idempotent Job):**
```json
{
  "ReqId": "a94a8fe5-ccb1-9ba6-1c4c-0873d391e987",
  "Msg": "Memory Insertion Job is already queued or processed successfully!"
}
```

### Error Responses

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400 Bad Request` | `Request format is wrong` | The JSON payload could not be decoded or is malformed. |
| `400 Bad Request` | `No messages provided` | The `messages` array was empty. At least one message is required. |
| `500 Internal Server Error` | `Failed to queue memory insertion.` | The server encountered an internal error while trying to submit the job to the worker queue. |

---

## Python SDK

You can queue memory processing using the `add_memory` method in the Go Memory Python client.

### Usage

```python
from gomemory import GoMemoryClient, Message, Role

client = GoMemoryClient(base_url="http://localhost:9000")

user = client.create_user()
    
messages = [
    Message(role=Role.USER, content="Hey man what's up! My name is mario .. my brother's name is Wario!"),
    Message(role=Role.ASSISTANT, content="I will remember that.")
]

response = client.add_memory(user_id=user.user_id, messages=messages)

print(f"Request ID: {response.reqId}")
print(f"Status: {response.msg}")
```