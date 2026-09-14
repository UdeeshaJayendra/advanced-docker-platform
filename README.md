# TaskFlow — Advanced Docker Platform

**TaskFlow** is a production-style, multi-container task management platform built to demonstrate practical **Docker, Docker Compose, DevOps, container security, service networking, persistence, background processing, CI/CD, and failure recovery**.

The project focuses on running a complete application platform using **Docker Compose as the primary orchestration layer**, rather than simply containerizing a single application.

---

##  Project Overview

TaskFlow provides a web-based task management interface where users can:

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Change task status
* Track task statistics

Behind the frontend, multiple Docker containers work together to provide the complete platform.

The project demonstrates how application services can communicate through isolated Docker networks while maintaining persistent data, health monitoring, automatic recovery, and security controls.

---

##  System Architecture

```text
                         ┌──────────────────────┐
                         │     TaskFlow UI      │
                         │     React + Vite     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        Nginx         │
                         │ Reverse Proxy / Web  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Backend API      │
                         │   Node.js + Express  │
                         └───────┬────────┬─────┘
                                 │        │
                    ┌────────────┘        └─────────────┐
                    ▼                                   ▼
          ┌──────────────────┐                 ┌──────────────────┐
          │     MongoDB      │                 │      Redis       │
          │ Persistent Data  │                 │ Cache / Job Queue│
          └──────────────────┘                 └────────┬─────────┘
                                                        │
                                                        ▼
                                             ┌────────────────────┐
                                             │ Background Worker  │
                                             │     Node.js        │
                                             └─────────┬──────────┘
                                                       │
                                                       ▼
                                             ┌────────────────────┐
                                             │      Mailpit       │
                                             │  Email Testing     │
                                             └────────────────────┘
```

#  Project Evidence

Selected screenshots demonstrating the major project milestones are included below.

## Docker Backend Image
<img width="1575" height="537" alt="01-docker-backend-image-build" src="https://github.com/user-attachments/assets/082c5ea4-5ec8-4362-862e-e7d204bd1fa1" />

## Dashboard and CRUD Delete Workflow
<img width="1773" height="695" alt="image" src="https://github.com/user-attachments/assets/a2f52209-2daa-4ff9-a88d-bdcafb8474a3" />
<img width="1773" height="695" alt="image" src="https://github.com/user-attachments/assets/018a2750-0bb2-42a9-b110-d6cfb1a7319a" />

## Mailpit Background Email
<img width="1913" height="493" alt="09 taskflow-mailpit-test-email" src="https://github.com/user-attachments/assets/6598ac9e-2bf4-4bc9-acca-8707da32609c" />

## MongoDB Persistent Storage
<img width="1417" height="831" alt="03 docker-mongodb-volume-persistence" src="https://github.com/user-attachments/assets/9b6e3782-ee53-4d14-ae1b-cde75b0b7092" />

## Backend–MongoDB Connectivity
<img width="1312" height="245" alt="03-docker-compose-backend-mongodb-connected" src="https://github.com/user-attachments/assets/23fc7a12-9559-4ede-b1f2-b5be56174a02" />

## Complete Stack Health
<img width="1312" height="245" alt="03-docker-compose-backend-mongodb-connected" src="https://github.com/user-attachments/assets/f1a8be83-c102-46b9-b01d-5ba66863bfa5" />

## GitHub Actions Docker CI

<img width="1885" height="727" alt="3-taskflow-crud-delete-task png" src="https://github.com/user-attachments/assets/605bb1f3-9684-450c-a4aa-f5ea7d403a65" />
<img width="1602" height="678" alt="05  github-actions-docker-ci-success" src="https://github.com/user-attachments/assets/c66bddd7-a6bf-49d8-8d71-414711dd0675" />
<img width="1885" height="913" alt="06 github-actions-docker-ci-success" src="https://github.com/user-attachments/assets/b5167aa8-e2dc-437e-a8ad-7a03bdf8d2f5" />

## Frontend Multi-Stage Docker Build
<img width="1597" height="906" alt="04-docker-frontend-multi-stage-build" src="https://github.com/user-attachments/assets/35f252bd-8088-4337-bb73-9fb08555d8f8" />

## Container Failure Recovery

<img width="1407" height="250" alt="08 docker-container-failure-recovery" src="https://github.com/user-attachments/assets/b065f9f1-534f-4e35-9fc6-71904f706d6a" />



---

### Services

| Service  | Technology        | Purpose                        |
| -------- | ----------------- | ------------------------------ |
| Frontend | React + Vite      | Task management interface      |
| Nginx    | Nginx Alpine      | Web server and reverse proxy   |
| Backend  | Node.js + Express | REST API and application logic |
| MongoDB  | MongoDB 8         | Persistent task storage        |
| Redis    | Redis 8 Alpine    | Cache and background job queue |
| Worker   | Node.js           | Asynchronous job processing    |
| Mailpit  | Mailpit           | Local email testing            |

---

#  Application Features

## Task Management

TaskFlow implements a complete CRUD workflow:

* **Create** new tasks
* **Read** existing tasks
* **Update** task information
* **Delete** tasks
* Assign task statuses:

  * Pending
  * In Progress
  * Completed

