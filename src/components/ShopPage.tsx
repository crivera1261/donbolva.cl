import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBasket,
  ArrowRight,
  Sprout,
  Egg,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import { Header } from "./common/header";
import { Hero } from "./common/hero";
import { Us } from "./common/us";
import { Welcome } from "./modal/welcome";
import { SuccessModal } from "./modal/success";
import { format, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../lib/utils";

type Category = "canastas" | "huevos";

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  category: Category;
  items?: string[];
  caliber?: string;
  weight?: string;
};

type TimeSlot = "manana" | "tarde";

const CATEGORIES: { id: Category; label: string; icon: typeof Sprout }[] = [
  { id: "canastas", label: "Canastas", icon: ShoppingBag },
  { id: "huevos", label: "Huevos orgánicos", icon: Egg },
];

const PRODUCTS: Product[] = [
  {
    id: "canasta-clasica",
    name: "Canasta Clásica",
    unit: "un",
    price: 18900,
    image: "/products/canasta.png",
    category: "canastas",
    items: ["1 kg de papas", "1 kg de tomates"],
  },
  {
    id: "canasta-Huerta",
    name: "Canasta Huerta",
    unit: "un",
    price: 22500,
    image: "/products/canasta.png",
    category: "canastas",
    items: ["1 kg de papas", "1 atado de hierbas"],
  },
  {
    id: "huevos-extra",
    name: "Huevos Extra",
    unit: "docena",
    price: 3800,
    image: "/products/huevos.png",
    category: "huevos",
    caliber: "Extra Grande (XL)",
    weight: "73 – 83 g por unidad",
  },
  {
    id: "huevos-super-extra",
    name: "Huevos Super Extra",
    unit: "Bandeja 30 uni",
    price: 9100,
    image: "/products/huevos.png",
    category: "huevos",
    caliber: "Extra Grande (XL)",
    weight: "73 – 83 g por unidad",
  },
];

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

