# Dakshayani — Client presentation and delivery checklist

## Client approval presentation

1. Open `client-preview/index.html` and first show desktop homepage: restaurant branding, above-the-fold table request, editorial story, featured dishes and responsive imagery.
2. Demonstrate dish category filters, menu search, sample cart quantity changes and a demo reservation request. Explicitly tell the client **these preview interactions are simulated**; only the connected MERN application persists data.
3. Show the actual React app with MongoDB seed data. Register a customer, add two dishes, adjust quantity and check out with pay-on-pickup. The admin receives the order and updates the status; the customer sees it in their account.
4. Submit a real table reservation with a date/time within opening hours. Open admin booking management, confirm/reject and verify customer status.
5. Show admin dashboard, menu CRUD, ImageKit uploads (only if configured), gallery, page CMS, testimonials, reports and settings.
6. Review content to replace: restaurant legal identity, logo, owner-approved photos, addresses, hours, tax / GST, food descriptions, product pricing, contact and verified testimonials.

## Functional acceptance tests — connected MERN app

- [ ] Public Home / About / Menu / Gallery / Contact / Booking routes load on desktop and mobile.
- [ ] Menu filters work with actual MongoDB records; unavailable dishes cannot be ordered.
- [ ] Customer can register / login / logout / recover password (SMTP configured) securely.
- [ ] Cart persists refresh; checkout recalculates prices using menu data from server.
- [ ] An order is saved with item snapshots and a unique number; admin status transitions work.
- [ ] A customer cannot view another customer's order or reservation IDs.
- [ ] Booking is created as pending; admin can confirm/reject; invalid dates/hours are blocked.
- [ ] Admin navigation is separate from public navigation; non-admin role cannot call admin APIs.
- [ ] Menu/gallery/FAQ/testimonial CRUD and CMS changes are reflected in public pages.
- [ ] ImageKit upload works and private keys never reach frontend assets.
- [ ] Reports use database-backed numbers rather than hardcoded values.
- [ ] Form errors, loading and empty states are usable and accessible.
- [ ] Client name, location, hours, contact details, copyright and photography are correct.
- [ ] Production build works, routes refresh correctly, and secure cookie/session flows are verified on the chosen hosting platform.

## Business decisions to confirm before launch

- Which pickup and delivery locations are served; whether delivery is enabled at launch.
- Opening times, table capacity, lead time, rejection/cancellation policy and guest limits.
- Food prices, taxes / GST, service fees, delivery fee and receipts/invoice requirements.
- Real client brand assets, legal name, physical address, support phone/email, social profiles.
- Who is responsible for reviewing contact requests, booking requests and order dispatches.

## Deferred phase

Online gateway payments, automatic table allocation and physical kitchen/POS integrations are outside current scope. Do not imply that these are live.
