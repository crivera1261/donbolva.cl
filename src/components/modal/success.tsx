import { Check, X, Sun, Sunset, CalendarIcon } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "./../ui/calendar";
import { cn } from "../../lib/utils";

type TimeSlot = "manana" | "tarde";

type CartItem = {
  id: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
  subtotal: number;
};

type SuccessModalProps = {
  openModal: boolean;
  confirmed: boolean;
  name: string;
  phone: string;
  email: string;
  fulfillment: "retiro" | "delivery";
  payment: "efectivo" | "transferencia";
  deliveryDate: Date | undefined;
  timeSlot: TimeSlot | undefined;
  cartItems: CartItem[];
  total: number;
  today: Date;
  canConfirm: boolean;
  isSubmitting: boolean;
  submitError: string;
  setOpenModal: (v: boolean) => void;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setFulfillment: (v: "retiro" | "delivery") => void;
  setPayment: (v: "efectivo" | "transferencia") => void;
  setDeliveryDate: (d: Date | undefined) => void;
  setTimeSlot: (s: TimeSlot | undefined) => void;
  handleConfirm: () => void;
  resetOrder: () => void;
};

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

export function SuccessModal({
  openModal,
  confirmed,
  name,
  phone,
  email,
  fulfillment,
  payment,
  deliveryDate,
  timeSlot,
  cartItems,
  total,
  today,
  canConfirm,
  isSubmitting,
  submitError,
  setOpenModal,
  setName,
  setPhone,
  setEmail,
  setFulfillment,
  setPayment,
  setDeliveryDate,
  setTimeSlot,
  handleConfirm,
  resetOrder,
}: SuccessModalProps) {
  if (!openModal) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-earth/40 p-4 backdrop-blur-sm"
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
            <div className="mt-6 rounded-xl bg-earth/3 p-4 ring-1 ring-black/5">
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
  );
}
