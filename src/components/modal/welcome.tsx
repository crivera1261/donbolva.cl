import { useEffect, useState } from "react";

export function Welcome() {
  const [showEntryModal, setShowEntryModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("donbolva_visited")) {
      setShowEntryModal(true);
    }
  }, []);

  const closeEntryModal = () => {
    localStorage.setItem("donbolva_visited", "1");
    setShowEntryModal(false);
  };

  if (!showEntryModal) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-earth/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-cream p-8 shadow-2xl ring-1 ring-black/5">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-terracota">
          Bienvenido/a
        </div>
        <h2 className="font-serif text-3xl font-medium leading-tight text-earth">
          Don Bolva
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-earth/70">
          Productos frescos directo del campo a tu puerta. Sin suscripciones, sin compromisos. Elige, agenda y paga al recibir.
        </p>
        <button
          onClick={closeEntryModal}
          className="mt-6 w-full rounded-xl bg-olive py-3.5 text-sm font-medium text-cream transition-all hover:bg-olive/90 active:scale-[0.98]"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}
