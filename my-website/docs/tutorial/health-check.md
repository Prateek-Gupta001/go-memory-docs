---
sidebar_position: 1
slug: /health-check
title: Health Check
description: Verify the operational status of the Go Memory server.
---

# Health Check

Verifies that the Go Memory server is running, healthy, and reachable. This is typically used for monitoring, load balancers, or deployment readiness checks.

## HTTP Request

`GET /health`

### Parameters

This endpoint does not accept any query parameters or request body.

## Response

This endpoint always returns a standard JSON object indicating a healthy state. It does not return API errors.

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

**Example Response:**

```json
{
  "message": "Server is healthy!"
}
```

---

## Python SDK

You can perform a health check using the Go Memory Python client. 

### Usage

```python
import requests
from gomemory import GoMemoryClient

# Initialize the client
client = GoMemoryClient(base_url="http://localhost:9000")

try:
    data = client.health_check()
    print(data["message"]) 
    # Output: "Server is healthy!"

except requests.exceptions.ConnectionError:
    print("Error: Server is unreachable. Please check if the server is running.")
except requests.exceptions.Timeout:
    print("Error: Server connection timed out.")
```

### Exceptions

When using the SDK, network-level exceptions may be raised if the server is down or unreachable. Handle standard `requests.exceptions` to properly manage these connection states.