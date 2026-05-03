import { useEffect, useState } from "react";

export type FontChoice = "serif" | "sans";
export type PaperTone = "study" | "dim" | "night";
export type Tier = "free" | "plus" | "legacy";

export interface Profile {
  // Identity
  displayName: string;
  pronouns: string;
  avatarColor: string; // CSS color token name
  // Reading & writing prefs
  font: FontChoice;
  textSize: number; // 14–22
  paperTone: PaperTone;
  reminderTime: string; // "HH:MM" or ""
  // Privacy
  appLock: boolean;
  iCloudBackup: boolean;
  localBackup: boolean;
  // Subscription
  tier: Tier;
}

const STORAGE_KEY = "memoir.profile.v1";

const DEFAULT_PROFILE: Profile = {
  displayName: "Anna",
  pronouns: "she/her",
  avatarColor: "sepia",
  font: "serif",
  textSize: 17,
  paperTone: "study",
  reminderTime: "21:00",
  appLock: false,
  iCloudBackup: true,
  localBackup: true,
  tier: "free",
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile, hydrated]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function reset() {
    setProfile(DEFAULT_PROFILE);
  }

  return { profile, update, reset, hydrated };
}

export const TIER_META: Record<Tier, { label: string; tagline: string }> = {
  free: { label: "Memoir", tagline: "Your everyday journal." },
  plus: { label: "Memoir Plus", tagline: "Unlimited volumes & themes." },
  legacy: { label: "Memoir Legacy", tagline: "Heirloom prints, archival." },
};

// Local-only mock stats. In a real app these come from the entries store.
export const MOCK_STATS = {
  totalEntries: 184,
  currentStreak: 12,
  volumesPrinted: 2,
};