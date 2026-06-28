export const Us = () : any => {
   return( <section id="nosotros" className="mb-32  border-earth/10">
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
                Entrega en tu puerta o para retiro en tienda. Pagas en efectivo o por transferencia cuando recibes la canasta.
              </p>
            </div>
          </div>
        </section>
   )
}