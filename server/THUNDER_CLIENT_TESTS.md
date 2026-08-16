# BidStream — Auth API: Thunder Client Test Examples

Base URL: `http://localhost:5000/api/v1`

All responses follow the shape:
```json
{ "success": true/false, ... }
```

---

## 1. Register — Buyer

**POST** `{{baseUrl}}/auth/register`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "name": "Ayesha Muneer",
  "username": "ayesha_m",
  "email": "ayesha@example.com",
  "phone": "+923001234567",
  "password": "Secret123",
  "confirmPassword": "Secret123",
  "role": "buyer"
}
```

Expected — `201 Created`:
```json
{
  "success": true,
  "user": {
    "_id": "<mongoId>",
    "name": "Ayesha Muneer",
    "username": "ayesha_m",
    "email": "ayesha@example.com",
    "phone": "+923001234567",
    "role": "buyer",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

---

## 2. Register — Seller

**POST** `{{baseUrl}}/auth/register`

Body:
```json
{
  "name": "Ahmed Raza",
  "username": "ahmed_sells",
  "email": "ahmed@example.com",
  "phone": "+923009876543",
  "password": "Seller123",
  "confirmPassword": "Seller123",
  "role": "seller"
}
```

Expected — `201 Created` (same shape as above, `"role": "seller"`)

---

## 3. Register — Admin blocked (should fail)

**POST** `{{baseUrl}}/auth/register`

Body:
```json
{
  "name": "Evil Admin",
  "username": "evil_admin",
  "email": "evil@example.com",
  "password": "Admin123",
  "confirmPassword": "Admin123",
  "role": "admin"
}
```

Expected — `403 Forbidden`:
```json
{
  "success": false,
  "message": "Admin accounts cannot be created via registration"
}
```

---

## 4. Register — Validation failure (passwords don't match)

**POST** `{{baseUrl}}/auth/register`

Body:
```json
{
  "name": "Test User",
  "username": "test_user",
  "email": "test@example.com",
  "password": "Secret123",
  "confirmPassword": "Wrong999"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "confirmPassword", "message": "Passwords do not match" }
  ]
}
```

---

## 5. Register — Duplicate email (should fail)

Re-send Request #1 exactly.

Expected — `409 Conflict`:
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

## 6. Login — Buyer

**POST** `{{baseUrl}}/auth/login`

Body:
```json
{
  "email": "ayesha@example.com",
  "password": "Secret123"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": { "role": "buyer", ... },
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

> Copy `accessToken` — you'll need it for protected routes (#10, #11).
> Copy `refreshToken` — you'll need it for #9.

---

## 7. Login — Seller

**POST** `{{baseUrl}}/auth/login`

Body:
```json
{
  "email": "ahmed@example.com",
  "password": "Seller123"
}
```

Expected — `200 OK` (`"role": "seller"`)

---

## 8. Admin Login — Success

**POST** `{{baseUrl}}/auth/admin/login`

Body:
```json
{
  "email": "admin@bidstream.com",
  "password": "AdminPass1"
}
```

> Admin account must exist in MongoDB with `role: "admin"`.
> To seed one, run this once in mongo shell / Compass:
> ```js
> db.users.insertOne({
>   name: "BidStream Admin",
>   username: "bidstream_admin",
>   email: "admin@bidstream.com",
>   password: "<bcrypt hash of AdminPass1>",
>   role: "admin",
>   isActive: true
> })
> ```
> Or use the helper script described at the bottom of this file.

Expected — `200 OK`:
```json
{
  "success": true,
  "user": { "role": "admin", ... },
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

---

## 9. Admin Login — Non-admin trying admin endpoint (should fail)

**POST** `{{baseUrl}}/auth/admin/login`

Body:
```json
{
  "email": "ayesha@example.com",
  "password": "Secret123"
}
```

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 10. Refresh Token

**POST** `{{baseUrl}}/auth/refresh`

Body:
```json
{
  "refreshToken": "<refreshToken from login>"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "accessToken": "<new jwt>"
}
```

---

## 11. Refresh Token — Missing token (should fail)

**POST** `{{baseUrl}}/auth/refresh`

Body:
```json
{}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "refreshToken", "message": "Refresh token is required" }
  ]
}
```

---

## 12. Current User (GET /me)

**GET** `{{baseUrl}}/auth/me`

Headers:
```
Authorization: Bearer <accessToken from login>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Ayesha Muneer",
    "username": "ayesha_m",
    "email": "ayesha@example.com",
    "role": "buyer",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 13. GET /me — No token (should fail)

**GET** `{{baseUrl}}/auth/me`

No Authorization header.

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## 14. GET /me — Expired token (should fail)

**GET** `{{baseUrl}}/auth/me`

Headers:
```
Authorization: Bearer <an expired or tampered token>
```

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Token expired"
}
```

---

## 15. Logout

**POST** `{{baseUrl}}/auth/logout`

Headers:
```
Authorization: Bearer <accessToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

> Logout is stateless — the server confirms the request.
> The client is responsible for deleting the stored tokens.

---

## 16. Logout — No token (should fail)

**POST** `{{baseUrl}}/auth/logout`

No Authorization header.

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## 17. Health Check

**GET** `{{baseUrl}}/health`

Expected — `200 OK`:
```json
{
  "success": true,
  "message": "BidStream API is running"
}
```

---

## Endpoint Summary

| # | Method | Endpoint                  | Auth Required | Description                        |
|---|--------|---------------------------|---------------|------------------------------------|
| 1 | POST   | /auth/register            | No            | Buyer or seller self-registration  |
| 2 | POST   | /auth/login               | No            | Buyer / seller login               |
| 3 | POST   | /auth/admin/login         | No            | Admin-only login                   |
| 4 | POST   | /auth/refresh             | No            | Get new access token               |
| 5 | POST   | /auth/logout              | Yes (Bearer)  | Logout current session             |
| 6 | GET    | /auth/me                  | Yes (Bearer)  | Get authenticated user's profile   |
| 7 | GET    | /health                   | No            | API health check                   |

---

## Seeding an Admin Account

Because admin accounts cannot be registered via the API, seed one directly.

Create a file `server/scripts/seedAdmin.js`:

```js
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'admin@bidstream.com' });
  if (existing) {
    console.log('Admin already exists.');
    return process.exit(0);
  }

  await User.create({
    name: 'BidStream Admin',
    username: 'bidstream_admin',
    email: 'admin@bidstream.com',
    password: 'AdminPass1',   // will be hashed by the pre-save hook
    role: 'admin',
    isActive: true,
  });

  console.log('Admin account created: admin@bidstream.com / AdminPass1');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
```

Run it once:
```
node scripts/seedAdmin.js
```


---

# User Profile API — Thunder Client Test Examples

Base URL: `http://localhost:5000/api/v1`
All routes require: `Authorization: Bearer <accessToken>`

> Get an accessToken first by running test #6 (Login — Buyer) from the Auth section above.

---

## 18. Get Profile

**GET** `{{baseUrl}}/users/profile`

Headers:
```
Authorization: Bearer <accessToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Ayesha Muneer",
    "username": "ayesha_m",
    "email": "ayesha@example.com",
    "phone": "+923001234567",
    "avatar": null,
    "bio": null,
    "location": null,
    "role": "buyer",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 19. Update Profile (name + bio + location)

**PATCH** `{{baseUrl}}/users/profile`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:
```json
{
  "name": "Ayesha M.",
  "bio": "Passionate collector of vintage photography gear.",
  "location": "Lahore, Pakistan"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": {
    "name": "Ayesha M.",
    "bio": "Passionate collector of vintage photography gear.",
    "location": "Lahore, Pakistan",
    ...
  }
}
```

---

## 20. Update Profile — Validation failure (bio too long)

**PATCH** `{{baseUrl}}/users/profile`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:
```json
{
  "bio": "A very long bio that exceeds the 300 character limit aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "bio", "message": "Bio cannot exceed 300 characters" }
  ]
}
```

---

## 21. Update Name Only

**PATCH** `{{baseUrl}}/users/name`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:
```json
{
  "name": "Ayesha Muneer Updated"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": {
    "name": "Ayesha Muneer Updated",
    ...
  }
}
```

---

## 22. Update Name — Validation failure (empty name)

**PATCH** `{{baseUrl}}/users/name`

Body:
```json
{
  "name": ""
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name cannot be blank" }
  ]
}
```

---

## 23. Update Phone Number

**PATCH** `{{baseUrl}}/users/phone`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:
```json
{
  "phone": "+923009876543"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": {
    "phone": "+923009876543",
    ...
  }
}
```

---

## 24. Clear Phone Number (set to null)

**PATCH** `{{baseUrl}}/users/phone`

Body:
```json
{
  "phone": null
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "user": {
    "phone": null,
    ...
  }
}
```

---

## 25. Update Phone — Validation failure (invalid number)

**PATCH** `{{baseUrl}}/users/phone`

Body:
```json
{
  "phone": "not-a-phone"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "phone", "message": "Please enter a valid phone number" }
  ]
}
```

---

## 26. Change Password — Success

**PATCH** `{{baseUrl}}/users/password`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:
```json
{
  "currentPassword": "Secret123",
  "newPassword": "NewPass456",
  "confirmNewPassword": "NewPass456"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

> After this test, the old password no longer works. Use `NewPass456` to log in.

---

## 27. Change Password — Wrong current password

**PATCH** `{{baseUrl}}/users/password`

Body:
```json
{
  "currentPassword": "WrongPass1",
  "newPassword": "NewPass456",
  "confirmNewPassword": "NewPass456"
}
```

Expected — `403 Forbidden`:
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 28. Change Password — Same as current

**PATCH** `{{baseUrl}}/users/password`

Body:
```json
{
  "currentPassword": "NewPass456",
  "newPassword": "NewPass456",
  "confirmNewPassword": "NewPass456"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "New password must be different from current password"
}
```

---

## 29. Change Password — Confirm mismatch

**PATCH** `{{baseUrl}}/users/password`

Body:
```json
{
  "currentPassword": "NewPass456",
  "newPassword": "Another789",
  "confirmNewPassword": "Mismatch99"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "confirmNewPassword", "message": "Passwords do not match" }
  ]
}
```

---

## 30. Upload Avatar — Success

**POST** `{{baseUrl}}/users/avatar`

Headers:
```
Authorization: Bearer <accessToken>
```

Body type: `multipart/form-data`

| Key    | Type | Value                        |
|--------|------|------------------------------|
| avatar | File | *(select a .jpg/.png/.webp)* |

Expected — `200 OK`:
```json
{
  "success": true,
  "avatar": "/uploads/avatars/1720000000000-123456789.jpg"
}
```

> The avatar is now accessible at:
> `http://localhost:5000/uploads/avatars/1720000000000-123456789.jpg`

---

## 31. Upload Avatar — Wrong file type

**POST** `{{baseUrl}}/users/avatar`

Body: `multipart/form-data` — upload a `.pdf` or `.gif` file

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Only JPEG, PNG, and WebP images are allowed"
}
```

---

## 32. Upload Avatar — File too large (> 2 MB)

**POST** `{{baseUrl}}/users/avatar`

Body: `multipart/form-data` — upload any image larger than 2 MB

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Image must be 2 MB or smaller"
}
```

