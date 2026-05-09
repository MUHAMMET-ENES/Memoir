
alter function public.gen_share_slug() set search_path = public;
revoke execute on function public.gen_share_slug() from public, anon, authenticated;
