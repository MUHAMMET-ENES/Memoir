import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useProfile } from "./useProfile";

const LAST_FIRED_KEY = "memoir.reminder.lastFired";

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function alreadyFiredToday(): boolean {
  try {
    return localStorage.getItem(LAST_FIRED_KEY) === dayKey(new Date());
  } catch {
    return false;
  }
}

function markFiredToday() {
  try {
    localStorage.setItem(LAST_FIRED_KEY, dayKey(new Date()));
  } catch {
    // ignore
  }
}

export function fireReminderNotification(displayName?: string) {
  const greeting = displayName?.trim() ? `${displayName.trim()}, ` : "";
  const title = "A quiet moment for Memoir";
  const body = `${greeting}your page is waiting. Just a line or two.`;

  // Native notification when permitted (works on desktop browsers / installed PWAs).
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      try {
        new Notification(title, { body, silent: true, tag: "memoir-daily" });
      } catch {
        // ignore — fall back to toast only
      }
    }
  }

  toast(title, {
    description: body,
    duration: 8000,
    action: {
      label: "Write",
      onClick: () => {
        if (typeof window !== "undefined") window.location.href = "/";
      },
    },
  });
}

/**
 * Schedules a gentle in-app reminder at the user's chosen time.
 * Local-only — uses setTimeout + a short polling interval to survive tab sleep.
 */
export function useDailyReminder() {
  const { profile, hydrated } = useProfile();
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;

    const parsed = parseTime(profile.reminderTime);
    if (!parsed) return;

    function clearTimers() {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function scheduleNext() {
      if (!parsed) return;
      const now = new Date();
      const target = new Date();
      target.setHours(parsed.hour, parsed.minute, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const delay = Math.max(1000, target.getTime() - now.getTime());
      timerRef.current = window.setTimeout(() => {
        if (!alreadyFiredToday()) {
          fireReminderNotification(profile.displayName);
          markFiredToday();
        }
        scheduleNext();
      }, delay);
    }

    // Safety net: every 60s, check if we crossed the target while the tab was
    // backgrounded / throttled, and fire once if we missed it today.
    function startWatchdog() {
      intervalRef.current = window.setInterval(() => {
        if (!parsed) return;
        if (alreadyFiredToday()) return;
        const now = new Date();
        const target = new Date();
        target.setHours(parsed.hour, parsed.minute, 0, 0);
        if (now.getTime() >= target.getTime() && now.getTime() - target.getTime() < 12 * 60 * 60 * 1000) {
          fireReminderNotification(profile.displayName);
          markFiredToday();
        }
      }, 60_000);
    }

    clearTimers();
    scheduleNext();
    startWatchdog();

    return clearTimers;
  }, [hydrated, profile.reminderTime, profile.displayName]);
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return "default";
  }
}