---

## 33. Delete Avatar

**DELETE** `{{baseUrl}}/users/avatar`

Headers:
```
Authorization: Bearer <accessToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "message": "Avatar removed successfully"
}
```

> The file is deleted from disk and `avatar` is set to `null` in MongoDB.

---

## 34. Any Profile Route — No token

**GET** `{{baseUrl}}/users/profile`

No Authorization header.

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Profile Endpoint Summary

| # | Method | Endpoint               | Body / Form                                      | Description                        |
|---|--------|------------------------|--------------------------------------------------|------------------------------------|
| 1 | GET    | /users/profile         | —                                                | Get full profile                   |
| 2 | PATCH  | /users/profile         | `{ name?, bio?, location? }`                     | Update name, bio, location         |
| 3 | PATCH  | /users/name            | `{ name }`                                       | Update display name only           |
| 4 | PATCH  | /users/phone           | `{ phone }`                                      | Update phone number only           |
| 5 | PATCH  | /users/password        | `{ currentPassword, newPassword, confirmNewPassword }` | Change password             |
| 6 | POST   | /users/avatar          | `multipart/form-data` field: `avatar`            | Upload profile image               |
| 7 | DELETE | /users/avatar          | —                                                | Remove profile image               |


---

# Category API — Thunder Client Test Examples

