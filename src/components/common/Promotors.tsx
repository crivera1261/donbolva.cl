interface Promoter {
  id: number;
  name: string;
  testimonial: string;
}

const promoters: Promoter[] = [
   {
    id: 1,
    name: 'Erica González',
    testimonial: 'Poder agendar mi entrega con anticipación ha sido un cambio enorme. Como trabajo turnos rotativos, antes perdía muchas compras porque no podía estar en casa. Ahora elijo el horario que me acomoda y llega todo puntual.'
  },
  {
    id: 2,
    name: 'Pedro Díaz',
    testimonial: 'Coordinan todo por WhatsApp y en 24 horas tengo mi pedido en la puerta. La calidad de las verduras es increíble, mucho mejor que lo que encontraba en el supermercado. Ya no pierdo tiempo haciendo filas.'
  },
  {
    id: 3,
    name: 'Jorge López',
    testimonial: 'Agendar canastas semanales me cambió la vida. Los sábados ya no tengo que levantarme temprano para ir a la feria. Ese tiempo lo uso para estar con mis hijos y comer sano sin estrés.'
  }
];

export const Promotors = () : any => {
  return (
    <section id="promotores" className="mb-32 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold">Caseritos/as felices</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {promoters.map((promoter) => (
          <div key={promoter.id} className="bg-white rounded-lg border border-earth/10 shadow-sm p-8">
            <p className="text-lg text-earth/70  leading-relaxed mb-6 italic">
              "{promoter.testimonial}"
            </p>
            <p className="font-serif font-bold text-sm text-earth">
              {promoter.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}