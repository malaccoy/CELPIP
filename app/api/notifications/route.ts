import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// GET — list notifications for current user (unread first)
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      reads: {
        where: { userId },
        select: { readAt: true },
      },
    },
  });

  const items = notifications.map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    createdAt: n.createdAt.toISOString(),
    read: n.reads.length > 0,
  }));

  const unreadCount = items.filter((i: any) => !i.read).length;

  return NextResponse.json({ notifications: items, unreadCount });
}

// POST — create notification (admin only) or mark as read
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Admin: create notification (no auth needed, uses secret header)
  if (body.title && body.message) {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== (process.env.ADMIN_NOTIFICATION_SECRET || 'notify-celpip-2026')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const notification = await prisma.notification.create({
      data: {
        title: body.title,
        message: body.message,
        type: body.type || 'info',
        link: body.link || null,
      },
    });
    return NextResponse.json({ ok: true, id: notification.id });
  }

  // User actions: read / readAll
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (body.action === 'read' && body.notificationId) {
    await prisma.notificationRead.upsert({
      where: {
        userId_notificationId: {
          userId,
          notificationId: body.notificationId,
        },
      },
      update: {},
      create: { userId, notificationId: body.notificationId },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'readAll') {
    const unread = await prisma.notification.findMany({
      where: { reads: { none: { userId } } },
      select: { id: true },
    });
    if (unread.length > 0) {
      await prisma.notificationRead.createMany({
        data: unread.map((n: any) => ({ userId, notificationId: n.id })),
        skipDuplicates: true,
      });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