Base URL: `http://localhost:5000/api/v1`

**All routes require:** `Authorization: Bearer <accessToken>`
**Write routes (POST/PATCH/DELETE) additionally require an admin token.**

> Get an admin token first by running test #8 (Admin Login) from the Auth section.
> Store it separately as `adminToken`.

---

## 35. Get All Categories (any authenticated user)

**GET** `{{baseUrl}}/categories`

Headers:
```
Authorization: Bearer <accessToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "total": 2,
  "categories": [
    {
      "id": "...",
      "name": "Photography",
      "slug": "photography",
      "description": "Cameras, lenses and accessories.",
      "icon": "📷",
      "gradient": "from-blue-600 to-cyan-400",
      "image": null,
      "status": "active",
      "auctionCount": 0,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 36. Get All Categories — Filter by status

**GET** `{{baseUrl}}/categories?status=active`

Expected — `200 OK` (only active categories)

---

## 37. Get All Categories — Sort by auctions

**GET** `{{baseUrl}}/categories?sort=auctions`

Expected — `200 OK` (sorted by auctionCount descending)

---

## 38. Get All Categories — Invalid query param

**GET** `{{baseUrl}}/categories?status=banned`

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "status", "message": "status must be active, inactive, or all" }
  ]
}
```

---

## 39. Get Single Category by ID

**GET** `{{baseUrl}}/categories/<categoryId>`

Headers:
```
Authorization: Bearer <accessToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "category": { "id": "...", "name": "Photography", ... }
}
```

---

## 40. Get Single Category by Slug

**GET** `{{baseUrl}}/categories/photography`

Expected — `200 OK` (same shape as above)

---

## 41. Get Single Category — Not found

**GET** `{{baseUrl}}/categories/000000000000000000000000`

Expected — `404 Not Found`:
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## 42. Create Category (admin only)

