interface Promoter {
  id: number;
  name: string;
  testimonial: string;
}

const promoters: Promoter[] = [
  {
    id: 1,
    name: 'Erica González',
    testimonial: 'Me encanta poder agendar mi horario de mi entrega.'
  },
  {
    id: 2,
    name: 'Pedro Díaz',
    testimonial: 'Paso después del trabajo y ya está listo.'
  },
  {
    id: 3,
    name: 'Jorge López',
    testimonial: 'Desde que agendo mi compra, ahorro muchísimo tiempo.'
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