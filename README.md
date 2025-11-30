# 📚 Bookworm - Serverless Bookstore 

A modern, cloud-native bookstore platform built on AWS serverless architecture. This backend provides a complete e-commerce solution with user authentication, book management, shopping cart, order processing, and automated email notifications.

### **Backend**

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)]()
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)]()
[![Serverless Framework](https://img.shields.io/badge/Serverless-Framework-red?logo=serverless)]()

### **Frontend**

[![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)]()
[![Vite](https://img.shields.io/badge/Vite-Bundler-purple?logo=vite)]()
[![CloudFront](https://img.shields.io/badge/CloudFront-CDN-lightblue?logo=amazoncloudfront)]()

### **AWS Services**

[![Lambda](https://img.shields.io/badge/AWS-Lambda-purple?logo=aws-lambda)]()
[![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue?logo=amazondynamodb)]()
[![API Gateway](https://img.shields.io/badge/API%20Gateway-REST-yellow?logo=amazonapigateway)]()
[![S3](https://img.shields.io/badge/S3-Storage-lightgrey?logo=amazons3)]()
[![Cognito](https://img.shields.io/badge/Cognito-Auth-blue?logo=amazonaws)]()
[![SES](https://img.shields.io/badge/SES-Email-orange?logo=amazonaws)]()
[![SQS](https://img.shields.io/badge/SQS-Messaging-green?logo=amazonsqs)]()

---

---

## 🏗️ Architecture Overview

This application is built using a **100% serverless, cloud-native architecture** on AWS, ensuring:

- ✅ **Zero server management** - No EC2 instances, containers, or infrastructure to maintain
- ✅ **Auto-scaling** - Handles traffic from 1 to millions of requests seamlessly
- ✅ **Pay-per-use pricing** - Only pay for actual usage, no idle server costs
- ✅ **High availability** - Built on AWS managed services with multi-AZ redundancy
- ✅ **Developer productivity** - Focus on business logic, not infrastructure

### Core Technologies

| Component          | Technology           | Purpose                               |
| ------------------ | -------------------- | ------------------------------------- |
| **Compute**        | AWS Lambda           | Serverless function execution         |
| **API**            | API Gateway          | RESTful API endpoints with CORS       |
| **Database**       | DynamoDB             | NoSQL database with on-demand scaling |
| **Authentication** | AWS Cognito          | User management & OAuth 2.0           |
| **Storage**        | Amazon S3            | Book cover images & email templates   |
| **CDN**            | CloudFront           | Global content delivery network       |
| **Messaging**      | Amazon SQS           | Asynchronous email queue processing   |
| **Email**          | Amazon SES           | Transactional email delivery          |
| **Secrets**        | Secrets Manager      | Secure credential storage             |
| **IaC**            | Serverless Framework | Infrastructure as Code                |
| **CI/CD**          | GitHub Actions       | Automated deployment pipeline         |

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Database Schema](#-database-schema)
3. [Authentication & Authorization](#-authentication--authorization)
4. [Email System & SQS Integration](#-email-system--sqs-integration)
5. [S3 Presigned URLs](#-s3-presigned-urls)
6. [API Endpoints](#-api-endpoints)
7. [CI/CD Pipeline](#-cicd-pipeline)
8. [Environment Variables](#-environment-variables)
9. [Cost Optimization](#-cost-optimization)

---

## ✨ Features

### User Features

- 🔐 **Secure Authentication** - Google OAuth 2.0 via AWS Cognito
- 📖 **Book Browsing** - Search, filter, and sort books by category and price
- 🛒 **Shopping Cart** - Add, update, remove items with real-time calculations
- 📦 **Order Management** - Place orders and track order status
- 📧 **Email Notifications** - Automated order confirmations and status updates
- 👤 **User Profiles** - Manage personal information and view order history

### Admin Features

- ➕ **Book Management** - Create, update, delete books with cover images
- 🖼️ **Image Upload** - S3 upload via presigned URLs
- 📊 **Order Administration** - View all orders and update order status
- 🔑 **Role-Based Access** - Admin-only endpoints protected by RBAC

### Technical Features

- ⚡ **High Performance** - Lambda cold starts < 1s, API response < 200ms
- 🌍 **Global CDN** - CloudFront delivers content from edge locations
- 🔄 **Async Processing** - SQS queues handle email sending without blocking
- 📈 **Auto-Scaling** - DynamoDB and Lambda scale automatically with demand
- 🛡️ **Security** - JWT tokens, HTTP-only cookies
  s

---

## 🏗️ Architecture Deep Dive

### System Architecture

![System Architecture](./images/system-architecture-bookworm.png)

```
┌─────────────┐
│   Client    │ (Browser/Mobile App)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────────────────────────┐
│               CloudFront Distribution                    │
│  ┌──────────────────┐        ┌──────────────────┐      │
│  │  Frontend SPA    │        │  Book Cover CDN  │      │
│  │  (S3 Origin)     │        │  (S3 + OAI)      │      │
│  └──────────────────┘        └──────────────────┘      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌─────────────────┐
          │  API Gateway    │ (REST API + CORS)
          └────────┬────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │  Books   │ │  Orders  │  ... (22 Lambda Functions)
│  Lambda  │ │  Lambda  │ │  Lambda  │
└─────┬────┘ └─────┬────┘ └─────┬────┘
      │            │            │
      ▼            ▼            ▼
┌─────────────────────────────────────────┐
│           AWS Cognito User Pool         │
│  ┌────────────────────────────────┐    │
│  │  Google OAuth 2.0 Provider     │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
      │            │            │
      ▼            ▼            ▼
┌─────────────────────────────────────────┐
│           DynamoDB Tables               │
│  • Users      • Books                   │
│  • Cart       • Orders                  │
│  • Order Items                          │
└─────────────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ S3       │ │ SQS      │ │ SES      │
│ Buckets  │ │ Queue    │ │ Email    │
└──────────┘ └──────────┘ └──────────┘
```

### Request Flow

1. **User Request** → CloudFront → API Gateway
2. **Authentication** → Auth Middleware validates JWT from HTTP-only cookie
3. **Authorization** → RBAC Middleware checks user role for admin endpoints
4. **Business Logic** → Lambda function processes request
5. **Service Layer** → Services interact with AWS resources (DynamoDB, S3, etc.)
6. **Response** → JSON response with appropriate status code
7. **Async Tasks** → Critical path returns immediately, emails queued to SQS

![Home](./images/home-screen.png)
![Book Details](./images/book-details-pg.png)
![Cart Screen](./images/cart-screen.png)
![Checkout](./images/checkout.png)
![Order Details](./images/order-details.png)
![Customer Dashboard](./images/customer-dashboard.png)
![Admin Order Management](./images/admin-order-mng.png)

### Lambda Functions (22 Total)

| Category       | Functions                                                                                   | Description                                       |
| -------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Auth** (3)   | `authCallback`, `authLogout`, `authRefresh`                                                 | OAuth callback, session management, token refresh |
| **Users** (2)  | `getProfile`, `updateUserProfile`                                                           | User profile management                           |
| **Books** (6)  | `getAllBooks`, `getBookById`, `createBook`, `updateBook`, `deleteBook`, `generateUploadUrl` | Book CRUD + presigned URL generation              |
| **Cart** (5)   | `getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`                     | Shopping cart operations                          |
| **Orders** (5) | `createOrder`, `getOrdersByUser`, `getOrderById`, `getAllOrders`, `updateOrderStatus`       | Order lifecycle management                        |
| **Email** (1)  | `processEmailQueue`                                                                         | SQS-triggered email processor                     |

---

## 🗄️ Database Schema

### DynamoDB Table Design

All tables use **on-demand billing** (PAY_PER_REQUEST) for cost optimization and auto-scaling.

#### 1. **Books Table**

```
Primary Key:
  - PK: id (String) - UUID v4

Global Secondary Indexes (4):
  ├── entityType-updatedAt-index
  │   ├── PK: entityType (always "BOOK")
  │   └── SK: updatedAt (ISO timestamp)
  │   └── Use: Get all books sorted by newest
  │
  ├── entityType-price-index
  │   ├── PK: entityType (always "BOOK")
  │   └── SK: price (Number)
  │   └── Use: Get all books sorted by price
  │
  ├── category-updatedAt-index
  │   ├── PK: category (String)
  │   └── SK: updatedAt (ISO timestamp)
  │   └── Use: Filter by category, sort by newest
  │
  └── category-price-index
      ├── PK: category (String)
      └── SK: price (Number)
      └── Use: Filter by category, sort by price

Attributes:
  - title, titleLower (for case-insensitive search)
  - author, authorLower
  - category (Fiction, Non-Fiction, Science, etc.)
  - description, isbn, publisher
  - publishedYear, language, pageCount
  - price, stockQuantity
  - coverImageKey, coverImageUrl (generated)
  - createdAt, updatedAt
```

#### 2. **Users Table**

```
Primary Key:
  - PK: userId (String) - Cognito sub (UUID)

Global Secondary Indexes (1):
  └── email-index
      ├── PK: email (String) - Unique
      └── Use: Find user by email, admin role check

Attributes:
  - email (unique)
  - name
  - role (ADMIN | CUSTOMER)
  - profilePicture (optional)
  - createdAt, updatedAt
```

#### 3. **Cart Table**

```
Composite Primary Key:
  - PK: userId (String)
  - SK: bookId (String)

No GSIs needed - All queries by userId

Attributes:
  - quantity (Number)
  - addedAt (ISO timestamp)

Note: Book details fetched at runtime via join
```

#### 4. **Orders Table**

```
Primary Key:
  - PK: orderId (String) - UUID v4

Global Secondary Indexes (2):
  ├── userId-createdAt-index
  │   ├── PK: userId (String)
  │   └── SK: createdAt (ISO timestamp)
  │   └── Use: Get user's orders, newest first
  │
  └── status-createdAt-index
      ├── PK: status (String)
      └── SK: createdAt (ISO timestamp)
      └── Use: Admin view by status (PENDING, PROCESSING, etc.)

Attributes:
  - userId, userEmail, userName
  - status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
  - totalAmount (Number)
  - shippingAddress (Object)
  - createdAt, updatedAt
  - statusHistory (Array of status changes)
```

#### 5. **Order Items Table**

```
Composite Primary Key:
  - PK: orderId (String)
  - SK: bookId (String)

No GSIs needed - Query by orderId to get all items

Attributes:
  - title (snapshot at order time)
  - author (snapshot)
  - price (snapshot)
  - quantity (Number)
  - subtotal (Number)

Note: Stores book details at order creation time
      to preserve historical data if book is updated/deleted
```

### Access Patterns & Query Optimization

| Pattern               | Table       | Index                      | Query                                              |
| --------------------- | ----------- | -------------------------- | -------------------------------------------------- |
| Get all books         | Books       | entityType-updatedAt-index | Query by entityType="BOOK"                         |
| Get books by category | Books       | category-updatedAt-index   | Query by category                                  |
| Search books          | Books       | entityType-updatedAt-index | Query + FilterExpression on titleLower/authorLower |
| Get user by email     | Users       | email-index                | Query by email                                     |
| Get user cart         | Cart        | Primary Key                | Query by userId                                    |
| Get user orders       | Orders      | userId-createdAt-index     | Query by userId, ScanIndexForward=false            |
| Get orders by status  | Orders      | status-createdAt-index     | Query by status (admin)                            |
| Get order items       | Order Items | Primary Key                | Query by orderId                                   |

---

## 🔐 Authentication & Authorization

### OAuth 2.0 Flow with AWS Cognito

```
┌──────────┐                                  ┌──────────┐
│  User    │                                  │  Google  │
└────┬─────┘                                  └────┬─────┘
     │                                             │
     │ 1. Click "Login with Google"                │
     ├─────────────────────────────────────────────▶
     │                                             │
     │ 2. Redirect to Google OAuth                 │
     │◀────────────────────────────────────────────┤
     │                                             │
     │ 3. User grants permission                   │
     ├─────────────────────────────────────────────▶
     │                                             │
     │ 4. Authorization code                       │
     │◀────────────────────────────────────────────┤
     │                                             │
┌────▼──────────────────────────────────────┐     │
│  Cognito User Pool                        │     │
│  ┌────────────────────────────────────┐  │     │
│  │ 5. Exchange code for tokens        │  │     │
│  │    - Access Token                  │  │     │
│  │    - ID Token                      │  │     │
│  │    - Refresh Token                 │  │◀────┤
│  └────────────────────────────────────┘  │
└────┬──────────────────────────────────────┘
     │
┌────▼──────────────────────────────────────┐
│  authCallback Lambda                      │
│  ┌────────────────────────────────────┐  │
│  │ 6. Validate tokens                 │  │
│  │ 7. Get user info from ID token     │  │
│  │ 8. Create/update user in DynamoDB  │  │
│  │ 9. Generate custom JWT             │  │
│  │ 10. Set HTTP-only cookies          │  │
│  └────────────────────────────────────┘  │
└────┬──────────────────────────────────────┘
     │
┌────▼─────┐
│  Client  │ (Cookies stored securely)
└──────────┘
```

### Token Management

#### Access Token (Cognito)

- **Lifetime**: 1 hour
- **Storage**: HTTP-only cookie
- **Purpose**: API authentication
- **Validation**: JWT signature verification

#### Refresh Token (Cognito)

- **Lifetime**: 30 days
- **Storage**: HTTP-only cookie
- **Purpose**: Renew access token
- **Usage**: `/auth/refresh` endpoint

#### Custom JWT

- **Includes**: userId, email, role
- **Purpose**: Include business logic claims
- **Validation**: Every API request via middleware

### Cookie Configuration

```typescript
{
  httpOnly: true,          // Prevents XSS attacks
  secure: true,            // HTTPS only
  sameSite: 'Strict',      // CSRF protection
  path: '/',               // Available site-wide
  maxAge: 3600             // 1 hour (access), 2592000 (refresh)
}
```

### Authorization (RBAC)

**Roles**: `ADMIN` | `CUSTOMER`

**Admin-Only Endpoints**:

- `POST /books` - Create book
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book
- `POST /books/{id}/upload-url` - Generate presigned URL
- `GET /orders` - Get all orders
- `PATCH /orders/{id}/status` - Update order status

**Flow**:

1. Auth Middleware extracts & validates JWT
2. RBAC Middleware checks `user.role === 'ADMIN'`
3. Returns 403 Forbidden if not authorized

---

## 📧 Email System & SQS Integration

### Asynchronous Email Architecture

The email system is **fully asynchronous** to ensure order creation never fails due to email issues.

```
┌────────────────┐
│  createOrder   │
│    Lambda      │
└───────┬────────┘
        │
        │ 1. Create order in DynamoDB
        │ 2. Create order items
        │ 3. Clear cart
        ▼
┌────────────────────────────┐
│  QueueService              │
│  ┌──────────────────────┐ │
│  │ sendToQueue()        │ │
│  │ - Build message      │ │
│  │ - Don't throw errors │ │
│  └──────────────────────┘ │
└───────┬────────────────────┘
        │
        │ 4. Queue 2 emails:
        │    - Customer confirmation
        │    - Admin notification
        ▼
┌─────────────────────────────────────┐
│  SQS Email Queue                    │
│  ┌───────────────────────────────┐ │
│  │ Config:                       │ │
│  │ • VisibilityTimeout: 300s     │ │
│  │ • MessageRetention: 1 day     │ │
│  │ • MaxReceiveCount: 3          │ │
│  │ • Batch: 10 messages          │ │
│  └───────────────────────────────┘ │
└────────┬────────────────────────────┘
         │
         │ 5. Lambda triggered (batch)
         ▼
┌─────────────────────────────────────┐
│  processEmailQueue Lambda           │
│  ┌───────────────────────────────┐ │
│  │ Process with allSettled       │ │
│  │ - Parse messages              │ │
│  │ - Send via EmailService       │ │
│  │ - Return failed IDs           │ │
│  └───────────────────────────────┘ │
└────────┬────────────────────────────┘
         │
         ├──────────┬─────────────┐
         ▼          ▼             ▼
┌─────────────┐ ┌─────────┐ ┌─────────┐
│ S3 Template │ │   SES   │ │   DLQ   │
│   Bucket    │ │  Email  │ │ (Failed)│
└─────────────┘ └─────────┘ └─────────┘
```

### Email Types & Templates

| Type                          | Recipient | Trigger        | Template                          |
| ----------------------------- | --------- | -------------- | --------------------------------- |
| `ORDER_CONFIRMATION_CUSTOMER` | Customer  | Order created  | `ORDER_CONFIRMATION_CUSTOMER.hbs` |
| `ORDER_CONFIRMATION_ADMIN`    | Admin     | Order created  | `ORDER_CONFIRMATION_ADMIN.hbs`    |
| `ORDER_STATUS_UPDATE`         | Customer  | Status changed | `ORDER_STATUS_UPDATE.hbs`         |

### SQS Configuration

```yaml
EmailQueue:
  Type: Standard Queue
  VisibilityTimeout: 300 seconds (5 minutes)
  MessageRetentionPeriod: 86400 seconds (1 day)
  ReceiveMessageWaitTime: 0 (short polling)

DeadLetterQueue:
  MessageRetentionPeriod: 1209600 seconds (14 days)
  Purpose: Store messages after 3 failed retries
```

### Lambda Trigger Configuration

```yaml
processEmailQueue:
  Event: SQS
  BatchSize: 10 # Process up to 10 emails
  MaximumBatchingWindow: 5 # Wait max 5 seconds
  FunctionResponseTypes:
    - ReportBatchItemFailures # Partial batch success
```

### Error Handling Strategy

1. **Queue Phase** (Non-blocking):

```typescript
try {
  await sqs.send(new SendMessageCommand(...));
} catch (error) {
  // Log error but DON'T throw
  // Order creation continues successfully
  logger.error("Failed to queue email", { error });
}
```

2. **Processing Phase** (Retry):

```typescript
const results = await Promise.allSettled(promises);
const failed = results
  .filter((r) => r.status === "rejected")
  .map((r) => ({ itemIdentifier: messageId }));

return { batchItemFailures: failed }; // SQS retries these
```

3. **After 3 Retries**: Message moved to Dead Letter Queue for manual investigation

### Template Caching

Templates are cached in-memory to reduce S3 calls:

```typescript
private templateCache = new Map<string, HandlebarsTemplate>();

async getTemplate(name: string) {
  if (!this.templateCache.has(name)) {
    const html = await s3.getObject(...);
    const compiled = Handlebars.compile(html);
    this.templateCache.set(name, compiled);
  }
  return this.templateCache.get(name);
}
```

![Order Receiving mail to admin](./images/admin-mail-confirmation.png)

![Order Status Change to processing](./images/order-processing-confirm-mail.png)
![Order Status Change to shipped](./images/order-shipping.png)

---

## 🖼️ S3 Presigned URLs

### Admin Image Upload Flow

Presigned URLs allow **direct browser-to-S3 uploads** without routing through Lambda, avoiding:

- ❌ Lambda timeout limits (29 seconds max)
- ❌ Lambda payload limits (10 MB for API Gateway)
- ❌ Lambda memory consumption
- ❌ Additional costs

```
┌──────────┐                                    ┌─────────┐
│  Admin   │                                    │   S3    │
└────┬─────┘                                    └────┬────┘
     │                                               │
     │ 1. POST /books/{id}/upload-url               │
     │    {fileExtension: '.jpg', contentType}      │
     ├──────────────────────────────────────────────▶
     │                                               │
┌────▼──────────────────────────────────────┐       │
│  generateUploadUrl Lambda                 │       │
│  ┌────────────────────────────────────┐  │       │
│  │ 2. Auth + RBAC (admin only)        │  │       │
│  │ 3. Verify book exists              │  │       │
│  │ 4. Generate unique key             │  │       │
│  │    book-covers/{bookId}/{timestamp}│  │       │
│  │ 5. Create PutObjectCommand         │  │       │
│  │ 6. Sign URL (expires in 1 hour)    │  │       │
│  └────────────────────────────────────┘  │       │
└────┬──────────────────────────────────────┘       │
     │                                               │
     │ 7. Return presigned URL + key                │
     │◀──────────────────────────────────────────────┤
     │                                               │
     │ 8. PUT {presigned URL}                        │
     │    Body: File binary                          │
     ├───────────────────────────────────────────────▶
     │                                               │
     │ 9. 200 OK                                     │
     │◀───────────────────────────────────────────────┤
     │                                               │
     │ 10. PUT /books/{id}                           │
     │     {coverImageKey: key}                      │
     ├──────────────────────────────────────────────▶
     │                                               │
     │ 11. Update DynamoDB with key                  │
     │◀──────────────────────────────────────────────┤
     │                                               │
```

### Presigned URL Structure

```
https://bookworm-book-covers-bucket-dev.s3.us-east-1.amazonaws.com/
book-covers/abc-123-def/1701234567890.jpg?
X-Amz-Algorithm=AWS4-HMAC-SHA256&
X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20231201%2Fus-east-1%2Fs3%2Faws4_request&
X-Amz-Date=20231201T120000Z&
X-Amz-Expires=3600&
X-Amz-SignedHeaders=host&
X-Amz-Signature=abc123def456...
```

**Key Components**:

- **Bucket**: `bookworm-book-covers-bucket-dev`
- **Key**: `book-covers/{bookId}/{timestamp}.{ext}`
- **Expiration**: 3600 seconds (1 hour)
- **Signature**: Temporary AWS credentials
- **Metadata**: `bookId`, `uploadedAt` timestamp

### CloudFront Distribution for Book Covers

```yaml
Origin: S3 Regional Domain (not website endpoint)
Access: Origin Access Identity (OAI) - No public access
Cache:
  DefaultTTL: 7 days
  MaxTTL: 1 year
Protocol: HTTPS only (redirect from HTTP)
Compression: Enabled (gzip, brotli)
HTTP Version: HTTP/2 and HTTP/3
```

**Benefits**:

- 🌍 Global edge caching
- ⚡ Low latency image delivery
- 💰 Reduced S3 GET request costs
- 🔒 Secure access via OAI (no direct S3 access)

### Image Viewing Flow

When a book is retrieved via `GET /books/{id}`:

```typescript
const book = await dynamodb.getItem(...);
book.coverImageUrl = generateCloudfrontUrl(book.coverImageKey);
// https://d12345abcde.cloudfront.net/book-covers/abc-123/image.jpg
```

Client requests image → CloudFront edge cache → (if miss) S3 origin → Cache & deliver

---

## 🚀 API Endpoints

### Base URL

```
Production: https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### Authentication Endpoints

| Method | Endpoint         | Description                           | Auth Required |
| ------ | ---------------- | ------------------------------------- | ------------- |
| `POST` | `/auth/callback` | Handle OAuth callback, create session | No            |
| `POST` | `/auth/refresh`  | Refresh access token                  | No            |
| `POST` | `/auth/logout`   | Logout and clear cookies              | No            |

### User Endpoints

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| `GET`  | `/users/profile` | Get current user profile | Yes           |
| `PUT`  | `/users/profile` | Update user profile      | Yes           |

### Book Endpoints

| Method   | Endpoint                 | Description                             | Auth Required | Admin Only |
| -------- | ------------------------ | --------------------------------------- | ------------- | ---------- |
| `GET`    | `/books`                 | Get all books (paginated, filtered)     | No            | No         |
| `GET`    | `/books/{id}`            | Get single book by ID                   | No            | No         |
| `POST`   | `/books`                 | Create new book                         | Yes           | ✅         |
| `PUT`    | `/books/{id}`            | Update book                             | Yes           | ✅         |
| `DELETE` | `/books/{id}`            | Delete book                             | Yes           | ✅         |
| `POST`   | `/books/{id}/upload-url` | Generate presigned URL for cover upload | Yes           | ✅         |

**Query Parameters for `GET /books`**:

```
?category=Fiction          # Filter by category
&sortBy=price              # Sort by: price, updatedAt
&sortOrder=asc             # asc or desc
&limit=20                  # Items per page
&lastEvaluatedKey=...      # Pagination token
&search=tolkien            # Search in title/author (case-insensitive)
```

### Cart Endpoints

| Method   | Endpoint         | Description               | Auth Required |
| -------- | ---------------- | ------------------------- | ------------- |
| `GET`    | `/cart`          | Get current user's cart   | Yes           |
| `POST`   | `/cart`          | Add item to cart          | Yes           |
| `PUT`    | `/cart/{bookId}` | Update cart item quantity | Yes           |
| `DELETE` | `/cart/{bookId}` | Remove item from cart     | Yes           |
| `DELETE` | `/cart`          | Clear entire cart         | Yes           |

### Order Endpoints

| Method  | Endpoint              | Description               | Auth Required | Admin Only |
| ------- | --------------------- | ------------------------- | ------------- | ---------- |
| `POST`  | `/orders`             | Create order from cart    | Yes           | No         |
| `GET`   | `/orders/user`        | Get current user's orders | Yes           | No         |
| `GET`   | `/orders/{id}`        | Get single order details  | Yes           | No         |
| `GET`   | `/orders`             | Get all orders (admin)    | Yes           | ✅         |
| `PATCH` | `/orders/{id}/status` | Update order status       | Yes           | ✅         |

---

## 🛠️ Setup & Deployment

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: Latest version
- **AWS Account**: With appropriate permissions
- **AWS CLI**: Configured with credentials
- **Serverless Framework**: Installed globally (optional)

### Deployment

#### Deploy to AWS

```bash
# Deploy to dev stage
npx serverless deploy --stage dev --verbose

# Deploy to production
npx serverless deploy --stage prod --verbose
```

**What happens during deployment:**

1. ✅ TypeScript compilation and bundling
2. ✅ Lambda function packaging (.zip files)
3. ✅ CloudFormation stack creation/update
4. ✅ DynamoDB tables provisioned
5. ✅ S3 buckets created
6. ✅ SQS queues configured
7. ✅ Cognito User Pool setup
8. ✅ CloudFront distributions deployed
9. ✅ API Gateway endpoints created
10. ✅ IAM roles and permissions applied

#### Deploy Specific Function

```bash
npx serverless deploy function -f createBook --stage dev
```

### Post-Deployment Setup

1. **Upload Email Templates to S3**

```bash
aws s3 cp templates/ s3://bookworm-email-templates-bucket-dev/ --recursive
```

2. **Verify SES Email Identity**

```bash
aws ses verify-email-identity --email-address noreply@yourdomain.com
```

3. **Configure Cognito Google OAuth**

   - Go to AWS Cognito Console
   - Select your User Pool
   - Add Google as Identity Provider
   - Configure OAuth redirect URLs
   - Add Client ID and Secret to Secrets Manager

### Remove Deployment

```bash
npx serverless remove --stage dev
```

**⚠️ Warning**: This will delete all resources including data in DynamoDB tables!

---

## 🔄 CI/CD Pipeline

### Backend Pipeline (GitHub Actions)

**Trigger**: Push to `main` branch with changes in `backend/**`

**Workflow**: `.github/workflows/backend-deploy.yaml`

```yaml
Steps:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Configure AWS credentials
5. Deploy via Serverless Framework
6. Output API endpoints and resource URLs
```

**Secrets Required**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `FRONTEND_URL`
- `SES_FROM_EMAIL`

### Frontend Pipeline (GitHub Actions)

**Trigger**: Push to `main` branch with changes in `frontend/**`

**Workflow**: `.github/workflows/frontend-deploy.yaml`

```yaml
Steps:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Create .env file with secrets
5. Build frontend (Vite)
6. Configure AWS credentials
7. Sync to S3:
   - Assets → cache 1 year
   - index.html → no cache
8. Invalidate CloudFront cache
9. Output deployment summary
```

**Secrets Required**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `VITE_API_BASE_URL`
- `VITE_COGNITO_USER_POOL_ID`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_COGNITO_DOMAIN`

### Deployment Flow

```
Developer Push
      ↓
GitHub Repository
      ↓
   ┌──┴──┐
   │     │
Backend  Frontend
Pipeline Pipeline
   │     │
   ↓     ↓
AWS      S3 + CloudFront
Lambda   Static Site
   ↓     ↓
Live Application
```

---

## Screenshots

## 🔐 Environment Variables

### Backend (Serverless Framework)

Defined in `serverless.yml` under `provider.environment`:

| Variable                   | Description                       | Example                                   |
| -------------------------- | --------------------------------- | ----------------------------------------- |
| `BOOKS_TABLE`              | DynamoDB books table name         | `bookworm-books-table-dev`                |
| `USERS_TABLE`              | DynamoDB users table name         | `bookworm-users-table-dev`                |
| `CART_TABLE`               | DynamoDB cart table name          | `bookworm-cart-table-dev`                 |
| `ORDERS_TABLE`             | DynamoDB orders table name        | `bookworm-orders-table-dev`               |
| `ORDER_ITEMS_TABLE`        | DynamoDB order items table name   | `bookworm-order-items-table-dev`          |
| `BOOK_COVERS_BUCKET`       | S3 bucket for book covers         | `bookworm-book-covers-bucket-dev`         |
| `FRONTEND_URL`             | Frontend application URL          | `https://d28jacfojat6xy.cloudfront.net`   |
| `SES_FROM_EMAIL`           | Email sender address              | `chamika@nexvibe.ai`                      |
| `EMAIL_TEMPLATES_BUCKET`   | S3 bucket for email templates     | `bookworm-email-templates-bucket-dev`     |
| `EMAIL_QUEUE_URL`          | SQS email queue URL               | `https://sqs.us-east-1.amazonaws.com/...` |
| `COGNITO_USER_POOL_ID`     | Cognito User Pool ID              | `us-east-1_abc123`                        |
| `COGNITO_CLIENT_ID`        | Cognito App Client ID             | `1234567890abcdef`                        |
| `CLOUDFRONT_DOMAIN`        | CloudFront domain for book covers | `d12345abcde.cloudfront.net`              |
| `ADMIN_EMAIL_SECRET_NAME`  | Secrets Manager secret name       | `bookworm/dev/admin-email`                |
| `GOOGLE_OAUTH_SECRET_NAME` | Secrets Manager secret name       | `bookworm/dev/google-oauth`               |

### Frontend (Vite)

Environment variables prefixed with `VITE_` are embedded at build time:

| Variable                    | Description              | Example                                                  |
| --------------------------- | ------------------------ | -------------------------------------------------------- |
| `VITE_API_BASE_URL`         | Backend API URL          | `https://abc123.execute-api.us-east-1.amazonaws.com/dev` |
| `VITE_OAUTH_REDIRECT_URI`   | OAuth callback URL       | `https://d28jacfojat6xy.cloudfront.net/auth/callback`    |
| `VITE_COGNITO_USER_POOL_ID` | Cognito User Pool ID     | `us-east-1_abc123`                                       |
| `VITE_COGNITO_CLIENT_ID`    | Cognito App Client ID    | `1234567890abcdef`                                       |
| `VITE_COGNITO_DOMAIN`       | Cognito hosted UI domain | `bookworm-dev.auth.us-east-1.amazoncognito.com`          |

---

## 💰 Cost Optimization

### Cost Optimization Strategies

1. **DynamoDB On-Demand Billing**

   - Only pay for actual reads/writes
   - No wasted provisioned capacity
   - Auto-scales with traffic

2. **Lambda Memory Optimization**

   - 512 MB memory (balance cost vs performance)
   - Short timeout (29s) to prevent runaway costs
   - Efficient code to reduce execution time

3. **CloudFront Caching**

   - Long cache TTL for static assets
   - Reduces S3 GET requests
   - Lower data transfer costs

4. **S3 Lifecycle Policies**

   - Delete old image versions after 30 days
   - Transition to Glacier for long-term archival

---

## 🔒 Security Best Practices

- ✅ **Encryption at Rest**: DynamoDB and S3 use AES-256 encryption
- ✅ **Encryption in Transit**: All APIs use HTTPS/TLS 1.2+
- ✅ **Least Privilege IAM**: Each Lambda has minimal required permissions
- ✅ **HTTP-only Cookies**: Prevents XSS token theft
- ✅ **CORS Configuration**: Only allows trusted frontend origins
- ✅ **Input Validation**: Zod schemas validate all request bodies
- ✅ **Secret Management**: No hardcoded credentials, all in Secrets Manager
- ✅ **Audit Logging**: CloudWatch logs all API requests

---

## 📝 Notes & Considerations

### Cognito Sandbox Mode

If using SES in sandbox mode, you must **verify all recipient email addresses** before sending:

```bash
aws ses verify-email-identity --email-address customer@example.com
```

### DynamoDB Global Secondary Indexes

Each GSI doubles write costs (writes to base table + GSI). Current design has 7 GSIs across all tables.

### Lambda Cold Starts

First invocation after idle period: ~1-2 seconds. Mitigate with:

- Provisioned concurrency (additional cost)
- Warm-up events
- Smaller function sizes

### SQS Message Retention

Messages are deleted after 1 day. For critical emails, consider longer retention or alternate retry mechanisms.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

###

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Chamika Jayasinghe**

---

**Built with ❤️ using AWS Serverless Technologies by Chamika Jayasinghe**