**POST** `{{baseUrl}}/categories`

Headers:
```
Authorization: Bearer <adminToken>
Content-Type: application/json
```

Body:
```json
{
  "name": "Photography",
  "description": "Cameras, lenses, lighting equipment, film and digital accessories.",
  "icon": "📷",
  "gradient": "from-blue-600 to-cyan-400",
  "status": "active"
}
```

Expected — `201 Created`:
```json
{
  "success": true,
  "category": {
    "id": "<mongoId>",
    "name": "Photography",
    "slug": "photography",
    "description": "Cameras, lenses, lighting equipment, film and digital accessories.",
    "icon": "📷",
    "gradient": "from-blue-600 to-cyan-400",
    "image": null,
    "status": "active",
    "auctionCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

> Copy the `id` — you'll need it for tests #44–#52.

---

## 43. Create Category — Validation failure (missing description)

**POST** `{{baseUrl}}/categories`

Headers:
```
Authorization: Bearer <adminToken>
Content-Type: application/json
```

Body:
```json
{
  "name": "Fashion"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "description", "message": "Description is required" }
  ]
}
```

---

## 44. Create Category — Duplicate name (should fail)

Re-send Request #42 exactly.

Expected — `409 Conflict`:
```json
{
  "success": false,
  "message": "Category \"Photography\" already exists"
}
```

---

## 45. Create Category — Non-admin forbidden

**POST** `{{baseUrl}}/categories`

Headers:
```
Authorization: Bearer <buyerAccessToken>
Content-Type: application/json
```

Body: *(any valid body)*

Expected — `403 Forbidden`:
```json
{
  "success": false,
  "message": "Forbidden – insufficient permissions"
}
```

---

## 46. Update Category

**PATCH** `{{baseUrl}}/categories/<categoryId>`

Headers:
```
Authorization: Bearer <adminToken>
Content-Type: application/json
```

Body:
```json
{
  "description": "Updated description for Photography category.",
  "icon": "🎥"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "category": {
    "description": "Updated description for Photography category.",
    "icon": "🎥",
    ...
  }
}
```

---

## 47. Update Category — Invalid Mongo ID

**PATCH** `{{baseUrl}}/categories/not-a-valid-id`

Headers:
```
Authorization: Bearer <adminToken>
Content-Type: application/json
```

Body: `{ "name": "Test" }`

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "id", "message": "Invalid category ID" }
  ]
}
```

---

## 48. Toggle Category Status (active ↔ inactive)

**PATCH** `{{baseUrl}}/categories/<categoryId>/status`

Headers:
```
Authorization: Bearer <adminToken>
```

No body required.

Expected — `200 OK` (status flipped):
```json
{
  "success": true,
  "category": {
    "status": "inactive",
    ...
  }
}
```

Call again to flip back to `"active"`.

---

## 49. Upload Category Image

**POST** `{{baseUrl}}/categories/<categoryId>/image`

Headers:
```
Authorization: Bearer <adminToken>
```

Body type: `multipart/form-data`

| Key   | Type | Value                         |
|-------|------|-------------------------------|
| image | File | *(select a .jpg/.png/.webp)*  |

Expected — `200 OK`:
```json
{
  "success": true,
  "image": "/uploads/categories/1720000000000-987654321.jpg"
}
```

> Image is now accessible at:
> `http://localhost:5000/uploads/categories/1720000000000-987654321.jpg`

---

## 50. Upload Category Image — Wrong file type

**POST** `{{baseUrl}}/categories/<categoryId>/image`

Body: `multipart/form-data` — upload a `.gif` or `.pdf`

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Only JPEG, PNG, and WebP images are allowed"
}
```

---

## 51. Delete Category Image

**DELETE** `{{baseUrl}}/categories/<categoryId>/image`

Headers:
```
Authorization: Bearer <adminToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "message": "Category image removed successfully"
}
```

---

## 52. Delete Category

**DELETE** `{{baseUrl}}/categories/<categoryId>`

Headers:
```
Authorization: Bearer <adminToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 53. Delete Category — Not found

**DELETE** `{{baseUrl}}/categories/000000000000000000000000`

Expected — `404 Not Found`:
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## 54. Any Category Write Route — No token

**POST** `{{baseUrl}}/categories`

No Authorization header.

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Category Endpoint Summary

| # | Method | Endpoint                        | Role     | Description                      |
|---|--------|---------------------------------|----------|----------------------------------|
| 1 | GET    | /categories                     | Any      | List all (filter + sort via query) |
| 2 | GET    | /categories/:id                 | Any      | Get by _id or slug               |
| 3 | POST   | /categories                     | Admin    | Create category                  |
| 4 | PATCH  | /categories/:id                 | Admin    | Update fields                    |
| 5 | PATCH  | /categories/:id/status          | Admin    | Toggle active ↔ inactive         |
| 6 | DELETE | /categories/:id                 | Admin    | Delete category + image from disk |
| 7 | POST   | /categories/:id/image           | Admin    | Upload category image            |
| 8 | DELETE | /categories/:id/image           | Admin    | Remove category image            |


