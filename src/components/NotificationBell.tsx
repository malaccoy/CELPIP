'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, CheckCheck, ExternalLink } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  createdAt: string;
  read: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  info: '📢',
  update: '🚀',
  promo: '🎉',
  alert: '⚠️',
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60s for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const markAsRead = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', notificationId: id }),
    }).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'readAll' }),
    }).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markAsRead(n.id);
    if (n.link) window.location.href = n.link;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: 6,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Bell size={26} color={unreadCount > 0 ? '#f59e0b' : '#888'} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: '#ef4444',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: '50%',
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: 320,
          maxHeight: 420,
          overflowY: 'auto',
          background: '#1a1f2e',
          border: '1px solid #2a3040',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 9999,
          fontFamily: 'system-ui, sans-serif',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px 8px',
            borderBottom: '1px solid #2a3040',
          }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
              Notifications
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#4fc3f7',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div style={{ padding: '30px 14px', textAlign: 'center', color: '#666' }}>
              <Bell size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: 13 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #1e2435',
                  cursor: n.link ? 'pointer' : 'default',
                  background: n.read ? 'transparent' : 'rgba(79,195,247,0.06)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1e2a3a')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(79,195,247,0.06)')}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{TYPE_ICONS[n.type] || '📢'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        color: n.read ? '#aaa' : '#fff',
                        fontWeight: n.read ? 400 : 600,
                        fontSize: 13,
                      }}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: '#4fc3f7',
                          flexShrink: 0,
                        }} />
                      )}
                      {n.link && <ExternalLink size={11} color="#666" />}
                    </div>
                    <p style={{
                      color: '#888',
                      fontSize: 12,
                      margin: '2px 0 0',
                      lineHeight: 1.4,
                    }}>
                      {n.message}
                    </p>
                    <span style={{ color: '#555', fontSize: 11 }}>{timeAgo(n.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
