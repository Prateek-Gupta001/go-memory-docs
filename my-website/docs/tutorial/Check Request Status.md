---
sidebar_position: 5
slug: /get-status
title: Get Job Status
description: Check the processing status of an asynchronous memory insertion job.
---

# Get Job Status

Because memory insertion is an asynchronous operation, the `Add Memory` endpoint returns a request ID rather than blocking until completion. You can use this endpoint to poll the system and verify whether a specific memory job is pending, actively processing, completed, or failed. Every requestID's status is valid for 24 hours after which it will respond with status 500. 

## HTTP Request

`GET /get_status/{reqid}`

### Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `reqid` | `string` | **Yes** | The unique Request ID (`ReqId`) returned by the `Add Memory` endpoint. |

---

## Response

Returns a JSON object detailing the current state of the memory insertion job.

### Success Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

| Field | Type | Description |
| :--- | :--- | :--- |
| `status` | `string` | The current state of the job. Possible values: `"pending"`, `"processing"`, `"success"`, `"failure"`. |
| `createdAt` | `string` | The timestamp of when the memory insertion job was initially created. |
| `error` | `string` | An error message detailing what went wrong. This field is omitted (`omitempty`) unless the status is `"failure"`. |

**Example Response (Success):**
```json
{
  "status": "success",
  "createdAt": "2026-03-03T21:44:15Z"
}
```

**Example Response (Failure):**
```json
{
  "status": "failure",
  "createdAt": "2026-03-03T21:44:15Z",
  "error": "Vector database timeout during embedding generation"
}
```

### Error Responses

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400 Bad Request` | `Bad Request` | The `{reqid}` parameter was missing or malformed in the URL path. |
| `500 Internal Server Error` | `We are experiencing some techincal issues right now. Please try again after some time!` | The backend failed to query the datastore for the job status. |

---

## Python SDK

You can check a job's status using the `get_status` method in the Go Memory Python client. The SDK automatically maps the JSON response into a `FullReqStatus` Pydantic model, converting `createdAt` to `created_at`.

### Usage

```python
import time
from gomemory import GoMemoryClient, Message, Role

client = GoMemoryClient(base_url="http://localhost:9000")

# 1. First, queue a memory insertion job
insert_res = client.add_memory(
    user_id="834f5933-9378-4826-aa8a-12ae5331317c", 
    messages=[Message(role=Role.USER, content="Test memory status")]
)
req_id = insert_res.req_id

# 2. Poll the status using the returned req_id
while True:
    status_res = client.get_status(req_id=req_id)
    print(f"Current Status: {status_res.status}")
    
    if status_res.status == "success":
        print(f"Job completed successfully. Created at: {status_res.created_at}")
        break
    elif status_res.status == "failure":
        print(f"Job failed with error: {status_res.error}")
        break
        
    # Wait before polling again
    time.sleep(2)
```