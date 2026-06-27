import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBasket,
  X,
  ArrowRight,
  Check,
  Sprout,
  Apple,
  Egg,
  Leaf,
  Nut,
  CalendarIcon,
  Sun,
  Sunset,
  Trash2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { format, addDays, startOfDay, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";

type Category = "verduras" | "frutas" | "huevos" | "condimentos" | "frutos-secos";

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  category: Category;
  note: string;
};

type TimeSlot = "manana" | "tarde";

const CATEGORIES: { id: Category; label: string; icon: typeof Sprout }[] = [
  { id: "verduras", label: "Verduras", icon: Sprout },
  { id: "frutas", label: "Frutas", icon: Apple },
  { id: "huevos", label: "Huevos", icon: Egg },
  { id: "condimentos", label: "Condimentos", icon: Leaf },
  { id: "frutos-secos", label: "Frutos secos", icon: Nut },
];

const PRODUCTS: Product[] = [
  { id: "tomate", name: "Tomate reliquia", unit: "kg", price: 4200, image: "/products/tomate.jpg", category: "verduras", note: "Cosecha de la semana, sin pesticidas." },
  { id: "kale", name: "Kale rizado", unit: "atado", price: 1500, image: "/products/kale.jpg", category: "verduras", note: "Hoja firme, recién cortado." },
  { id: "palta", name: "Palta Hass", unit: "kg", price: 5800, image: "/products/palta.jpg", category: "verduras", note: "Madura al punto, lista para servir." },
  { id: "frutillas", name: "Frutillas del valle", unit: "canasto 500g", price: 3400, image: "/products/frutillas.jpg", category: "frutas", note: "Recién recolectadas al amanecer." },
  { id: "huevos", name: "Huevos de campo", unit: "docena", price: 3800, image: "/products/huevos.jpg", category: "huevos", note: "Gallinas libres, alimentación natural." },
  { id: "miel", name: "Miel de azahar", unit: "frasco 500g", price: 5900, image: "/products/miel.jpg", category: "condimentos", note: "Cosecha artesanal del apiario." },
  { id: "hierbas", name: "Romero y tomillo", unit: "ramo", price: 1200, image: "/products/hierbas.jpg", category: "condimentos", note: "Atado con cordel, aroma intenso." },
  { id: "nueces", name: "Nueces mariposa", unit: "250g", price: 5400, image: "/products/nueces.jpg", category: "frutos-secos", note: "Pelado a mano, cosecha del año." },
];

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

