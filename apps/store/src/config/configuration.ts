export default () => ({
  secret: process.env.SECRET,
  refreshSecret: process.env.SECRET_REFRESH,
  supabaseURL: process.env.SUPABASE_URL,
  supabaseKEY: process.env.SUPABASE_KEY,
  supabaseBucket: 'tim-store-images',
})
