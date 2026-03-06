---
sidebar_position: 6
slug: /get-all-user-memories
title: Get All User Memories
description: Retrieve all core and general memories associated with a specific user.
---

# Get All User Memories

Fetches the complete set of memories stored for a given user. This endpoint returns a combined list of both `"core"` and `"general"` memory types.

## HTTP Request

`GET /get_all/{user_id}`

### Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | **Yes** | The unique identifier (`userId`) of the user whose memories you want to retrieve. |

---

## Response

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

Returns a JSON array consisting of memory objects.

**Memory Object Structure:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `memory_text` | `string` | The text content of the stored memory. |
| `type` | `string` | The classification of the memory. Returns either `"core"` or `"general"`. |
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
  },
  {
    "memory_text": "User's brother's name is Wario.",
    "type": "general",
    "memory_id": "28789095-0604-58ed-a2c0-11dc2a9af235",
    "userId": "5a9b4183-a19c-4a43-961f-1a6b36fce63c"
  }
]
```

### Error Responses

If the request fails, the API returns a JSON error payload containing a `Message` and an HTTP `Status` code. The underlying technical `Error` is not exposed to the client.

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400 Bad Request` | `Bad Request` | The `user_id` parameter was missing or could not be parsed properly from the URL path. |
| `500 Internal Server Error` | `Failed to get all user memories` | The server encountered an internal error while fetching the memories from the database. |