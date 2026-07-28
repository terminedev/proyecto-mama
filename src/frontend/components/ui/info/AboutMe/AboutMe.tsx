import { useState } from "react";

// Tipado:

// Modulos de estilo:
import stylesStructure from "./AboutMe.module.css";

// ---------------------------------------------

// Sección "Acerca de mí" del autor. [Información personal y contactos]:
export default function AboutMe() {

    // Información local del componente
    const [infoAuthor] = useState({
        profilePicture: "URL_DE_TU_IMAGEN",
        aboutMe: "Escribe aquí tu descripción personal...",
        contactMe: [
            { name: "GitHub", link: "https://github.com/tu-usuario" },
            { name: "LinkedIn", link: "https://linkedin.com/in/tu-usuario" }
        ]
    });

    // Omitir perfil sin datos:
    if (!infoAuthor) return null;

    // Gestionar contactos actuales:
    const currentContacts = infoAuthor?.contactMe || [];

    // HTML:
    return (
        <section className={`center-all ${stylesStructure.aboutSection}`}>
            <h2 className={stylesStructure.title}>Acerca de mí</h2>
            <img
                src={infoAuthor.profilePicture}
                alt="Foto de perfil"
                className={stylesStructure.profileImage}
            />
            <p className={stylesStructure.description}>{infoAuthor.aboutMe}</p>

            {/* Contactos */}
            <div className={stylesStructure.contactsContainer}>
                <h3 className={stylesStructure.contactsTitle}>Contacto</h3>
                <ul className={`center-list ${stylesStructure.contactsList}`}>
                    {currentContacts.map((contact, index) => (
                        <li key={index} className={`center-all ${stylesStructure.contactItem}`}>
                            <a
                                href={contact.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={stylesStructure.contactLink}
                            >
                                {contact.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}