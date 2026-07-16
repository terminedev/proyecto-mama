// Previsuación de información para navegar:
export interface InfoNavPrev {
    cover: string,
    title: string,
    link: string
};

// Visuación de información:
export interface InfoView {
    images: string[],
    title: string,
    message: string,
    publicationDate: string
};
