"use client";

import { useState, useTransition } from "react";

type Props = {
  url: string;
};

export default function CopyInviteLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          try {
            const absoluteUrl = url.startsWith("http")
              ? url
              : `${window.location.origin}${url}`;
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            setCopied(false);
          }
        });
      }}
      className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
    >
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}
