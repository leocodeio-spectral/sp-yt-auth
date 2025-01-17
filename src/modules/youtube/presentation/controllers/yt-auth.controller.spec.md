# yt-auth.controller.spec.ts

## Description

This file is a test file for the yt-auth.controller.ts file.

## base url

```text
{{deployed-url}}/youtube/{{version}}
```

## Creator

```text
endpoints:

1 - POST /creator

# gets creator by id and status if not provided, it will return all creators
2 - GET /creator?id={{creator_id}}?status={{status}}
enum( “ACTIVE” | “INACTIVE” | “SUSPENDED“ | “DELETED” )

# update creator by id - covers delete and update
3 - PUT /creator/{{creatorId}}

```

## Youtube Connect

```text
endpoints:
- GET /youtube/auth/callback
- GET /youtube/auth/login
- GET /youtube/auth/logout
- GET /youtube/auth/refresh
- GET /youtube/auth/status
```
