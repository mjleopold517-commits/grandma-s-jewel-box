import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS, type Product, type StoreSettings } from "./store";

const PRODUCT_SELECT =
  "id,slug,title,description,price_cents,category,condition,dimensions,materials,brand,era,quantity,one_of_a_kind,published,featured,is_sample,created_at,product_images(id,url,position)";

export const settingsQuery = queryOptions({
  queryKey: ["store-settings"],
  queryFn: async (): Promise<StoreSettings> => {
    const { data, error } = await supabase
      .from("store_settings")
      .select(
        "store_name,tagline,owner_email,contact_phone,instagram_url,facebook_url,shipping_flat_cents,free_shipping_over_cents",
      )
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return data as StoreSettings;
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
});

export const allProductsQuery = queryOptions({
  queryKey: ["admin-products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
});

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Product) ?? null;
    },
  });
}
