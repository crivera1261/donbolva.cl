export const Benefits = (): any => {
  const handleAgendarClick = () => {
    const productSection = document.getElementById("productos");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beneficios" className="items-center mb-15 border-earth/10">
      <div className="mb-10">
        <button
          onClick={handleAgendarClick}
          className="flex items-center cursor-pointer gap-2 bg-[#39b549] px-8 py-4 text-lg font-medium text-cream ring-1 transition-transform hover:-translate-y-px disabled:opacity-40"
        >
          <span className="items-center align-center sm:inline">Agendar su pedido</span>
        </button>
        {/* <p className="mt-4 text-sm">
          <span>
            <small>
              No paga online. Paga cuando reciba su pedido.
            </small>
          </span>
        </p> */}
      </div>
    </section>
  );
};
