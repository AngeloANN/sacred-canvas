# Sacred canvas storefront

## Experience
- Build a cinematic black intro at `/` with the lamp placeholder, staged flicker-to-glow animation, ICXC title, “Talitha cumi,” gallery entry, skip control, and reduced-motion handling.
- Add a persistent white, fine-bordered header with Home, Gallery, cart count, and session-aware account access.
- Build `/gallery` as a single-artwork museum wall with spotlighting, placard, keyboard buttons, swipe navigation, and an 800ms 3D wall-turn transition.
- Build artwork detail pages with live frame previews, variable pricing, ambient audio controls, and persistent mute preference.
- Add a right-side cart drawer and login-required checkout flow.
- Add protected account and admin pages for saved customer information, order history, artwork editing, uploads, audio, and frame availability.

## Content and visual system
- Use Grenze Gotisch for headings/logo and Cormorant Garamond for body text.
- Define a restrained black, white, stone, and warm amber token system with sharp museum-like spacing and minimal ornament.
- Seed a small curated set of sample artworks and frames so the gallery is usable immediately; keep the lamp asset replaceable when `lamp.png` is uploaded.

## Cloud and payments
- Enable Lovable Cloud and Stripe Checkout.
- Create secure `artworks`, `frames`, `profiles`, `orders`, `order_items`, and `user_roles` data structures with strict access rules and storage for artwork/audio uploads.
- Use email/password plus Google sign-in, confirmation-aware signup, password reset, protected account/admin access, and server-verified admin authorization.
- Create checkout sessions server-side, save pending orders before checkout, and securely update paid orders from verified Stripe events.

## Verification
- Confirm the intro, gallery controls, transitions, cart behavior, login flow, frame pricing, and mobile layout in the live preview.
- Check accessibility, reduced motion, metadata, current build status, and critical payment/auth failure states.
