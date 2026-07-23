// Previsuación de información para navegar:
export interface InfoNavPrev {
    id: string,
    cover: string,
    message: string,
    link: string
};

// Visuación de información:
export interface InfoView {
    id: string,
    images: string[],
    title: string,
    message: string,
    createdAt: string,
    clearName: string,
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


