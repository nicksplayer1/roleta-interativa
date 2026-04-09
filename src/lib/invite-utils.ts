export function slugifyInviteTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ensureUrl(value: string | null | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function formatDateBr(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTimeBr(value: string | null | undefined) {
  if (!value) return "";
  return value.slice(0, 5);
}

export function formatThemeLabel(value: string | null | undefined) {
  switch (value) {
    case "elegante":
      return "Elegante";
    case "romantico":
      return "Romântico";
    case "infantil":
      return "Infantil";
    case "minimalista":
      return "Minimalista";
    case "festa":
      return "Festa";
    default:
      return "Personalizado";
  }
}

export function countdownParts(date: string | null | undefined, time: string | null | undefined) {
  if (!date) return null;

  const eventDate = new Date(`${date}T${time || "12:00"}:00`);
  const now = new Date();

  const diff = eventDate.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes, isPast: false };
}
