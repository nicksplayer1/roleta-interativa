import { WheelOption } from "@/types/wheel";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function makeWheelSlug(title: string) {
  const base = slugify(title || "roleta");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export function getDefaultOptions(): WheelOption[] {
  return [
    { label: "Opção 1", color: "#f97316" },
    { label: "Opção 2", color: "#22c55e" },
    { label: "Opção 3", color: "#3b82f6" },
    { label: "Opção 4", color: "#eab308" },
  ];
}

export function normalizeOptions(options: WheelOption[]) {
  return options
    .map((item) => ({
      label: item.label.trim(),
      color: item.color || "#3b82f6",
    }))
    .filter((item) => item.label.length > 0);
}