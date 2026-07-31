export const Benefits = (): any => {
  const handleAgendarClick = () => {
    const productSection = document.getElementById("productos");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beneficios" className="items-center mb-32 border-earth/10">
      <div>
        <button
          onClick={handleAgendarClick}
          className="flex items-center cursor-pointer gap-2 bg-[#39b549] px-8 py-4 text-lg font-medium text-cream ring-1 transition-transform hover:-translate-y-px disabled:opacity-40"
        >
          <span className="hidden sm:inline">Agendar su pedido</span>
        </button>
        <p className="mt-4 text-sm">
          <span>
            <small>
              No paga online. Paga cuando reciba su pedido.
            </small>
          </span>
        </p>
      </div>
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="mt-3 font-serif text-2xl font-bold">
            Compre cuando quiera
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-earth/60">
            Agende desde su teléfono
          </p>
        </div>
        <div>
          <h3 className="mt-3 font-serif text-2xl font-bold">
            Retire en tienda
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-earth/60">
            Sin filas
          </p>
        </div>
        <div>
          <h3 className="mt-3 font-serif text-2xl font-bold">
            Reciba en su casa
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-earth/60">
            Nos adaptamos a su tiempo
          </p>
        </div>
      </div>
    </section>
  );
};
