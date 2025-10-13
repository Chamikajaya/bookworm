### Need to research on how to integrate dynamodb streams with ALGOLIA for search functionality

- // ! TODO: If integrating to DynamoDB streams with ALGOLIA, remove title / author filters, need to index algolia index on book update / book create / book delete on dynamodb - use dynamodb streams with lambdas to do this , also when the user searches, need to call algolia search api as well

DynamoDB first fetches limit items (e.g., 12 books)
Then applies the filter (e.g., title contains "the")
Returns only the items that match the filter (e.g., 4 out of 12)
So if your database has books in this order:

Books 1-12: Only 4 contain "the" → Page 1 returns 4 items
Books 13-24: Only 6 contain "the" → Page 2 returns 6 items
Books 25-36: None contain "the" → Page 3 returns 0 items

### TODO: Use Query Response's LastEvaluatedKey for pagination instead of lastTimestamp

### Need to implement refresh token behaviour - interceptor
