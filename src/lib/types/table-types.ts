export interface TablePreferences {
  theme: "light" | "dark";
  density: "compact" | "normal";
  columnVisibility: Record<string, boolean>;
}