---

# Auction API — Thunder Client Test Examples

Base URL: `http://localhost:5000/api/v1`

**Tokens needed:**
- `sellerToken`  — from POST /auth/login with a seller account
- `buyerToken`   — from POST /auth/login with a buyer account
- `<categoryId>` — from POST /categories (run test #42 first)

---

## 55. Browse All Auctions (buyer)

**GET** `{{baseUrl}}/auctions`

Headers:
```
Authorization: Bearer <buyerToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "auctions": [ ... ],
  "pagination": { "total": 2, "page": 1, "limit": 12, "pages": 1 }
}
```

---

## 56. Browse Auctions — Filter by status

**GET** `{{baseUrl}}/auctions?status=live`

Expected — `200 OK` (only live auctions)

---

## 57. Browse Auctions — Filter by category

**GET** `{{baseUrl}}/auctions?category=<categoryId>`

Expected — `200 OK` (only auctions in that category)

---

## 58. Browse Auctions — Text search

**GET** `{{baseUrl}}/auctions?search=leica`

Expected — `200 OK` (full-text match on title/description/tags)

---

## 59. Browse Auctions — Pagination + sort

**GET** `{{baseUrl}}/auctions?page=1&limit=5&sort=ending`

Expected — `200 OK` (max 5 results, sorted by soonest endTime)

---

## 60. Browse Auctions — Invalid query param

**GET** `{{baseUrl}}/auctions?sort=random`

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "sort", "message": "Invalid sort option" }]
}
```

---

## 61. View Single Auction (buyer)

**GET** `{{baseUrl}}/auctions/<auctionId>`

Headers:
```
Authorization: Bearer <buyerToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "auction": {
    "id": "...",
    "title": "Vintage Leica M6 Film Camera",
    "description": "...",
    "seller": { "name": "...", "username": "...", "avatar": null },
    "category": { "name": "Photography", "slug": "photography", ... },
    "images": [],
    "startingPrice": 800,
    "currentBid": 0,
    "highestBidder": null,
    "minIncrement": 20,
    "reservePrice": 1200,
    "condition": "Excellent",
    "location": "Lahore, Pakistan",
    "shipping": "Worldwide",
    "tags": ["film", "rangefinder", "leica"],
    "startTime": "...",
    "endTime": "...",
    "status": "upcoming",
    "bids": 0,
    "featured": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 62. View Single Auction — Not found

**GET** `{{baseUrl}}/auctions/000000000000000000000000`

Expected — `404 Not Found`:
```json
{ "success": false, "message": "Auction not found" }
```

---

## 63. Create Auction — Save as Draft (seller)

**POST** `{{baseUrl}}/auctions`

Headers:
```
Authorization: Bearer <sellerToken>
Content-Type: application/json
```

Body:
```json
{
  "title": "Vintage Leica M6 Film Camera",
  "description": "Classic 35mm rangefinder in excellent condition. All-original, light seals replaced 2022.",
  "category": "<categoryId>",
  "startingPrice": 800,
  "minIncrement": 20,
  "reservePrice": 1200,
  "condition": "Excellent",
  "location": "Lahore, Pakistan",
  "shipping": "Worldwide",
  "tags": "film, rangefinder, leica, vintage",
  "startTime": "2027-08-01T10:00:00.000Z",
  "endTime": "2027-08-08T10:00:00.000Z",
  "status": "draft"
}
```

Expected — `201 Created`:
```json
{
  "success": true,
  "auction": {
    "id": "<auctionId>",
    "status": "draft",
    "seller": "<sellerId>",
    ...
  }
}
```

> Copy `id` as `<auctionId>` for tests below.

---

## 64. Create Auction — Publish (upcoming, future startTime)

**POST** `{{baseUrl}}/auctions`

Body: *(same as #63 but omit `"status": "draft"`)*

Expected — `201 Created` with `"status": "upcoming"`
*(status auto-derived because startTime is in the future)*

---

## 65. Create Auction — Go Live (startTime in the past)

**POST** `{{baseUrl}}/auctions`

Body:
```json
{
  "title": "Canon EOS R5 Body",
  "description": "45MP mirrorless, under 5000 actuations.",
  "category": "<categoryId>",
  "startingPrice": 2200,
  "condition": "Like New",
  "startTime": "2020-01-01T00:00:00.000Z",
  "endTime": "2030-12-31T00:00:00.000Z"
}
```

Expected — `201 Created` with `"status": "live"`

---

## 66. Create Auction — Validation failure (missing required fields)

**POST** `{{baseUrl}}/auctions`

Body:
```json
{
  "title": "Incomplete Auction"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "description", "message": "Description is required" },
    { "field": "category",    "message": "Category is required" },
    { "field": "startingPrice","message": "Starting price is required" },
    { "field": "condition",   "message": "Condition is required" },
    { "field": "startTime",   "message": "Start time is required" },
    { "field": "endTime",     "message": "End time is required" }
  ]
}
```

---

## 67. Create Auction — End time before start time

**POST** `{{baseUrl}}/auctions`

Body:
```json
{
  "title": "Bad Schedule",
  "description": "Test.",
  "category": "<categoryId>",
  "startingPrice": 100,
  "condition": "New",
  "startTime": "2027-08-10T10:00:00.000Z",
  "endTime":   "2027-08-05T10:00:00.000Z"
}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "endTime", "message": "End time must be after start time" }]
}
```

---

## 68. Create Auction — Buyer forbidden

**POST** `{{baseUrl}}/auctions`

Headers:
```
Authorization: Bearer <buyerToken>
```

Expected — `403 Forbidden`:
```json
{ "success": false, "message": "Forbidden – insufficient permissions" }
```

---

## 69. View My Auctions (seller)

**GET** `{{baseUrl}}/auctions/my`

Headers:
```
Authorization: Bearer <sellerToken>
```

Expected — `200 OK` (all auctions including drafts belonging to this seller)

---

## 70. View My Auctions — Filter drafts only

**GET** `{{baseUrl}}/auctions/my?status=draft`

Expected — `200 OK` (only draft auctions)

---

## 71. Update Auction (seller)

**PATCH** `{{baseUrl}}/auctions/<auctionId>`

Headers:
```
Authorization: Bearer <sellerToken>
Content-Type: application/json
```

Body:
```json
{
  "description": "Updated description — now includes all original accessories.",
  "reservePrice": 1500,
  "shipping": "Domestic"
}
```

Expected — `200 OK`:
```json
{
  "success": true,
  "auction": { "description": "Updated description...", "reservePrice": 1500, ... }
}
```

---

## 72. Update Auction — Publish draft

**PATCH** `{{baseUrl}}/auctions/<auctionId>`

Body:
```json
{ "status": "upcoming" }
```

Expected — `200 OK` with `"status": "upcoming"`
*(category auctionCount incremented automatically)*

---

## 73. Update Auction — Wrong owner

**PATCH** `{{baseUrl}}/auctions/<auctionId>`

Headers:
```
Authorization: Bearer <differentSellerToken>
```

Body: `{ "description": "Hack attempt" }`

Expected — `403 Forbidden`:
```json
{ "success": false, "message": "You do not own this auction" }
```

---

## 74. Upload Auction Images (seller)

**POST** `{{baseUrl}}/auctions/<auctionId>/images`

Headers:
```
Authorization: Bearer <sellerToken>
```

Body type: `multipart/form-data`

| Key    | Type | Value                              |
|--------|------|------------------------------------|
| images | File | *(select 1–8 .jpg/.png/.webp files)* |

Expected — `200 OK`:
```json
{
  "success": true,
  "images": [
    "/uploads/auctions/1720000000000-111111111.jpg",
    "/uploads/auctions/1720000000000-222222222.png"
  ]
}
```

> Images accessible at `http://localhost:5000/uploads/auctions/<filename>`

---

## 75. Upload Auction Images — Exceed 8-image limit

Upload images when auction already has 8.

Expected — `400 Bad Request`:
```json
{
  "success": false,
  "message": "Adding 1 image(s) would exceed the 8-image limit (currently have 8)"
}
```

---

## 76. Upload Auction Images — File too large (> 5 MB)

Expected — `422 Unprocessable Entity`:
```json
{ "success": false, "message": "Each image must be 5 MB or smaller" }
```

---

## 77. Upload Auction Images — Wrong file type

Expected — `422 Unprocessable Entity`:
```json
{ "success": false, "message": "Only JPEG, PNG, and WebP images are allowed" }
```

---

## 78. Remove Single Auction Image (seller)

**DELETE** `{{baseUrl}}/auctions/<auctionId>/images/<filename>`

e.g. `DELETE /auctions/abc123/images/1720000000000-111111111.jpg`

Headers:
```
Authorization: Bearer <sellerToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "images": [ "/uploads/auctions/1720000000000-222222222.png" ]
}
```

---

## 79. Delete Auction (seller)

**DELETE** `{{baseUrl}}/auctions/<auctionId>`

Headers:
```
Authorization: Bearer <sellerToken>
```

*(auction must be in draft or upcoming status — not live or sold)*

Expected — `200 OK`:
```json
{ "success": true, "message": "Auction deleted successfully" }
```

---

## 80. Delete Auction — Live auction blocked

Attempt to delete an auction with `"status": "live"`.

Expected — `400 Bad Request`:
```json
{ "success": false, "message": "Cannot delete a live or sold auction" }
```

---

## 81. Delete Auction — Wrong owner

**DELETE** `{{baseUrl}}/auctions/<auctionId>`

Headers:
```
Authorization: Bearer <differentSellerToken>
```

Expected — `403 Forbidden`:
```json
{ "success": false, "message": "You do not own this auction" }
```

---

## 82. Any Auction Route — No token

**GET** `{{baseUrl}}/auctions`

No Authorization header.

Expected — `401 Unauthorized`:
```json
{ "success": false, "message": "Authentication required" }
```

---

## Auction Endpoint Summary

| # | Method | Endpoint                              | Role        | Description                          |
|---|--------|---------------------------------------|-------------|--------------------------------------|
| 1 | GET    | /auctions                             | Any auth    | Browse all public auctions           |
| 2 | GET    | /auctions/:id                         | Any auth    | View single auction detail           |
| 3 | GET    | /auctions/my                          | Seller      | View own auctions (all statuses)     |
| 4 | POST   | /auctions                             | Seller      | Create auction                       |
| 5 | PATCH  | /auctions/:id                         | Seller      | Update own auction                   |
| 6 | DELETE | /auctions/:id                         | Seller      | Delete own auction (not live/sold)   |
| 7 | POST   | /auctions/:id/images                  | Seller      | Upload images (multipart, max 8)     |
| 8 | DELETE | /auctions/:id/images/:filename        | Seller      | Remove single image                  |
| — | GET    | /uploads/auctions/:filename           | Public      | Serve uploaded image (static)        |


---

# Bid API — Thunder Client Test Examples

Base URL: `http://localhost:5000/api/v1`

**Tokens needed:**
- `buyerToken`  — from POST /auth/login with a buyer account
- `sellerToken` — from POST /auth/login with a seller account
- `<auctionId>` — from a live/ending_soon auction (status must be live)

**Setup required before running bid tests:**
1. Create a seller account and log in → get `sellerToken`
2. Create a buyer account and log in → get `buyerToken`
3. Create a category → get `<categoryId>`
4. Create an auction with `startTime` in the past so status = `"live"` → get `<auctionId>`
   - `startingPrice: 100`, `minIncrement: 10`

---

## 83. Place First Bid (buyer)

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Headers:
```
Authorization: Bearer <buyerToken>
Content-Type: application/json
```

Body:
```json
{ "amount": 100 }
```

Expected — `201 Created`:
```json
{
  "success": true,
  "bid": {
    "id": "<bidId>",
    "auction": {
      "id": "<auctionId>",
      "title": "Vintage Leica M6 Film Camera",
      "status": "live",
      "currentBid": 100
    },
    "bidder": { "name": "Ayesha Muneer", "username": "ayesha_m", "avatar": null },
    "amount": 100,
    "status": "winning",
    "createdAt": "..."
  }
}
```

> Auction's `currentBid` is now `100`, `highestBidder` = buyer, `bids` = 1.

---

## 84. Place Higher Bid (same or different buyer)

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Headers:
```
Authorization: Bearer <buyerToken>
Content-Type: application/json
```

Body:
```json
{ "amount": 115 }
```

Expected — `201 Created` with `"status": "winning"` and `"amount": 115`

> Previous bid of $100 is now `"status": "outbid"` in the Bid collection.
> Auction `currentBid` = 115, `bids` = 2.

---

## 85. Place Bid — Amount too low (below starting price)

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Body:
```json
{ "amount": 50 }
```

*(On an auction with `startingPrice: 100` and no bids yet)*

Expected — `400 Bad Request`:
```json
{
  "success": false,
  "message": "Bid must be at least the starting price of $100.00"
}
```

---

## 86. Place Bid — Amount too low (doesn't meet minIncrement)

After a bid of $115 exists with `minIncrement: 10`:

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Body:
```json
{ "amount": 120 }
```

Expected — `400 Bad Request`:
```json
{
  "success": false,
  "message": "Bid must be at least $125.00 (current bid $115.00 + minimum increment $10.00)"
}
```

---

## 87. Place Bid — Seller tries to bid (forbidden)

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Headers:
```
Authorization: Bearer <sellerToken>
```

Body:
```json
{ "amount": 500 }
```

Expected — `403 Forbidden`:
```json
{
  "success": false,
  "message": "Forbidden – insufficient permissions"
}
```

> `authorize('buyer')` blocks this at the route level before the service runs.

---

## 88. Place Bid — Auction owner bids on own auction

Create a second buyer account who is also the auction seller (edge case test).
The service-level guard catches this:

Expected — `403 Forbidden`:
```json
{
  "success": false,
  "message": "You cannot bid on your own auction"
}
```

---

## 89. Place Bid — Auction not yet started (upcoming)

**POST** `{{baseUrl}}/auctions/<upcomingAuctionId>/bids`

Body:
```json
{ "amount": 500 }
```

Expected — `400 Bad Request`:
```json
{
  "success": false,
  "message": "This auction has not started yet"
}
```

---

## 90. Place Bid — Auction already ended

**POST** `{{baseUrl}}/auctions/<endedAuctionId>/bids`

Body:
```json
{ "amount": 500 }
```

Expected — `400 Bad Request`:
```json
{
  "success": false,
  "message": "This auction has already ended"
}
```

---

## 91. Place Bid — Validation failure (missing amount)

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Body:
```json
{}
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Bid amount is required" }
  ]
}
```

---

## 92. Place Bid — Validation failure (amount zero)

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

Body:
```json
{ "amount": 0 }
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Bid amount must be a positive number" }
  ]
}
```

---

## 93. Place Bid — Invalid auction ID

**POST** `{{baseUrl}}/auctions/not-a-mongo-id/bids`

Body:
```json
{ "amount": 200 }
```

Expected — `422 Unprocessable Entity`:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "auctionId", "message": "Invalid auction ID" }
  ]
}
```

---

## 94. Get Auction Bid History (any authenticated user)

**GET** `{{baseUrl}}/auctions/<auctionId>/bids`

Headers:
```
Authorization: Bearer <buyerToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "auction": { "id": "...", "title": "Vintage Leica M6 Film Camera", "status": "live" },
  "bids": [
    {
      "id": "...",
      "bidder": { "name": "Ayesha Muneer", "username": "ayesha_m", "avatar": null },
      "amount": 115,
      "status": "winning",
      "createdAt": "..."
    },
    {
      "id": "...",
      "bidder": { "name": "Ayesha Muneer", "username": "ayesha_m", "avatar": null },
      "amount": 100,
      "status": "outbid",
      "createdAt": "..."
    }
  ],
  "pagination": { "total": 2, "page": 1, "limit": 20, "pages": 1 }
}
```

---

## 95. Get Auction Bid History — Paginated

**GET** `{{baseUrl}}/auctions/<auctionId>/bids?page=1&limit=5`

Expected — `200 OK` (max 5 bids, highest first)

---

## 96. Get My Bids (buyer)

**GET** `{{baseUrl}}/bids/my`

Headers:
```
Authorization: Bearer <buyerToken>
```

Expected — `200 OK`:
```json
{
  "success": true,
  "bids": [
    {
      "id": "...",
      "amount": 115,
      "status": "winning",
      "createdAt": "...",
      "auction": {
        "title": "Vintage Leica M6 Film Camera",
        "status": "live",
        "currentBid": 115,
        "category": { "name": "Photography", "slug": "photography" },
        "seller": { "name": "Ahmed Raza", "username": "ahmed_sells" }
      }
    }
  ],
  "summary": {
    "totalBids": 2,
    "winning": 1,
    "outbid": 1,
    "won": 0,
    "lost": 0,
    "totalAmount": 215
  },
  "pagination": { "total": 2, "page": 1, "limit": 12, "pages": 1 }
}
```

---

## 97. Get My Bids — Filter by status

**GET** `{{baseUrl}}/bids/my?status=winning`

Expected — `200 OK` (only winning bids)

---

## 98. Get My Bids — Filter outbid

**GET** `{{baseUrl}}/bids/my?status=outbid`

Expected — `200 OK` (only outbid bids)

---

## 99. Get My Bids — Seller forbidden

**GET** `{{baseUrl}}/bids/my`

Headers:
```
Authorization: Bearer <sellerToken>
```

Expected — `403 Forbidden`:
```json
{
  "success": false,
  "message": "Forbidden – insufficient permissions"
}
```

---

## 100. Any Bid Route — No token

**POST** `{{baseUrl}}/auctions/<auctionId>/bids`

No Authorization header.

Expected — `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Bid Endpoint Summary

| # | Method | Endpoint                        | Role     | Description                                  |
|---|--------|---------------------------------|----------|----------------------------------------------|
| 1 | POST   | /auctions/:auctionId/bids       | Buyer    | Place a bid on a live auction                |
| 2 | GET    | /auctions/:auctionId/bids       | Any auth | View full bid history (highest → lowest)     |
| 3 | GET    | /bids/my                        | Buyer    | Personal bid history + summary stats         |

### Business Rules Enforced

| Rule | Enforced at |
|---|---|
| Only buyers can place bids | Route — `authorize('buyer')` |
| Sellers cannot bid on any auction | Route — `authorize('buyer')` blocks seller role |
| Auction owner cannot bid on own auction | Service — seller ID comparison |
| Auction must be live or ending_soon | Service — status check with auto-sync |
| Amount must meet starting price (first bid) | Service — floor calculation |
| Amount must exceed current bid + minIncrement | Service — floor calculation |
| Previous winning bid marked outbid atomically | Service — `Bid.updateMany` before insert |
| Auction currentBid + highestBidder updated atomically | Service — `findByIdAndUpdate` with `$set` + `$inc` |
