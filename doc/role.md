# Role API Spec

## Create role

Endpoint : POST /api/role
role: admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Admin"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "Join ml"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized/forbidden"
}
```

## Update role

Endpoint : PACTH /api/role
role: admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Super Admin"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "Super Admin"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized/forbidden"
}
```
