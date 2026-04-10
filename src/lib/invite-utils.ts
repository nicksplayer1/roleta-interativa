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

export function formatEventDate(value: string | null | undefined) {
  if (!value) return "";
  try {
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return value;
  }
}

export function formatEventDateCompact(value: string | null | undefined) {
  if (!value) return "";
  try {
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return value;
  }
}

export function buildMapHref(
  mapLink: string | null | undefined,
  locationAddress: string | null | undefined,
  locationName?: string | null | undefined,
) {
  if (mapLink?.trim()) return ensureUrl(mapLink);

  const query = [locationName, locationAddress].filter(Boolean).join(", ").trim();
  if (!query) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getInviteCountdownLabel(
  eventDate: string | null | undefined,
  eventTime: string | null | undefined,
) {
  if (!eventDate) return "";

  const time = eventTime?.trim() ? `${eventTime.trim()}:00` : "12:00:00";
  const target = new Date(`${eventDate}T${time}`);

  if (Number.isNaN(target.getTime())) return "";

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "O evento já começou";

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return hours > 0 ? `Faltam ${days} dia(s) e ${hours} hora(s)` : `Faltam ${days} dia(s)`;
  }

  return `Faltam ${Math.max(1, totalHours)} hora(s)`;
}
