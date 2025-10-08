### GSIs in DynamoDB

- **A Global Secondary Index (GSI) is an index with its own partition key (and optional sort key) that can be different from the table’s primary key.**
- It keeps a copy of selected attributes from table items and lets you efficiently query by the index keys instead of the table primary key.
- GSIs are global across all partitions and can be added after table creation.

* How they behave (key properties)

  - **Queries on a GSI are efficient and avoid full-table scans.**
  - Indexes are eventually consistent by default (reads from a GSI may lag slightly behind writes).
  - You can choose which attributes to project into a GSI: KEYS_ONLY, INCLUDE (specific attributes), or ALL.
  - Writes to the main table also update GSIs, which increases write cost and storage.

* Why GSIs are important

* Support additional access patterns without changing the primary key design.
* Enable efficient sorting and filtering by attributes that are not part of the table’s primary key.
* Let you model multiple query patterns (e.g., list by category, list by date, list by price) without duplicating data in separate tables.
* Flexible: you can add/modify GSIs as application query needs evolve.

* **Common use cases**

  - Secondary lookups: query items by an attribute that is not the table key (e.g., find all books by category).
  - Sorting by another attribute: use a sort key on the GSI to get items ordered (e.g., newest updatedAt or lowest price).
  - Multi-tenant / type partitioning: use an entityType or tenantId as GSI partition key to query items for that tenant/type.
  - Sparse indexes for filtering: only items that contain the indexed attribute appear in the GSI (useful for optional fields).
  - Read-heavy query patterns where creating additional GSIs reduces read costs and latencies compared to scans.

* Trade-offs and best practices

  - Cost/throughput: GSIs increase storage and write costs and consume write capacity on updates. Monitor and size accordingly.
  - Projection: project only attributes you need to minimize storage and cost.
  - **Design for query patterns: model GSIs based on how the app queries data, not on convenience of writes.**
  - Avoid high-cardinality hot partitions: choose partition keys that distribute load.

### How Cloudfront helps in serving images from S3 bucket ->

1. First-Time Request: When a user, let's say in London, requests a book cover image for the very first time, the request goes to the nearest CloudFront edge location (e.g., one in London).
2. Cache Miss: The London edge location doesn't have the image yet (this is called a "cache miss"). It then goes to your S3 bucket in Virginia (the "origin") to get the image.
3. Caching at the Edge: As the image passes through the London edge location on its way to the user, CloudFront saves a copy of it in its cache.
4. Subsequent Requests: Now, when another user in London, or even a nearby city like Paris, requests the same image, the request goes to their nearest edge location. That edge location already has a copy of the image in its cache.
5. Fast Delivery from Cache: The image is delivered directly from the nearby edge location's cache. This is significantly faster because the data doesn't have to travel all the way to and from the origin server in Virginia.
