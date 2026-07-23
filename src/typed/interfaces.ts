// Previsuación de información para navegar:
export interface InfoNavPrev {
    cover: string,
    message: string,
    link: string
};

// Visuación de información:
export interface InfoView {
    images: string[],
    title: string,
    message: string,
    publicationDate: string
};

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


