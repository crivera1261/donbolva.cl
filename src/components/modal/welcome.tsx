import { useEffect, useState } from "react";
import { X } from "lucide-react";
import welcomeImg from "./../../assets/welcome.jpeg";

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
      <div className="relative w-full max-w-sm rounded-2xl bg-cream shadow-2xl ring-1 ring-black/5 overflow-hidden">
        <button
          onClick={closeEntryModal}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35"
        >
          <X className="size-4" />
        </button>
        <img src={welcomeImg.src} alt="Don Bolva" className="w-full object-cover" />
      </div>
    </div>
  );
}
