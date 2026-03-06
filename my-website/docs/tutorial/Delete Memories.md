---
sidebar_position: 8
slug: /delete-memory
title: Delete Memory
description: Remove specific core or general memories associated with a user.
---

# Delete Memory

Deletes specific memory entries for a user. Because core and general memories are stored and managed differently, this operation is split across two distinct endpoints. You must call the appropriate endpoint corresponding to the memory's `type`.

## HTTP Request

**Delete General Memories:**
`POST /delete_memory/general`

**Delete Core Memories:**
`POST /delete_memory/core`

### Request Body

Both endpoints accept the exact same JSON request body payload. You can delete multiple memories in a single request by providing an array of memory IDs.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | **Yes** | The unique identifier (`userId`) of the user who owns the memories. |
| `memoryId` | `array` | **Yes** | A list of strings representing the unique IDs (`memory_id`) of the memories to be deleted. |

**Example Request Payload:**
```json
{
  "userId": "user_123",
  "memoryId": [
    "79b9c8ec-0339-11f1-a602-00155d2a2ba4",
    "8ab9c8ec-0440-11f1-a602-00155d2a2bb5"
  ]
}
```

---

## Response

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

Returns a simple confirmation message upon successful deletion.

**Example Response:**
```json
{
  "message": "Deletion was successful"
}
```

### Error Responses

The API will return standard HTTP status codes along with a brief error message if the operation fails.

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400 Bad Request` | `Bad request` | The JSON payload was malformed, missing required fields, or could not be processed. |
| `500 Internal Server Error` | `Deletion failed` | The server encountered a backend error while attempting to remove the records from the datastore. |