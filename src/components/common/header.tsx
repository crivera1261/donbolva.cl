import { ShoppingBasket, MapPin } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.3999 6.54663C22.9066 4.03996 19.5866 2.66663 16.0533 2.66663C8.77328 2.66663 2.83994 8.59996 2.83994 15.88C2.83994 18.2133 3.45328 20.48 4.59994 22.48L2.73328 29.3333L9.73328 27.4933C11.6666 28.5466 13.8399 29.1066 16.0533 29.1066C23.3333 29.1066 29.2666 23.1733 29.2666 15.8933C29.2666 12.36 27.8933 9.03996 25.3999 6.54663ZM16.0533 26.8666C14.0799 26.8666 12.1466 26.3333 10.4533 25.3333L10.0533 25.0933L5.89328 26.1866L6.99994 22.1333L6.73328 21.72C5.63994 19.9733 5.05328 17.9466 5.05328 15.88C5.05328 9.82663 9.98661 4.89329 16.0399 4.89329C18.9733 4.89329 21.7333 6.03996 23.7999 8.11996C25.8799 10.2 27.0133 12.96 27.0133 15.8933C27.0399 21.9466 22.1066 26.8666 16.0533 26.8666ZM22.0799 18.6533C21.7466 18.4933 20.1199 17.6933 19.8266 17.5733C19.5199 17.4666 19.3066 17.4133 19.0799 17.7333C18.8533 18.0666 18.2266 18.8133 18.0399 19.0266C17.8533 19.2533 17.6533 19.28 17.3199 19.1066C16.9866 18.9466 15.9199 18.5866 14.6666 17.4666C13.6799 16.5866 13.0266 15.5066 12.8266 15.1733C12.6399 14.84 12.7999 14.6666 12.9733 14.4933C13.1199 14.3466 13.3066 14.1066 13.4666 13.92C13.6266 13.7333 13.6933 13.5866 13.7999 13.3733C13.9066 13.1466 13.8533 12.96 13.7733 12.8C13.6933 12.64 13.0266 11.0133 12.7599 10.3466C12.4933 9.70663 12.2133 9.78663 12.0133 9.77329C11.8133 9.77329 11.5999 9.77329 11.3733 9.77329C11.1466 9.77329 10.7999 9.85329 10.4933 10.1866C10.1999 10.52 9.34661 11.32 9.34661 12.9466C9.34661 14.5733 10.5333 16.1466 10.6933 16.36C10.8533 16.5866 13.0266 19.92 16.3333 21.3466C17.1199 21.6933 17.7333 21.8933 18.2133 22.04C18.9999 22.2933 19.7199 22.2533 20.2933 22.1733C20.9333 22.08 22.2533 21.3733 22.5199 20.6C22.7999 19.8266 22.7999 19.1733 22.7066 19.0266C22.6133 18.88 22.4133 18.8133 22.0799 18.6533Z" fill="currentColor" />
    </svg>
  );
}

type HeaderProps = {
  itemCount?: number;
  onOpenCart?: () => void;
};

export function Header({ itemCount = 0, onOpenCart }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-earth/10 bg-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/">
          <img src="/logo2.png" alt="Don Bolva" className="h-36 w-auto object-contain" />
        </a>
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="flex items-center">
            <a href="https://www.instagram.com/donbolva_distribuidora?igsh=Z3hqMzc5bXZxNjA1" target="_blank" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
              <InstagramIcon className="size-6" />
            </a>
            <a href="https://wa.me/56974587354?text=Hola!%20me%20puedes%20entregar%20más%20información%20sobre%20la%20venta%20de%20huevos." target="_blank" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
              <WhatsappIcon className="size-6" />
            </a>
            <a href="https://maps.app.goo.gl/D2eX6zAxU5TttWGX7" target="_blank" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
              <MapPin className="size-6" strokeWidth={1.75} />
            </a>
          </div>
          <button
            onClick={() => itemCount > 0 && onOpenCart?.()}
            disabled={itemCount === 0}
            className="flex items-center gap-2 rounded-full bg-olive px-4 py-2 text-sm font-medium text-cream ring-1 ring-olive transition-transform hover:-translate-y-px disabled:opacity-40"
          >
            <ShoppingBasket className="size-4 shrink-0" />
            <span className="hidden sm:inline">Mi Canasta</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-cream/20 text-[10px]">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
