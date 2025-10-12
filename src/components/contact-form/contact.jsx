import { useState } from 'react';
import Products from "./../../data/products.json";
import UserIcon from "./../../assets/icons/user.svg";
import PhoneIcon from "./../../assets/icons/phone.svg";
import MailIcon from "./../../assets/icons/mail.svg";
import LoadingGif from "./../../assets/gif/loading.gif";

export default function FormWithLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        cantidades: {},
        acepto: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('BANDEJA-')) {
            setFormData((prevData) => ({
                ...prevData,
                cantidades: {
                    ...prevData.cantidades,
                    [name]: Number(value)
                }
            }));
        } else if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recargar la página
        setIsLoading(true);

        // Armar mensaje HTML
        let body = `Nombre: ${formData.nombre}\n
Correo: ${formData.correo}\n
Teléfono: ${formData.telefono}\n
Selecciono contacto empresa:${(formData.acepto) ? "SI" : "NO"}`;

        if (!!formData.cantidades) {
            let keys = Object.keys(formData.cantidades);
            body += "\n\n";
            keys.map((key) => {
                body += `${ key } [$ ${ Products.find(p => p.id == key)?.price }]:  ${ formData.cantidades[key] } unidades.\n`;
            });
        }

        let email = formData.correo;
        try {
            const response = await fetch("https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/namespaces/fn-75a349ef-3a44-4bdd-9850-8026d735a1b5/actions/send-email?blocking=true&result=true", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic ODkzMjk0ZGMtZjA2OC00YjM0LThkYjAtMzBhMzkzZmFjNTEzOlBDQ1l3T2VidnhwZkVqVTVzTzFnVnlhdTB6UVNaVGJ5QWNQSHJqY1JGcURldTFQQUxoMGliRVBKcGlhNGJiS0Y="
                },
                body: JSON.stringify({
                    email,
                    body
                })
            });

            if (!response.ok) throw new Error('Error al enviar');

            const data = await response.json();
            if (response.error) {
                alert("Error al enviar: " + response.error);
            }
            alert('Solicitud enviada con éxito');
            window.location.href = "/";
        } catch (error) {
            setResponseMsg('Error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            id="contact"
            className="space-y-4"
            style={{ color: '#432918' }}
            onSubmit={handleSubmit}
        >
            <h1 className="text-4xl font-semibold">¡Haz tu pedido hoy!</h1>
            <label className="w-1/3">Nombre</label>
            <div
                className="flex items-center border border-gray-300 rounded-xl px-3 py-2 shadow-sm bg-white"
            >
                <div
                    className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                    <img
                        src={UserIcon.src}
                        alt="Mail icon"
                        className="h-5 w-5 text-gray-400"
                    />
                </div>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre y apellidos"
                    className="ml-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    maxLength={100}
                    onChange={handleChange}
                    required
                />
            </div>
            <label className="w-1/3">Correo</label>
            <div
                className="flex items-center border border-gray-300 rounded-xl px-3 py-2 shadow-sm bg-white"
            >
                <div
                    className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                    <img
                        src={MailIcon.src}
                        alt="Mail icon"
                        className="h-5 w-5 text-gray-400"
                    />
                </div>
                <input
                    type="email" name="correo"
                    placeholder="Tu correo"
                    className="ml-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    maxLength={100}
                    onChange={handleChange}
                    required
                />
            </div>
            <label className="w-1/3">Teléfono</label>
            <div
                className="flex items-center border border-gray-300 rounded-xl px-3 py-2 shadow-sm bg-white"
            >
                <div
                    className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                    <img
                        src={PhoneIcon.src}
                        alt="Mail icon"
                        className="h-5 w-5 text-gray-400"
                    />
                </div>
                <input
                    type="tel"
                    id="phone"
                    name="telefono"
                    placeholder="+56912345678"
                    pattern="^\+56\d{9}$"
                    className="ml-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    maxLength={12}
                    onChange={handleChange}
                    required
                />
                <p id="phoneError" className="text-red-500 text-sm mt-1 hidden">
                    Número no válido. Use el formato +56912345678
                </p>
            </div>
            <div className="space-y-3" id="products">
                <h2 className="text-xl font-semibold mt-4">Cantidad por bandeja</h2>
                {
                    Products.map((a, index) => (
                        <div className="flex items-center gap-4" key={a.id} title={a.active ? "Stock sujeto a disponibilidad" : "Lo sentimos, sin stock por el momento."}>
                            <label className={`w-3/5 ${a.active ? 'text-black' : 'text-gray-400'}`}>{a.item}</label>
                            <label className={`w-1/5 ${a.active ? 'text-black' : 'text-gray-400'}`}>${a.price}</label>
                            <input
                                type="number"
                                name={`${a.id}`}
                                placeholder="0"
                                min="0"
                                max="20"
                                onChange={handleChange}
                                disabled={!a.active}
                                className={`ml-2 w-1/3 border bg-transparent rounded px-2 py-1 outline-none placeholder-gray-400 
                                    ${a.active ? 'text-black' : 'text-gray-400'}`}
                            />
                        </div>
                    ))
                }
                <p className='text-center text-red-600'>
                    <b>¡IMPORTANTE! Stock sujeto a disponibilidad</b>
                </p>
            </div>
            <input
                type="checkbox"
                id="toggle"
                name="acepto"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                onChange={handleChange}
            /> {" ¿Tienes un emprendimiento o empresa? Te enviaremos precios al por mayor."}

            {!isLoading && (
                <button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full"
                >
                    Enviar pedido
                </button>)}

            {isLoading && (
                <div className="flex items-center w-24">
                    <img src={LoadingGif.src} alt="Enviando solicitud..." />
                    <p>Enviando solicitud...</p>
                </div>
            )}
        </form>
    );
}
