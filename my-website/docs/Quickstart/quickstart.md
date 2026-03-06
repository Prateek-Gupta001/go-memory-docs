---
sidebar_position: 1
slug: /quickstart
---

# How to setup Go Memory

Welcome to the Go Memory quickstart guide. This tutorial will walk you through setting up the Go backend server and using the Python SDK to interact with it.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
* **Go:** Version `1.25.3` or higher.
* **Docker & Docker Compose:** Required to spin up the database and message broker dependencies.
* **Python:** Version `3.8` or higher (for the SDK).

---

## Part 1: Server Setup


### 1. Clone the Repository
Clone the `dev` branch of the Go Memory repository to your local machine:

```bash
git clone -b dev [https://github.com/Prateek-Gupta001/GoMemory.git](https://github.com/Prateek-Gupta001/GoMemory.git)
cd GoMemory
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory of the project. You need to configure your database credentials and your Gemini API key:

```env title=".env"
DB_PASSWORD=your_secure_password_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Infrastructure Services
Go Memory relies on external services (like Postgres, Redis, Qdrant, and NATS) defined in the `docker-compose.yml`. Spin them up in the background:

```bash
docker compose up -d
```

### 4. Install Go Dependencies
To download all the required packages listed in the `go.mod` file, run:

```bash
go mod tidy
```
*(Note: `go mod tidy` cleans up the `go.mod` file and securely downloads all the exact dependencies your project requires into your local module cache).*

### 5. Run the Server
Once the dependencies are installed and Docker containers are healthy, start the Go Memory server:

```bash
make run
```
You should see the Go Memory banner appear in your terminal, indicating the server is running and ready to accept requests on `http://localhost:9000`.

---

## Part 2: Python SDK Setup

Now that the server is running, you can interact with it using the official Python client. 

### 1. Install the SDK
Create a new directory for your Python AI agent project (or navigate to an existing one), set up a virtual environment, and install the `gomemory` package:

```bash
pip install gomemory
```

### 2. Write your First Script
Create a `main.py` file. The following script demonstrates how to initialize the client, create a new user, and add a conversation to their memory.

```python title="main.py"
from gomemory import GoMemoryClient, Role, Message
from gomemory.exceptions import APIError

# Initialize the client pointing to your local Go server
client = GoMemoryClient(base_url="http://localhost:9000")

try:
    # 1. Create a new user
    user = client.create_user()
    print(f"Created new user with ID: {user.user_id}")

    # 2. Define a conversation context
    messages = [
        Message(role=Role.USER, content="Hey man what's up! My name is Mario .. my brother's name is Wario!"),
        Message(role=Role.MODEL, content="I will remember that.")
    ]
    
    # 3. Add memory asynchronously
    response = client.add_memory(user_id=user.user_id, messages=messages)
    print(f"Memory Job Queued! Request ID: {response.req_id}")

except APIError as e:
    print(f"API Error: {e.status} - {e.message}")
```

---

## Next Steps

Now that you have successfully set up the server and pushed your first memory job, you can explore the rest of the endpoints (like checking job status or retrieving core memories).

Check out the full [API Reference](/docs/category/api-reference) for detailed information on all available functions, request parameters, and response structures.