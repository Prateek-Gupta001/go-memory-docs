---
sidebar_position: 7
slug: /get-core-memories
title: Get Core Memories
description: Retrieve only the core memories associated with a specific user.
---

# Get Core Memories

Fetches the "core" memories stored for a given user. Unlike the general retrieval endpoints, this strictly returns memories that have been classified as foundational or highly persistent (`"type": "core"`).

## HTTP Request

`GET /get_core/{user_id}`

### Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | **Yes** | The unique identifier (`userId`) of the user whose core memories you want to retrieve. |

---

## Response

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

Returns a JSON array consisting solely of core memory objects. 

**Memory Object Structure:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `memory_text` | `string` | The text content of the stored memory. |
| `type` | `string` | The classification of the memory. For this endpoint, it will always be `"core"`. |
| `memory_id` | `string` | The unique identifier for this specific memory entry. |
| `userId` | `string` | The user ID associated with this memory. |

**Example Response:**

```json
[
  {
    "memory_text": "User's name is Mario.",
    "type": "core",
    "memory_id": "654c4ca6-1079-11f1-bd71-00155d0d397d",
    "userId": "5a9b4183-a19c-4a43-961f-1a6b36fce63c"
  }
]
```

### Error Responses

If the request fails, the API returns a standard HTTP status code along with a brief error message. 

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400 Bad Request` | `Bad Request` | The `{user_id}` parameter was missing or could not be parsed from the URL path. |
| `500 Internal Server Error` | `Oops something went wrong! Please try again later!` | The server encountered an internal error while fetching the core memories from the database. |