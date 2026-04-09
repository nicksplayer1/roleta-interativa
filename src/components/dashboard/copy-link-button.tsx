"use client";

import { useState } from "react";

type Props = {
  url: string;
};

export default function CopyLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
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
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
    >
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}
