// Información del autor:
export interface InfoAuthor {
    profilePicture: string,
    aboutMe: string,
    contactMe: Contact[],
}

// Contactos del autor:
export interface Contact {
    name: string,
    link: string
}


