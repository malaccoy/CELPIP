const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
  // Fetch all Supabase auth users (paginated)
  let allUsers = [];
  let page = 1;
  while (true) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) { console.error('Supabase error:', error.message); break; }
    if (!users || users.length === 0) break;
    allUsers.push(...users);
    if (users.length < 100) break;
    page++;
  }
  console.log(`Supabase Auth: ${allUsers.length} users`);

  // Get existing DB users
  const dbUsers = await prisma.$queryRawUnsafe('SELECT id FROM users');
  const dbIds = new Set(dbUsers.map(u => u.id));
  console.log(`DB users: ${dbIds.size}`);

  // Find missing
  const missing = allUsers.filter(u => !dbIds.has(u.id));
  console.log(`Missing: ${missing.length}`);

  // Insert missing
  let inserted = 0;
  for (const u of missing) {
    const email = u.email || '';
    const name = u.user_metadata?.full_name || u.user_metadata?.name || null;
    const image = u.user_metadata?.avatar_url || u.user_metadata?.picture || null;
    try {
      await prisma.$queryRawUnsafe(
        `INSERT INTO users (id, email, name, image, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (id) DO NOTHING`,
        u.id, email, name, image, new Date(u.created_at)
      );
      // Also create user_plans if missing
      await prisma.$queryRawUnsafe(
        `INSERT INTO user_plans ("userId", plan, "createdAt", "updatedAt") VALUES ($1, 'free', NOW(), NOW()) ON CONFLICT ("userId") DO NOTHING`,
        u.id
      );
      console.log(`+ ${email} (${u.id.slice(0,8)}…)`);
      inserted++;
    } catch (e) {
      console.error(`FAIL ${email}: ${e.message}`);
    }
  }
  console.log(`\nInserted: ${inserted}`);
  await prisma.$disconnect();
}

sync().catch(console.error);
