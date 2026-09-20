# Grandma's Jewel Box

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval. Enable Lovable Cloud for database, auth/admin access, storage, and order handling.

User Request:
Build a complete, simple, polished e-commerce website for selling a personal collection of vintage and collectible jewelry ("Grandma's Vintage Jewelry").

Aesthetic & Branding:
- Temporary store name: "Grandma's Vintage Jewelry" (make this configurable / easy to update).
- Elegant, boutique-like, warm, antique aesthetic. Not flashy, not cluttered, not dropshippy.
- Palette: Ivory/cream background, subtle black/charcoal typography, muted antique-gold accents, tasteful dark contrast sections where appropriate.
- Tasteful serif headings, clean legible body font, subtle fine borders, ornamental dividers, and vintage details.
- No ungrounded claims: Never claim pieces are authentic, antique, designer, real gold, or precious gems unless explicitly entered by the owner.

Customer Storefront & Pages:
1. Home:
   - Hero: "Vintage Pieces With a Story" and description "Explore a carefully collected selection of vintage jewelry, brooches, necklaces, pins, and unique pieces." with a prominent "Shop the Collection" CTA.
   - Featured products section.
   - "One of a Kind" section explaining individual listings and limited stock.
   - "About the Collection" section highlighting its personal family collection origins.
   - Footer with navigation, contact info, shipping/returns, policies, and social links.
2. Shop:
   - Clean product grid: photography, title, price, category, stock status, badges ("One of a Kind", "Vintage", "New Listing").
   - Filter by categories: Brooches & Pins, Necklaces, Earrings, Bracelets, Rings, Sets, Other Vintage Pieces.
   - Sort by: Newest, Price low to high, Price high to low.
3. Product Detail:
   - Large photo gallery with thumbnail selector and zoom capability.
   - Title, price, description, condition, approximate dimensions, materials (if known), brand (if known), era/age (if known), quantity, shipping info.
   - Add to Cart, Buy Now, "One of a Kind" indicator.
4. Cart & Checkout:
   - Cart slideover/page: adjust quantity, remove items, subtotal, shipping, total, proceed to checkout.
   - Checkout flow: customer details, shipping address, order summary, and Stripe checkout integration structure with clear instructions/placeholders for live keys.
   - Inventory protection: enforce one-of-a-kind / stock limits so items with 0 inventory cannot be purchased.
5. Content Pages:
   - About, Contact (inquiry form routing to configurable owner email), Shipping & Returns, Privacy Policy, Terms of Service.
   - Clean SEO metadata, Open Graph tags, and structured data.

Admin & Inventory Dashboard:
- Simple password/auth-protected admin dashboard.
- Fast workflow: Add Product -> Upload/attach photos -> Name -> Price -> Category -> Condition, Dimensions, Materials, Brand, Era -> Publish.
- Edit, mark as sold, adjust inventory, delete products.
- Order management: list orders with order number, customer details, date, items, total, payment status, and fulfillment status (New, Processing, Shipped, Completed, Cancelled) plus tracking number field.

Data & Seed Content:
- Seed with realistic, tasteful vintage jewelry sample items (brooches, pearl necklaces, floral rhinestone pins, gold-tone clips) using high quality vintage jewelry imagery, clearly labeled as sample data with a quick option to clear or replace them.
- Fully responsive across mobile, tablet, and desktop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/155f806c-c309-4676-87df-89468e1ce4c7).

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
