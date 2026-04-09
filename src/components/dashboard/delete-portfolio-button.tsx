"use client";

import { useRef } from "react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
};

export default function DeletePortfolioButton({ action, id }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja excluir este portfólio?");
    if (!confirmed) return;

    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form ref={formRef} action={action} className="hidden">
        <input type="hidden" name="id" value={id} />
      </form>

      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Excluir
      </button>
    </>
  );
}
