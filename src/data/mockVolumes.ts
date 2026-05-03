export type VolumeColor = "sepia" | "slate" | "forest" | "cream";

export interface Volume {
  id: string;
  title: string;
  subtitle: string;
  range: string;
  entries: number;
  color: VolumeColor;
}

export const mockVolumes: Volume[] = [
  { id: "2026-i", title: "2026", subtitle: "Volume I", range: "Jan – Apr", entries: 47, color: "sepia" },
  { id: "2025-iii", title: "2025", subtitle: "Volume III", range: "Sep – Dec", entries: 62, color: "slate" },
  { id: "2025-ii", title: "2025", subtitle: "Volume II", range: "May – Aug", entries: 58, color: "forest" },
  { id: "2025-i", title: "2025", subtitle: "Volume I", range: "Jan – Apr", entries: 51, color: "cream" },
  { id: "2024-ii", title: "2024", subtitle: "Volume II", range: "Jul – Dec", entries: 84, color: "sepia" },
  { id: "2024-i", title: "2024", subtitle: "Volume I", range: "Jan – Jun", entries: 73, color: "slate" },
];