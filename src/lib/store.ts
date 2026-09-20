export const CATEGORIES = [
  "Brooches & Pins",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Rings",
  "Sets",
  "Other Vintage Pieces",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ProductImage = { id: string; url: string; position: number };

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  category: string;
  condition: string;
  dimensions: string;
  materials: string;
  brand: string;
  era: string;
  quantity: number;
  one_of_a_kind: boolean;
  published: boolean;
  featured: boolean;
  is_sample: boolean;
  created_at: string;
  product_images: ProductImage[];
};

export type StoreSettings = {
  store_name: string;
  tagline: string;
  owner_email: string;
  contact_phone: string;
  instagram_url: string;
  facebook_url: string;
  shipping_flat_cents: number;
  free_shipping_over_cents: number;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "Grandma's Vintage Jewelry",
  tagline: "Vintage Pieces With a Story",
  owner_email: "hello@example.com",
  contact_phone: "",
  instagram_url: "",
  facebook_url: "",
  shipping_flat_cents: 800,
  free_shipping_over_cents: 15000,
};

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function primaryImage(product: Pick<Product, "product_images">) {
  const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
  return images[0]?.url ?? "/products/brooch-floral.jpg";
}

export function sortedImages(product: Pick<Product, "product_images">) {
  const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
  return images.length ? images : [{ id: "fallback", url: primaryImage(product), position: 0 }];
}

export function isNewListing(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 24 * 21;
}

export function shippingFor(subtotalCents: number, settings: StoreSettings) {
  if (subtotalCents <= 0) return 0;
  if (settings.free_shipping_over_cents > 0 && subtotalCents >= settings.free_shipping_over_cents)
    return 0;
  return settings.shipping_flat_cents;
}

export const FULFILLMENT_STATUSES = [
  "New",
  "Processing",
  "Shipped",
  "Completed",
  "Cancelled",
] as const;
