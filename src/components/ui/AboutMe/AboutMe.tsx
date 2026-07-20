import { useState } from "react";

// Tipado:
import type { InfoAuthor } from "../../../typed/interfaces";

// Modulos de estilo:
import stylesStructure from "./AboutMe.module.css";



// Definir la interface de Props
interface AboutMeProps {
    infoAuthor: InfoAuthor;
}

export default function AboutMe({ infoAuthor }: AboutMeProps) {

    // Omitir perfil sin datos:
    if (!infoAuthor) return null;

    // Gestionar perfil actual:
    const [currentProfile] = useState(infoAuthor);

    // Gestionar contactos actuales:
    const [currentContacts] = useState(currentProfile?.contactMe || []);

    // HTML:
    return (
        <section className={` ${stylesStructure.aboutSection}`}>
            <h2 className={stylesStructure.title}>Acerca de mí</h2>
            <img
                src={currentProfile.profilePicture}
                alt="Foto de perfil"
                className={stylesStructure.profileImage}
            />
            <p className={stylesStructure.description}>{currentProfile.aboutMe}</p>

            {/* Contactos */}
            <div className={stylesStructure.contactsContainer}>
                <h3 className={stylesStructure.contactsTitle}>Contacto</h3>
                <ul className={stylesStructure.contactsList}>
                    {currentContacts.map((contact, index) => (
                        <li key={index} className={stylesStructure.contactItem}>
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