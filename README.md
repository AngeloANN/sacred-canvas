# Sacred Canvas

Build an art e-commerce website for selling my canvas artwork. The vibe is dark, sacred, and museum-like. Use React + Tailwind, Supabase for auth and database, and Stripe for checkout. FONTS - Headings/logo: "Grenze Gotisch" (Google Fonts), gothic but readable, not heavy blackletter. - Body text: "Cormorant Garamond". HEADER (all pages) - White background, black text, thin bottom border. - Left: nav links "Home" and "Gallery". - Right: cart icon with item count badge, and a user/account icon. - User icon opens login/sign up (Supabase auth). Logged-in users get an Account page to save full name, shipping address, phone, and view past orders. HOME PAGE (intro scene) - Full-screen pure black background (#000). - Left side: a single transparent PNG of a lamp with a mask hanging on it (I will upload lamp.png; use a placeholder for now). - Start state: the lamp image is almost invisible (CSS filter brightness ~0.08, slightly desaturated), like the room is dark. - After ~1 second, the lamp "turns on": 2–3 quick subtle flickers, then brightness animates to 1 and saturation returns. At the same time, a warm orange radial glow fades in, centered on the bulb, spreading softly onto the black background. - After the lamp is on, fade in on the right side: "ICXC" large in Grenze Gotisch, off-white with a faint warm glow. Directly underneath, smaller: "Talitha cumi". - Below that, a subtle "Enter the Gallery" link. - Include a "skip intro" option and respect prefers-reduced-motion. - On mobile: lamp on top, text below. GALLERY PAGE (virtual museum) - Each artwork is displayed alone on a light gray museum wall with soft top-down spotlight lighting and a realistic drop shadow, like it's hung in a gallery. - Below each piece, a small white museum placard: title, year, medium. - Large left and right arrows to navigate between pieces (also keyboard arrows and swipe on mobile). - Transition between pieces: a 3D camera-turn effect, like the viewer is turning to face the next wall. Use CSS 3D transforms (perspective + rotateY) over ~800ms with easing. - Clicking the artwork or the wall opens the Artwork Detail view. ARTWORK DETAIL VIEW - H1 = artwork title in Grenze Gotisch. - Ambient music starts playing on open (each artwork can have its own audio file, with a default track). Show a small audio control with play/pause and mute. Remember the mute preference across pieces. - Large image of the piece, preview updates live when a frame is selected. - Details: width, height, medium, year, short description/story. - Frame selector: No frame, Black, Gold ornate, Natural wood, White (each with its own price add-on). - Price updates based on frame choice. - "Add to Cart" button. Cart drawer slides in from the right. CART + CHECKOUT - Cart shows items, frame choice, quantity, subtotal. - Checkout requires login; prefill name and address from the user's account. - Pay with Stripe Checkout. Save orders to Supabase. ADMIN - Simple admin page (only for my account) to add/edit artworks: title, year, medium, dimensions, description, base price, image upload, audio upload, and available frames. DATABASE (Supabase) - artworks, frames, profiles, orders, order_items. Overall feel: minimal, cinematic, reverent. Lots of negative space. Smooth animations, nothing cheesy.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da216331-492f-4665-9f1d-e548e63f1bbe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