The dashboard also provides task statistics so users can quickly see the current state of their workload.

---

##  TaskFlow Dashboard

The frontend provides a clean SaaS-style dashboard containing:

* Total task count
* Pending task count
* In-progress task count
* Completed task count
* Task creation form
* Task list
* Task editing
* Task deletion
* Platform infrastructure status

The interface communicates with the backend through the Nginx reverse proxy.

---

#  Docker Platform

Docker Compose is the core platform technology used to run the complete application.

The project contains separate containers for the major application components rather than running everything inside one container.

This provides:

* Service isolation
* Independent container lifecycle
* Internal service networking
* Independent health checks
* Restart policies
* Resource controls
* Persistent storage
* Easier troubleshooting

---

##  Multi-Stage Docker Builds

The frontend, backend, and worker use optimized Docker build processes.

The frontend uses a build stage to compile the React application and then serves the generated static files through Nginx.

The backend and worker use separate build and runtime stages to reduce unnecessary runtime components.

This helps produce cleaner and more secure runtime images.

---

#  Docker Networking

TaskFlow uses separate Docker networks:

```text
Public Network
    │
    ├── Frontend
    └── Backend

Internal Network
    │
    ├── Backend
    ├── MongoDB
    ├── Redis
    ├── Worker
    └── Mailpit
```
---

#  Data Persistence

MongoDB and Redis use Docker volumes so their data can survive container recreation.

```text
MongoDB
    ↓
mongodb_data volume

Redis
    ↓
redis_data volume
```

This allows the platform to recover containers without automatically losing stored application data.

---

#  Redis Background Processing

Redis is used for asynchronous background jobs.

For example, when a task is created:


This demonstrates an application architecture where background work does not have to be performed directly inside the main API request.

---

#  Background Worker

The TaskFlow worker is a separate Node.js container.

It continuously monitors the Redis job queue and processes background jobs.

The worker includes:

* Redis connectivity
* Background job processing
* Email notification handling
* Health checking
* Graceful shutdown
* Automatic container recovery

This provides practical experience with asynchronous application architecture.

---

#  Mailpit Email Testing

Mailpit is included as a development-only email testing service.

It allows TaskFlow to demonstrate email functionality without sending real emails.

When the worker completes a background job:

```text
Redis Job
   ↓
TaskFlow Worker
   ↓
Nodemailer
   ↓
Mailpit
```

The email can then be viewed through the Mailpit web interface.

#  Container Security

Security hardening is an important part of this project.

The application containers use several Docker security controls.

### Implemented controls

* Non-root container users
* Docker secrets
* MongoDB authentication
* Redis password authentication
* Read-only filesystems
* Temporary filesystem for `/tmp`
* Linux capability dropping
* `no-new-privileges`
* Internal Docker network
* Backend not directly exposed
* Runtime image hardening
* Container vulnerability scanning

Sensitive configuration such as database credentials is not stored directly in the Compose file.

Docker Compose uses service health conditions to control startup dependencies.

For example:

```text
MongoDB healthy
       ↓
Redis healthy
       ↓
Backend starts
       ↓
Frontend starts
```

This prevents application services from starting before their required dependencies are available.

---

#  Failure Recovery

The platform was tested by intentionally stopping individual containers.

The Docker restart policies allow services to recover automatically.

Tested scenarios include:

* Worker failure
* Backend failure
* Redis failure
* MongoDB failure
* Container restart
* Worker recovery
* Background job recovery
* Graceful shutdown

After recovery, the application was verified again through health checks and background job processing.

---

### Integration testing

The CI pipeline automatically starts the complete platform and verifies:

* Backend health
* Docker services
* Background job processing
* Worker functionality

---

#  Container Security Scanning

**Trivy** is integrated into GitHub Actions.

The CI pipeline scans:
The pipeline checks for:

* CRITICAL vulnerabilities
* HIGH vulnerabilities

This prevents known high-severity container vulnerabilities from being silently ignored during the build process.

---

# CI/CD — GitHub Actions

The project includes a GitHub Actions pipeline.

The workflow performs:

```text
Git Push
   ↓
Checkout Repository
   ↓
Create CI Secrets
   ↓
Validate Docker Compose
   ↓
Build Backend
   ↓
Build Frontend
   ↓
Build Worker
   ↓
Trivy Security Scanning
   ↓
Start Docker Platform
   ↓
Health Test
   ↓
Background Job Test
   ↓
Shutdown
```

This provides automated validation of the Docker platform whenever changes are pushed to GitHub.

---
---


#  Technology Stack

| Category          | Technologies        |
| ----------------- | ------------------- |
| Frontend          | React, Vite         |
| Web Server        | Nginx               |
| Backend           | Node.js, Express    |
| Database          | MongoDB             |
| Cache / Queue     | Redis               |
| Worker            | Node.js             |
| Email Testing     | Mailpit, Nodemailer |
| Containerization  | Docker              |
| Orchestration     | Docker Compose      |
| CI/CD             | GitHub Actions      |
| Security Scanning | Trivy               |
| Version Control   | Git, GitHub         |
---

## 👨‍💻 Author

**Udeesha Jayendra**
