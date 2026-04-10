"use client";

import { useState } from "react";

type Props = {
  path: string;
};

export default function CopyLinkButton({ path }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const url = path.startsWith("http")
        ? path
        : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
    >
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}
