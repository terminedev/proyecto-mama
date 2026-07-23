// ----------------------------------
// OBJETOS
// ----------------------------------


// isGuest: para diferenciar usuarios logueados:
export interface User {
    uid: string;
    email: string;
    isGuest: boolean;
};

// Posteo para el Blog:
export interface Blog {
    id: string,
    createdAt: string,

    //editables
    title: string,
    message: string,
    images: string[]
}

// Catálogo:
export interface Catalog {
    id: string,

    //editables
    name: string,
    nameClean: string,
    cover: string,
}

// Producto:
export interface Product {
    id: string,
    createdAt: string,

    //editables
    name: string,
    description: string,
    images: string[],
    categories: string[]
}


// ----------------------------------
// RESPUESTAS
// ----------------------------------


export interface FormatResponse {
    response: boolean | null;
    data: any,
    message: string
}


// ----------------------------------
// ACTUALIZACIÓN
// ----------------------------------


// Blog:
export interface BlogPatch {
    title: Blog['title'],
    message: Blog['message'],
    images: Blog['images']
}

// Catálogo:
export interface CatalogPatch {
    name: Catalog['name'],
    nameClean: Catalog['nameClean'],
    cover: Catalog['cover'],
}

// Producto:
export interface ProductPatch {
    name: Product['name'],
    description: Product['description'],
    images: Product['images'],
    categories: Product['categories']
}