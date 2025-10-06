### How Cloudfront helps in serving images from S3 bucket ->

1. First-Time Request: When a user, let's say in London, requests a book cover image for the very first time, the request goes to the nearest CloudFront edge location (e.g., one in London).
2. Cache Miss: The London edge location doesn't have the image yet (this is called a "cache miss"). It then goes to your S3 bucket in Virginia (the "origin") to get the image.
3. Caching at the Edge: As the image passes through the London edge location on its way to the user, CloudFront saves a copy of it in its cache.
4. Subsequent Requests: Now, when another user in London, or even a nearby city like Paris, requests the same image, the request goes to their nearest edge location. That edge location already has a copy of the image in its cache.
5. Fast Delivery from Cache: The image is delivered directly from the nearby edge location's cache. This is significantly faster because the data doesn't have to travel all the way to and from the origin server in Virginia.