export default function ShopPage() {
  const [activeCat, setActiveCat] = useState<Category>("verduras");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState<"efectivo" | "transferencia">("efectivo");
  const [fulfillment, setFulfillment] = useState<"retiro" | "delivery">("delivery");
  const [confirmed, setConfirmed] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const visible = useMemo(
    () => PRODUCTS.filter((p) => p.category === activeCat),
    [activeCat],
  );

  const cartItems = useMemo(
    () =>
      PRODUCTS.filter((p) => cart[p.id] > 0).map((p) => ({
        ...p,
        qty: cart[p.id],
        subtotal: p.price * cart[p.id],
      })),
    [cart],
  );

  const total = cartItems.reduce((acc, i) => acc + i.subtotal, 0);
  const itemCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  const countByCat = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of PRODUCTS) map[p.category] = (map[p.category] ?? 0) + (cart[p.id] ?? 0);
    return map;
  }, [cart]);

  const inc = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));
  const removeItem = (id: string) =>
    setCart((c) => {
      const { [id]: _, ...rest } = c;
      return rest;
    });

  const canConfirm =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().includes("@") &&
    cartItems.length > 0 &&
    deliveryDate !== undefined &&
    timeSlot !== undefined;

  const handleConfirm = async () => {
    if (!canConfirm || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");

    const fechaStr = deliveryDate
      ? format(deliveryDate, "EEEE d 'de' MMMM yyyy", { locale: es })
      : "";
    const horarioStr = timeSlot === "manana" ? "Mañana (9:00–13:00)" : "Tarde (15:00–19:00)";

    let body = `NUEVO PEDIDO — Don Bolva\n\n`;
    body += `Nombre: ${name}\n`;
    body += `Teléfono: ${phone}\n`;
    body += `Correo: ${email}\n\n`;
    body += `Fecha de entrega: ${fechaStr}\n`;
    body += `Horario: ${horarioStr}\n`;
    body += `Tipo de entrega: ${fulfillment === "delivery" ? "Delivery (a domicilio)" : "Retiro en tienda"}\n`;
    body += `Método de pago: ${payment === "efectivo" ? "Efectivo" : "Transferencia"}\n\n`;
    body += `--- PRODUCTOS ---\n`;
    cartItems.forEach((i) => {
      body += `${i.name} × ${i.qty} ${i.unit} → ${formatCLP(i.subtotal)}\n`;
    });
    body += `\nTotal: ${formatCLP(total)}\n(Envío bonificado)`;

    try {
      const response = await fetch(
        "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/namespaces/fn-75a349ef-3a44-4bdd-9850-8026d735a1b5/actions/send-email?blocking=true&result=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic ODkzMjk0ZGMtZjA2OC00YjM0LThkYjAtMzBhMzkzZmFjNTEzOlBDQ1l3T2VidnhwZkVqVTVzTzFnVnlhdTB6UVNaVGJ5QWNQSHJqY1JGcURldTFQQUxoMGliRVBKcGlhNGJiS0Y=",
          },
          body: JSON.stringify({ email, body }),
        }
      );
      if (!response.ok) throw new Error(`Error ${response.status}`);
      setConfirmed(true);
    } catch (err) {
      setSubmitError("No se pudo enviar el pedido. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetOrder = () => {
    setConfirmed(false);
    setOpenModal(false);
    setCart({});
    setName("");
    setPhone("");
    setEmail("");
    setPayment("efectivo");
    setFulfillment("delivery");
    setDeliveryDate(undefined);
    setTimeSlot(undefined);
    setSubmitError("");
  };

  const today = startOfDay(new Date());

  return (
    <div className="min-h-screen bg-cream font-sans text-earth selection:bg-olive/10">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-earth/10 bg-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/">
            <img src="/logo2.png" alt="Don Bolva" className="h-15 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden items-center sm:flex">
              <a href="https://www.instagram.com/donbolva_distribuidora?igsh=Z3hqMzc5bXZxNjA1" target="_blank" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
                <InstagramIcon className="size-4" />
              </a>
              <a href="https://wa.me/56974587354?text=Hola!%20me%20puedes%20entregar%20más%20información%20sobre%20la%20venta%20de%20huevos." target="_blank" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
                <Phone className="size-4" strokeWidth={1.75} />
              </a>
              <a href="mailto:hablemos@donbolva.cl" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
                <Mail className="size-4" strokeWidth={1.75} />
              </a>
              <a href="https://maps.app.goo.gl/D2eX6zAxU5TttWGX7" target="_blank" className="flex size-9 items-center justify-center rounded-full text-earth/50 transition-colors hover:bg-earth/5 hover:text-earth">
                <MapPin className="size-4" strokeWidth={1.75} />
              </a>
            </div>
            <button
              onClick={() => itemCount > 0 && setOpenModal(true)}
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

      {/* Hero */}
      <header className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <span className="mb-6 inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-terracota">
            Cosecha semanal · agenda tu entrega
          </span>
          <h1 className="text-balance font-serif text-4xl font-medium leading-tight tracking-tight text-earth md:text-6xl">
            Productos nobles, cosechados para tu mesa esta semana.
          </h1>
          <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-earth/70">
            No somos un supermercado. Somos el puente entre la tierra de origen y
            tu cocina. Elige tus productos, agenda el día y la hora de entrega.
          </p>
        </div>
      </header>

      <main id="huerta" className="mx-auto max-w-7xl px-6 pb-40">
        {/* Category chips — sticky below the Astro header (h-16 mobile / h-20 sm+) */}
        <div className="sticky top-22 z-30 -mx-6 mb-10 border-b border-earth/10 bg-cream px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => {
              const isActive = c.id === activeCat;
              const Icon = c.icon;
              const n = countByCat[c.id] ?? 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={cn(
                    "group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "border-olive bg-olive text-cream shadow-sm"
                      : "border-earth/10 bg-white/60 text-earth/70 hover:border-earth/25 hover:text-earth",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  <span>{c.label}</span>
                  {n > 0 && (
                    <span
                      className={cn(
                        "ml-0.5 flex size-5 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums",
                        isActive ? "bg-cream/25 text-cream" : "bg-terracota/15 text-terracota",
                      )}
                    >
                      {n}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Product Grid */}
          <section className="flex-1">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => {
                const qty = cart[p.id] ?? 0;
                return (
                  <article key={p.id} className="group flex flex-col">
                    <div
                      className={cn(
                        "relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-earth/5 outline outline-1 -outline-offset-1 outline-black/5 transition-all",
                        qty > 0 && "ring-2 ring-olive/40 ring-offset-2 ring-offset-cream",
                      )}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {qty > 0 && (
                        <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-olive text-xs font-semibold text-cream shadow-md">
                          {qty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-medium leading-tight">
                          {p.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-earth/50">
                          {formatCLP(p.price)} / {p.unit}
                        </p>
                      </div>
                      {qty === 0 ? (
                        <button
                          onClick={() => inc(p.id)}
                          className="shrink-0 rounded-full border border-earth/10 px-4 py-1.5 text-sm font-medium transition-colors hover:border-olive hover:bg-olive hover:text-cream"
                        >
                          Agregar
                        </button>
                      ) : (
                        <div className="flex shrink-0 items-center gap-1 rounded-full border border-earth/10 bg-white/60 p-1">
                          <button
                            onClick={() => dec(p.id)}
                            aria-label="Quitar uno"
                            className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-earth/5"
                          >
                            <Minus className="size-3" strokeWidth={2.5} />
                          </button>
                          <span className="w-6 text-center text-sm font-medium tabular-nums">
                            {qty}
                          </span>
                          <button
                            onClick={() => inc(p.id)}
                            aria-label="Agregar uno"
                            className="flex size-7 items-center justify-center rounded-full bg-olive text-cream transition-transform hover:scale-105"
                          >
                            <Plus className="size-3" strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-earth/45">{p.note}</p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Live cart preview — desktop only */}
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-[150px]">
              <div className="overflow-hidden rounded-2xl border border-earth/10 bg-white/70 shadow-sm">
                <div className="flex items-center justify-between border-b border-earth/10 bg-earth/[0.03] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBasket className="size-4 text-olive" strokeWidth={1.75} />
                    <span className="font-serif text-base font-medium text-earth">
                      Tu canasta
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-earth/50">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-earth/[0.04]">
                      <Sprout className="size-5 text-earth/40" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-earth/55">Tu canasta está vacía.</p>
                    <p className="mt-1 text-xs text-earth/40">Agrega productos para verlos aquí.</p>
                  </div>
                ) : (
                  <>
                    <ul className="max-h-[380px] divide-y divide-earth/5 overflow-y-auto">
                      {cartItems.map((i) => (
                        <li key={i.id} className="flex items-center gap-3 px-5 py-3">
                          <img
                            src={i.image}
                            alt=""
                            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-black/5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-earth">{i.name}</p>
                            <p className="text-xs text-earth/50">
                              {i.qty} × {formatCLP(i.price)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-medium tabular-nums">{formatCLP(i.subtotal)}</span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => dec(i.id)} className="flex size-5 items-center justify-center rounded-full hover:bg-earth/5" aria-label="Quitar uno">
                                <Minus className="size-2.5" strokeWidth={2.5} />
                              </button>
                              <button onClick={() => inc(i.id)} className="flex size-5 items-center justify-center rounded-full hover:bg-earth/5" aria-label="Agregar uno">
                                <Plus className="size-2.5" strokeWidth={2.5} />
                              </button>
                              <button onClick={() => removeItem(i.id)} className="ml-1 flex size-5 items-center justify-center rounded-full text-earth/40 hover:bg-terracota/10 hover:text-terracota" aria-label="Eliminar">
                                <Trash2 className="size-2.5" strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-earth/10 bg-earth/[0.02] px-5 py-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-earth/50">
                          Total estimado
                        </span>
                        <span className="font-serif text-xl tabular-nums">{formatCLP(total)}</span>
                      </div>
                      <button
                        onClick={() => setOpenModal(true)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-terracota px-4 py-2.5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
                      >
                        <span>Agendar pedido</span>
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Cómo funciona */}
        <section id="nosotros" className="mt-32 border-t border-earth/10 pt-16">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracota">01 · Eliges</p>
              <h3 className="mt-3 font-serif text-2xl">Eliges tu canasta</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/60">
                Seleccionas los productos que necesitas. Sin suscripciones ni compromisos.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracota">02 · Agendas</p>
              <h3 className="mt-3 font-serif text-2xl">Eliges día y horario</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/60">
                Tú decides cuándo recibir: mañana o tarde, el día que mejor te acomode.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracota">03 · Recibes</p>
              <h3 className="mt-3 font-serif text-2xl">Pagas al recibir</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/60">
                Entrega en tu puerta. Pagas en efectivo o por transferencia cuando recibes la canasta.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating basket — mobile only */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden">
          <div className="flex items-center gap-5 rounded-2xl bg-earth px-5 py-3.5 text-cream shadow-2xl ring-1 ring-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-cream/50">
                Total · {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="font-serif text-xl tabular-nums">{formatCLP(total)}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 rounded-lg bg-terracota px-4 py-2 text-sm font-medium text-white ring-1 ring-terracota transition-transform active:scale-95"
            >
              <span>Agendar</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de pedido */}
      {openModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-earth/40 p-4 backdrop-blur-sm"
          onClick={() => !confirmed && setOpenModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream p-8 shadow-2xl ring-1 ring-black/5"
          >
            {confirmed ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-olive/10 text-olive">
                  <Check className="size-7" strokeWidth={2.5} />
                </div>
                <h2 className="mt-6 font-serif text-3xl font-medium text-earth">Pedido agendado</h2>
                <p className="mx-auto mt-3 max-w-[36ch] text-sm leading-relaxed text-earth/70">
                  Gracias <strong>{name}</strong>.{" "}
                  <strong>
                    {fulfillment === "delivery" ? "Te entregaremos" : "Lo dejaremos listo para retiro"}
                  </strong>{" "}
                  el{" "}
                  <strong>
                    {deliveryDate && format(deliveryDate, "EEEE d 'de' MMMM", { locale: es })}
                  </strong>{" "}
                  en horario{" "}
                  <strong>{timeSlot === "manana" ? "de mañana (9–13h)" : "de tarde (15–19h)"}</strong>.
                  Te contactaremos al <strong>{phone}</strong> para confirmar.
                  Pagas <strong>{payment === "efectivo" ? "en efectivo" : "por transferencia"}</strong> al recibir.
                </p>
                <button
                  onClick={resetOrder}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-olive py-4 text-sm font-medium text-cream transition-all hover:bg-olive/95"
                >
                  Volver a la tienda
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-start justify-between">
                  <span className="font-serif text-2xl font-medium italic text-olive">
                    Tu pedido
                  </span>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="flex size-8 items-center justify-center rounded-full text-earth/40 transition-colors hover:bg-earth/5 hover:text-earth"
                    aria-label="Cerrar"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="h-px bg-earth/10" />

                <p className="mt-6 text-pretty text-sm leading-relaxed text-earth/80">
                  Revisa tu pedido, elige cuándo lo recibes y nos contactamos contigo para confirmar.
                </p>

                {/* Resumen del pedido */}
                <div className="mt-6 rounded-xl bg-earth/[0.03] p-4 ring-1 ring-black/5">
                  {cartItems.map((i, idx) => (
                    <div
                      key={i.id}
                      className={"flex justify-between py-2 text-sm " + (idx > 0 ? "border-t border-earth/5" : "")}
                    >
                      <span className="text-earth/70">
                        {i.name}
                        <span className="text-earth/40"> × {i.qty} {i.unit}</span>
                      </span>
                      <span className="tabular-nums">{formatCLP(i.subtotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-earth/5 py-2 text-sm">
                    <span className="text-earth/60">Costo de envío</span>
                    <span className="text-olive">Bonificado</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-earth/10 pt-4 font-serif text-lg">
                    <span>Total a pagar</span>
                    <span className="tabular-nums">{formatCLP(total)}</span>
                  </div>
                </div>

                {/* Día de entrega */}
                <div className="mt-6">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">
                    Día de entrega
                  </label>
                  <div className="mt-2 flex flex-col items-center rounded-xl bg-white p-2 ring-1 ring-black/5">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      disabled={(date) => isBefore(date, today) || isBefore(addDays(today, 30), date)}
                      locale={es}
                      initialFocus
                    />
                  </div>
                  {deliveryDate && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-earth/70">
                      <CalendarIcon className="size-3.5 text-olive" strokeWidth={1.75} />
                      <span>
                        Entrega el{" "}
                        <strong className="text-earth">
                          {format(deliveryDate, "EEEE d 'de' MMMM", { locale: es })}
                        </strong>
                      </span>
                    </p>
                  )}
                </div>

                {/* Horario */}
                <div className="mt-5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">
                    Horario de entrega
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {([
                      { id: "manana" as const, label: "Mañana", range: "9:00 – 13:00", Icon: Sun },
                      { id: "tarde" as const, label: "Tarde", range: "15:00 – 19:00", Icon: Sunset },
                    ]).map(({ id, label, range, Icon }) => {
                      const active = timeSlot === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTimeSlot(id)}
                          className={cn(
                            "flex flex-col items-start gap-1 rounded-lg bg-white p-3 text-left transition-all",
                            active
                              ? "ring-2 ring-olive ring-offset-2 ring-offset-cream"
                              : "ring-1 ring-black/5 hover:ring-earth/20",
                          )}
                        >
                          <Icon className={cn("size-4", active ? "text-olive" : "text-earth/50")} strokeWidth={1.75} />
                          <span className="text-sm font-medium text-earth">{label}</span>
                          <span className="text-[11px] text-earth/50">{range}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Datos del cliente */}
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">Nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="¿Cómo te llamas?"
                      className="mt-1.5 w-full rounded-lg border-none bg-earth/5 px-4 py-3 text-sm outline-none ring-1 ring-black/5 transition-shadow focus:ring-2 focus:ring-olive/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">Teléfono de contacto</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9 ..."
                      className="mt-1.5 w-full rounded-lg border-none bg-earth/5 px-4 py-3 text-sm outline-none ring-1 ring-black/5 transition-shadow focus:ring-2 focus:ring-olive/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">Correo electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="mt-1.5 w-full rounded-lg border-none bg-earth/5 px-4 py-3 text-sm outline-none ring-1 ring-black/5 transition-shadow focus:ring-2 focus:ring-olive/40"
                    />
                  </div>

                  {/* Tipo de entrega */}
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">¿Cómo recibes tu pedido?</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {([
                        { id: "delivery" as const, label: "Delivery", hint: "Llevamos a tu puerta" },
                        { id: "retiro" as const, label: "Retiro en tienda", hint: "Pasas a buscarlo" },
                      ]).map((opt) => {
                        const active = fulfillment === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFulfillment(opt.id)}
                            className={cn(
                              "flex flex-col items-start rounded-lg bg-white p-3 text-left transition-all",
                              active
                                ? "ring-2 ring-olive ring-offset-2 ring-offset-cream"
                                : "ring-1 ring-black/5 hover:ring-earth/20",
                            )}
                          >
                            <span className="text-xs font-medium text-earth">{opt.label}</span>
                            <span className="mt-0.5 text-[10px] text-earth/50">{opt.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-earth/50">Método de pago al recibir</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {(["efectivo", "transferencia"] as const).map((m) => {
                        const active = payment === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setPayment(m)}
                            className={cn(
                              "flex items-center justify-center rounded-lg bg-white p-3 text-xs font-medium capitalize transition-all",
                              active
                                ? "ring-2 ring-olive ring-offset-2 ring-offset-cream"
                                : "ring-1 ring-black/5 hover:ring-earth/20",
                            )}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {submitError && (
                  <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                    {submitError}
                  </p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={!canConfirm || isSubmitting}
                  className="mt-6 w-full rounded-xl bg-olive py-4 text-sm font-medium text-cream ring-1 ring-olive transition-all hover:bg-olive/95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando pedido…" : "Agendar mi pedido"}
                </button>

                <p className="mt-4 text-center text-[11px] uppercase tracking-widest text-earth/40">
                  Sin cargos hoy · pagas al recibir
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
