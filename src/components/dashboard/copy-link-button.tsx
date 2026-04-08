"use client";

import { useState } from "react";

type Props = {
  path: string;
};

export default function CopyLinkButton({ path }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
    >
      {copied ? "Copiado!" : "Copiar link"}
    </button>
  );
}
