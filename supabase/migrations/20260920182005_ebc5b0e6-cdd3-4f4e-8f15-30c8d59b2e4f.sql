
-- roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- settings
create table public.store_settings (
  id boolean primary key default true,
  store_name text not null default 'Grandma''s Vintage Jewelry',
  tagline text not null default 'Vintage Pieces With a Story',
  owner_email text not null default 'hello@example.com',
  contact_phone text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  shipping_flat_cents integer not null default 800,
  free_shipping_over_cents integer not null default 15000,
  updated_at timestamptz not null default now(),
  constraint store_settings_singleton check (id)
);
grant select on public.store_settings to anon, authenticated;
grant all on public.store_settings to service_role;
grant insert, update on public.store_settings to authenticated;
alter table public.store_settings enable row level security;
create policy "settings public read" on public.store_settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.store_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.store_settings (id) values (true);

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  price_cents integer not null default 0,
  category text not null default 'Other Vintage Pieces',
  condition text not null default '',
  dimensions text not null default '',
  materials text not null default '',
  brand text not null default '',
  era text not null default '',
  quantity integer not null default 1,
  one_of_a_kind boolean not null default true,
  published boolean not null default true,
  featured boolean not null default false,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "published products readable" on public.products for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "products admin write" on public.products for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;
grant all on public.product_images to service_role;
alter table public.product_images enable row level security;
create policy "product images readable" on public.product_images for select to anon, authenticated using (true);
create policy "product images admin write" on public.product_images for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  city text not null default '',
  state text not null default '',
  postal_code text not null default '',
  country text not null default '',
  notes text not null default '',
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  total_cents integer not null default 0,
  payment_status text not null default 'unpaid',
  fulfillment_status text not null default 'New',
  tracking_number text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders admin read" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "orders admin write" on public.orders for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  unit_price_cents integer not null default 0,
  quantity integer not null default 1,
  image_url text not null default ''
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order items admin read" on public.order_items for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.inquiries to anon, authenticated;
grant select, delete on public.inquiries to authenticated;
grant all on public.inquiries to service_role;
alter table public.inquiries enable row level security;
create policy "anyone can send inquiry" on public.inquiries for insert to anon, authenticated with check (true);
create policy "inquiries admin read" on public.inquiries for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "inquiries admin delete" on public.inquiries for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- sample data
insert into public.products (slug,title,description,price_cents,category,condition,dimensions,materials,brand,era,quantity,one_of_a_kind,featured,is_sample) values
('gold-tone-floral-brooch','Gold-Tone Floral Spray Brooch','A gold-tone floral spray brooch with faux pearl centers and small clear stones. Sample listing.',4800,'Brooches & Pins','Good vintage condition, light surface wear','Approx. 2.5 in x 1.5 in','Gold-tone metal, faux pearls, clear stones','','Unknown',1,true,true,true),
('cream-pearl-strand','Cream Faux Pearl Strand Necklace','A single strand of cream faux pearls with a decorative clasp. Sample listing.',3600,'Necklaces','Very good, clasp works smoothly','Approx. 18 in length','Faux pearls, gold-tone clasp','','Unknown',1,true,true,true),
('knot-clip-earrings','Gold-Tone Knot Clip Earrings','A pair of gold-tone knot clip-on earrings set with small clear stones. Sample listing.',2800,'Earrings','Good, clips hold firmly','Approx. 0.9 in','Gold-tone metal, clear stones','','Unknown',1,true,true,true),
('rhinestone-flower-pin','Rhinestone Flower Spray Pin','A sparkling clear-stone flower spray pin on a light metal setting. Sample listing.',5200,'Brooches & Pins','Good, all stones present','Approx. 3 in x 1.6 in','Light metal, clear rhinestones','','Unknown',1,true,false,true),
('bangle-bracelet','Textured Gold-Tone Bangle','A slim textured gold-tone bangle bracelet. Sample listing.',3200,'Bracelets','Good, minor scuffs','Approx. 2.6 in inner diameter','Gold-tone metal','','Unknown',1,true,false,true),
('pearl-set','Pearl Necklace & Earring Set','A matching faux pearl necklace and clip earring set. Sample listing.',6400,'Sets','Very good','Necklace approx. 16 in','Faux pearls, gold-tone metal','','Unknown',1,true,false,true);

insert into public.product_images (product_id,url,position)
select id, '/products/brooch-floral.jpg', 0 from public.products where slug='gold-tone-floral-brooch';
insert into public.product_images (product_id,url,position)
select id, '/products/pearl-necklace.jpg', 0 from public.products where slug='cream-pearl-strand';
insert into public.product_images (product_id,url,position)
select id, '/products/clip-earrings.jpg', 0 from public.products where slug='knot-clip-earrings';
insert into public.product_images (product_id,url,position)
select id, '/products/rhinestone-pin.jpg', 0 from public.products where slug='rhinestone-flower-pin';
insert into public.product_images (product_id,url,position)
select id, '/products/bangle-bracelet.jpg', 0 from public.products where slug='bangle-bracelet';
insert into public.product_images (product_id,url,position)
select id, '/products/pearl-set.jpg', 0 from public.products where slug='pearl-set';
