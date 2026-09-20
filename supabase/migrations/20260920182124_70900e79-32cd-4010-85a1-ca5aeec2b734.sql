
create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke execute on function private.has_role(uuid, public.app_role) from public, anon;
grant execute on function private.has_role(uuid, public.app_role) to authenticated;

drop policy "published products readable" on public.products;
drop policy "products admin write" on public.products;
drop policy "product images admin write" on public.product_images;
drop policy "orders admin read" on public.orders;
drop policy "orders admin write" on public.orders;
drop policy "order items admin read" on public.order_items;
drop policy "inquiries admin read" on public.inquiries;
drop policy "inquiries admin delete" on public.inquiries;
drop policy "settings admin write" on public.store_settings;
drop policy "admins upload product photos" on storage.objects;
drop policy "admins update product photos" on storage.objects;
drop policy "admins delete product photos" on storage.objects;

drop function public.has_role(uuid, public.app_role);

create policy "published products readable" on public.products for select to anon, authenticated using (published);
create policy "products admin write" on public.products for all to authenticated
  using (private.has_role(auth.uid(),'admin')) with check (private.has_role(auth.uid(),'admin'));
create policy "product images admin write" on public.product_images for all to authenticated
  using (private.has_role(auth.uid(),'admin')) with check (private.has_role(auth.uid(),'admin'));
create policy "orders admin all" on public.orders for all to authenticated
  using (private.has_role(auth.uid(),'admin')) with check (private.has_role(auth.uid(),'admin'));
create policy "order items admin read" on public.order_items for select to authenticated using (private.has_role(auth.uid(),'admin'));
create policy "inquiries admin read" on public.inquiries for select to authenticated using (private.has_role(auth.uid(),'admin'));
create policy "inquiries admin delete" on public.inquiries for delete to authenticated using (private.has_role(auth.uid(),'admin'));
create policy "settings admin write" on public.store_settings for all to authenticated
  using (private.has_role(auth.uid(),'admin')) with check (private.has_role(auth.uid(),'admin'));
create policy "admins upload product photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-photos' and private.has_role(auth.uid(),'admin'));
create policy "admins update product photos" on storage.objects for update to authenticated
  using (bucket_id = 'product-photos' and private.has_role(auth.uid(),'admin'));
create policy "admins delete product photos" on storage.objects for delete to authenticated
  using (bucket_id = 'product-photos' and private.has_role(auth.uid(),'admin'));
