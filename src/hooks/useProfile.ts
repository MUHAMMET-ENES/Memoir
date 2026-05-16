import { useEffect, useState } from "react";

export type FontChoice = "serif" | "sans";
export type PaperTone = "study" | "dim" | "night";

export interface Profile {
  displayName: string;
  pronouns: string;
  avatarColor: string;
  font: FontChoice;
  textSize: number;
  paperTone: PaperTone;
  reminderTime: string;
  appLock: boolean;
  iCloudBackup: boolean;
  localBackup: boolean;
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
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Profile & { tier?: string }>;
        const { tier: _tier, ...prefs } = parsed;
        setProfile({ ...DEFAULT_PROFILE, ...prefs });
      }
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

export const MOCK_STATS = {
  totalInterviews: 0,
  boundVolumes: 0,
};
