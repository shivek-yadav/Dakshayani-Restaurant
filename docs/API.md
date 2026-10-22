# API Reference — Dakshayani

Base URL: `http://localhost:5000/api/v1`. All client HTTP requests include browser session cookies (`withCredentials:true`). Browser write requests must originate from a configured `CLIENT_URL`.

## Public

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API/MongoDB state |
| GET | `/settings/public` | Published restaurant information and public feature switches |
| GET | `/categories` | Public menu categories |
| GET | `/menu` | Published food listing; `?featured=true`, `?category=<id>`, `?search=<term>` |
| GET | `/menu/:slug` | Dish detail |
| GET | `/gallery` | Published image gallery |
| GET | `/testimonials` | Approved reviews |
| GET | `/faqs` | Published FAQs |
| GET | `/pages/:slug` | Published CMS content |
| POST | `/inquiries` | Contact form `{name,email,phone?,subject?,message}` |

## Authentication

| Method | Endpoint | Body / notes |
|---|---|---|
| POST | `/auth/register` | `{name,email,password,phone?}` |
| POST | `/auth/login` | `{email,password}`; sets HttpOnly cookie |
| POST | `/auth/logout` | Clears browser cookie |
| GET | `/auth/me` | Current logged-in profile |
| POST | `/auth/forgot-password` | `{email}`; requires SMTP for email delivery |
| POST | `/auth/reset-password` | `{token,password}` |

## Customer (requires `customer` role)

| Method | Endpoint | Notes |
|---|---|---|
| GET, PATCH | `/account` | Own profile; PATCH allows `name`, `phone` |
| POST | `/orders` | `{items:[{id,quantity}],fulfillment:'pickup'|'delivery',address?,notes?}`; price validated server-side |
| GET | `/orders/my` | Own order history |
| GET | `/orders/my/:id` | Own order detail |
| POST | `/bookings` | `{date:'YYYY-MM-DD',time:'HH:mm',guests,name,email,phone,occasion?,notes?}` |
| GET | `/bookings/my` | Own booking history |
| PATCH | `/bookings/my/:id/cancel` | Cancel only own pending/confirmed reservations |

## Admin (requires `admin` role)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/admin/auth/login` | `{email,password}`; separate role check |
| GET | `/admin/auth/me` | Admin profile |
| GET | `/admin/dashboard` | Today's orders, pending reservations, paid revenue, customers and recent activity |
| GET, POST | `/admin/menu`, `/admin/categories` | Manage menu / categories |
| PATCH, DELETE | `/admin/menu/:id`, `/admin/categories/:id` | Edit or delete (history protections) |
| GET, POST, PATCH, DELETE | `/admin/gallery`, `/admin/gallery/:id` | Gallery management |
| GET, POST, PATCH, DELETE | `/admin/faqs`, `/admin/faqs/:id` | FAQ management |
| GET, POST, PATCH, DELETE | `/admin/testimonials`, `/admin/testimonials/:id` | Testimonial moderation |
| GET | `/admin/orders` | `?status=` optional |
| PATCH | `/admin/orders/:id/status` | `{status}` with valid state transitions |
| PATCH | `/admin/orders/:id/payment` | `{paymentStatus:'unpaid'|'paid'|'refunded'}` (offline records only) |
| GET | `/admin/bookings` | `?status=` optional |
| PATCH | `/admin/bookings/:id/status` | `{status,adminNote?}` |
| GET | `/admin/customers` | Registered customers |
| PATCH | `/admin/customers/:id/status` | `{status:'active'|'blocked'}` |
| GET, PATCH | `/admin/inquiries`, `/admin/inquiries/:id` | Inbox and internal notes |
| GET | `/admin/content` | All page records |
| PUT | `/admin/content/:slug` | Update or create page content |
| GET, PATCH | `/admin/settings` | Business operations and working hours |
| GET | `/admin/reports` | Sales/booking aggregations |
| GET | `/admin/activity` | Admin audit trail |
| POST | `/admin/upload` | `multipart/form-data` `image` (max 5 MB); requires ImageKit keys |

## Order status lifecycle

`placed -> accepted -> preparing -> ready -> completed`; `placed` can also go to `rejected` or `cancelled`; `accepted` can go to `cancelled`. Final statuses cannot be changed. Payment is a **separate** `unpaid / paid / refunded` value.

## Booking lifecycle

`pending -> confirmed -> completed`, or `pending -> rejected/cancelled`, or `confirmed -> cancelled`. Customers can cancel their own pending/confirmed bookings.

## Manual verification after seeding

1. Open `/menu`, filter categories, add 2 dishes and change quantities in `/cart`.
2. Sign in as `guest@dakshayani.local` with the local demonstration password; submit a pickup order. Verify it appears under `/account/orders`.
3. Sign in to `/admin/login` using credentials from `.env`; accept the order and progress it through kitchen statuses.
4. Sign in again as the customer; verify the updated status is visible.
5. Submit a future reservation via `/booking` and confirm it under `/admin/bookings`.
6. Add/edit a dish via `/admin/menu`; verify the public `/menu` reflects it.
7. Change the Home hero title under `/admin/content` and check the public homepage.
8. Add a gallery image URL and confirm its appearance on `/gallery`.
9. Send a Contact message and manage it under `/admin/inquiries`.
10. Mark a completed order payment as paid **manually** and verify the dashboard/reports aggregate changes.

**Warning:** The demo has not been connected to a live MongoDB Atlas cluster or live ImageKit account in this package. You must validate these integrations in your environment.
