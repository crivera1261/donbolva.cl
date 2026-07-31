export const Us = () : any => {
   return( <section id="nosotros" className="mb-32  border-earth/10">
          <div className="grid gap-10">
            <span className="mb-6 inline-block text-xl font-semibold uppercase tracking-[0.25em]">
              ¿Cómo agendo mi pedido?
            </span>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracota">01 · Elija</p>
              <h3 className="mt-3 font-serif text-2xl">¿Qué necesita para esta semana?</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/60">
                Seleccione los productos que necesite. Sin suscripciones ni compromisos.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracota">02 · Agende</p>
              <h3 className="mt-3 font-serif text-2xl">Nos adaptamos a tu tiempo</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/60">
                Usted decide cuándo recibir: mañana o tarde, el día que mejor te acomode.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-terracota">03 · Reciba</p>
              <h3 className="mt-3 font-serif text-2xl">Pague al recibir</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/60">
                Entrega en su puerta. Pague en efectivo o por transferencia cuando recibes la canasta.
              </p>
            </div>
          </div>
        </section>
   )
}