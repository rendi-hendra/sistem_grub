# Grub API Spec

## Create Grub

Endpoint : POST /api/grubs

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Mabar"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "grub_id": "uud",
    "name": "Join ml",
    "totalUsers": 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Join Grub

Endpoint : POST /api/grubs/join

Headers :

- Authorization: token

Request Body :

```json
{
  "grubId": "uud"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "userId": 1,
    "grubId": "uud",
    "name": "Mabar",
    "totalUsers": 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "GrubId not found"
}
```

## Update Group

Endpoint : PACTH /api/grubs/:id
role : Admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Mabar ml"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "grubId": "uud",
    "name": "Mabar ml"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "name required"
}
```

## Get Grub Current

Endpoint : GET /api/grubs/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "grubId": "uud",
      "name": "Mabar"
    },
    {
      "userId": "uud",
      "name": "Mabar ml"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Get User Grub

Endpoint : GET /api/grubs/:grub_id/members

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "grubId": "uud",
    "name": "Mabar",
    "total_user": 10,
    "users": [
      {
        "userId": 1,
        "name": "rendi",
        "role": "admin"
      },
      {
        "userId": 2,
        "name": "hendra",
        "role": "user"
      }
    ]
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Kick User Grub

Endpoint : Delete /api/grubs/:grub_id/members/:user_id
role : "admin"

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "userId": 1,
      "name": "rendi",
      "role": "admin"
    },
    {
      "userId": 2,
      "name": "hendra"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized/forbidden"
}
```

## Logout Grub

Endpoint : DELETE /api/grubs

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```
