---
sidebar_position: 4
slug: /create-user
title: Create User
description: Initialize a new user in the Go Memory registry and obtain a unique user ID.
---

# Create User

Creates a new user identity within the system. This endpoint generates and registers a new UUID, which serves as the foundational key for all subsequent memory operations. 

You must call this endpoint to obtain a valid `userId` before attempting to add, retrieve, or manage memories. Passing an unregistered or invalid `userId` to other memory endpoints will result in an Internal Server Error.

## HTTP Request

`POST /create/user`

### Request Parameters

This endpoint requires no query parameters and an empty request body.

---

## Response

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | The newly generated UUID registered to the new user. |

**Example Response:**
```json
{
  "userId": "834f5933-9378-4826-aa8a-12ae5331317c"
}
```

### Error Responses

The server swallows internal stack traces and only returns a sanitized message to the client. 

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `500 Internal Server Error` | `We are experiencing some troubles at the moment .. please try again after some time` | The system failed to generate or register the UUID within the internal datastore. |

---

## Python SDK

You can initialize a new user using the `create_user` method in the Go Memory Python client. The SDK automatically parses the JSON response and maps the camelCase `userId` to a snake_case property `user_id` on the returned `UserResponse` object.

### Usage

```python
from gomemory import GoMemoryClient
from gomemory.exceptions import APIError

client = GoMemoryClient(base_url="http://localhost:9000")

try:
    response = client.create_user()
    
    # The SDK parses the JSON and exposes the UUID as 'user_id'
    print(f"Successfully created user with ID: {response.user_id}")

except APIError as e:
    print(f"Failed to create user. Status Code: {e.status}")
    print(f"Message: {e.message}")
```