// ----------------------------------
// OBJETOS
// ----------------------------------

// isGuest: para diferenciar usuarios logueados:
export interface User {
    uid: string;
    email: string;
    isGuest: boolean;
};

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
