import { useState } from "react";
import type { InfoAuthor } from "../../typed/interfaces";

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

    return (
        <section>
            <h2>Acerca de mí</h2>
            <img src={currentProfile.profilePicture} alt="Foto de perfil" />
            <p>{currentProfile.aboutMe}</p>

            {/* Contactos */}
            <div className="contacts-container">
                <h3>Contacto</h3>
                <ul>
                    {currentContacts.map((contact, index) => (
                        <li key={index}>
                            <a href={contact.link} target="_blank" rel="noopener noreferrer">
                                {contact.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