export default function ShopPage() {
  const [activeCat, setActiveCat] = useState<Category>("canastas");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState<"efectivo" | "transferencia">(
    "efectivo",
  );
  const [fulfillment, setFulfillment] = useState<"retiro" | "delivery">(
    "delivery",
  );
  const [confirmed, setConfirmed] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined);
  const [address, setAddress] = useState("");
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
    for (const p of PRODUCTS)
      map[p.category] = (map[p.category] ?? 0) + (cart[p.id] ?? 0);
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
    timeSlot !== undefined &&
    (fulfillment === "retiro" || address.trim().length > 0);

  const handleConfirm = async () => {
    if (!canConfirm || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");

    const fechaStr = deliveryDate
      ? format(deliveryDate, "EEEE d 'de' MMMM yyyy", { locale: es })
      : "";
    const horarioStr =
      timeSlot === "manana" ? "Mañana (9:00–13:00)" : "Tarde (15:00–19:00)";

    let body = `NUEVO PEDIDO — Don Bolva\n\n`;
    body += `Nombre: ${name}\n`;
    body += `Teléfono: ${phone}\n`;
    body += `Correo: ${email}\n\n`;
    body += `Fecha de entrega: ${fechaStr}\n`;
    body += `Horario: ${horarioStr}\n`;
    body += `Tipo de entrega: ${fulfillment === "delivery" ? "Delivery (a domicilio)" : "Retiro en tienda"}\n`;
    if (fulfillment === "delivery") body += `Dirección: ${address}\n`;
    body += `Método de pago: ${payment === "efectivo" ? "Efectivo" : "Transferencia"}\n\n`;
    body += `--- PRODUCTOS ---\n`;
    cartItems.forEach((i) => {
      body += `${i.name} × ${i.qty} ${i.unit} → ${formatCLP(i.subtotal)}\n`;
    });
    body += `\nTotal: ${formatCLP(total)}\n(Envío gratuito)`;

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
        },
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
    setAddress("");
    setDeliveryDate(undefined);
    setTimeSlot(undefined);
    setSubmitError("");
  };

  const today = startOfDay(new Date());

  return (
    <div className="min-h-screen bg-cream font-sans text-earth selection:bg-olive/10">
      {/* Nav */}
      <Header itemCount={itemCount} onOpenCart={() => setOpenModal(true)} />

      {/* Hero */}
      <Hero />

      <main id="huerta" className="mx-auto max-w-7xl px-6 pb-40">
        {/* Cómo funciona */}
        <Us />

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
                        isActive
                          ? "bg-cream/25 text-cream"
                          : "bg-terracota/15 text-terracota",
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
                  <article
                    key={p.id}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 transition-all",
                      qty > 0 && "ring-2 ring-olive/50",
                    )}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                      <img
                        src={p.image}
                        alt={p.name}
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {qty > 0 && (
                        <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-olive text-xs font-semibold text-cream shadow-md">
                          {qty}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-lg font-medium leading-tight text-earth">
                        {p.name}
                      </h3>

                      {p.category === "canastas" && p.items && (
                        <ul className="mt-3 space-y-1.5">
                          {p.items.map((it) => (
                            <li
                              key={it}
                              className="flex items-start gap-2 text-xs leading-relaxed text-earth/65"
                            >
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-olive/60" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {p.category === "huevos" && (
                        <div className="mt-3 space-y-1.5 text-xs text-earth/65">
                          <p>
                            <span className="text-earth/45">Calibre · </span>
                            <span className="font-medium text-earth/85">
                              {p.caliber}
                            </span>
                          </p>
                          <p>
                            <span className="text-earth/45">Peso · </span>
                            <span className="font-medium text-earth/85">
                              {p.weight}
                            </span>
                          </p>
                          <p>
                            <span className="text-earth/45">Formato · </span>
                            <span className="font-medium text-earth/85">
                              Docena (12 un.)
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-earth/5 pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-earth/45">
                            Precio
                          </p>
                          <p className="font-serif text-xl text-earth tabular-nums">
                            {formatCLP(p.price)}
                          </p>
                          <p className="text-[10px] text-earth/45">
                            por {p.unit}
                          </p>
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => inc(p.id)}
                            className="shrink-0 rounded-full border border-earth/10 px-4 py-2 text-sm font-medium transition-colors hover:border-olive hover:bg-olive hover:text-cream"
                          >
                            Agregar
                          </button>
                        ) : (
                          <div className="flex shrink-0 items-center gap-1 rounded-full border border-earth/10 bg-white p-1">
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
                    </div>
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
                    <ShoppingBasket
                      className="size-4 text-olive"
                      strokeWidth={1.75}
                    />
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
                      <Sprout
                        className="size-5 text-earth/40"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-sm text-earth/55">
                      Tu canasta está vacía.
                    </p>
                    <p className="mt-1 text-xs text-earth/40">
                      Agrega productos para verlos aquí.
                    </p>
                  </div>
                ) : (
                  <>
                    <ul className="max-h-[380px] divide-y divide-earth/5 overflow-y-auto">
                      {cartItems.map((i) => (
                        <li
                          key={i.id}
                          className="flex items-center gap-3 px-5 py-3"
                        >
                          <img
                            src={i.image}
                            alt=""
                            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-black/5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-earth">
                              {i.name}
                            </p>
                            <p className="text-xs text-earth/50">
                              {i.qty} × {formatCLP(i.price)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-medium tabular-nums">
                              {formatCLP(i.subtotal)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => dec(i.id)}
                                className="flex size-5 items-center justify-center rounded-full hover:bg-earth/5"
                                aria-label="Quitar uno"
                              >
                                <Minus className="size-2.5" strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => inc(i.id)}
                                className="flex size-5 items-center justify-center rounded-full hover:bg-earth/5"
                                aria-label="Agregar uno"
                              >
                                <Plus className="size-2.5" strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => removeItem(i.id)}
                                className="ml-1 flex size-5 items-center justify-center rounded-full text-earth/40 hover:bg-terracota/10 hover:text-terracota"
                                aria-label="Eliminar"
                              >
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
                        <span className="font-serif text-xl tabular-nums">
                          {formatCLP(total)}
                        </span>
                      </div>
                      <button
                        onClick={() => setOpenModal(true)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-terracota px-4 py-2.5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
                      >
                        <span>Agende su pedido</span>
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating basket — mobile only */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden">
          <div className="flex items-center gap-5 rounded-2xl bg-earth px-5 py-3.5 text-cream shadow-2xl ring-1 ring-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-cream/50">
                Total · {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="font-serif text-xl tabular-nums">
                {formatCLP(total)}
              </span>
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
      <SuccessModal
        openModal={openModal}
        confirmed={confirmed}
        name={name}
        phone={phone}
        email={email}
        fulfillment={fulfillment}
        payment={payment}
        deliveryDate={deliveryDate}
        timeSlot={timeSlot}
        cartItems={cartItems}
        total={total}
        today={today}
        canConfirm={canConfirm}
        isSubmitting={isSubmitting}
        submitError={submitError}
        setOpenModal={setOpenModal}
        setName={setName}
        setPhone={setPhone}
        setEmail={setEmail}
        address={address}
        setAddress={setAddress}
        setFulfillment={setFulfillment}
        setPayment={setPayment}
        setDeliveryDate={setDeliveryDate}
        setTimeSlot={setTimeSlot}
        handleConfirm={handleConfirm}
        resetOrder={resetOrder}
      />

      {/* Modal de bienvenida — primera visita */}
      <Welcome />
    </div>
  );
}
