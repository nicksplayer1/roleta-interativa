"use client";

export default function DownloadPdfButton() {
  function handleDownload() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
    >
      Baixar PDF
    </button>
  );
}
