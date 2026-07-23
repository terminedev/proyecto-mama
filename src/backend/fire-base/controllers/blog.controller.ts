import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, query, serverTimestamp, startAfter, updateDoc } from "firebase/firestore";
import { db, formatResponse } from "../main";

// Tipados: 
import type { FormatResponse } from "../interfaces";
import type { InfoView } from './frontend/typed/interfaces.ts';
import { COLLECTION_LIMIT_BLOGS } from "../constants.ts";


// ----------------------------------
// FIREBASE
// ----------------------------------


const COLLECTION_NAME = "blogs";


// -----------------
// CRUD
// -----------------


// -----------------
// GET
// -----------------


// OBTENER la cantidad total de blogs en la colección:
export const getBlogsCount = async (): Promise<FormatResponse> => {
    try {
        const collRef = collection(db, COLLECTION_NAME);
        const snapshot = await getCountFromServer(collRef);
        const count = snapshot.data().count as number;

        return formatResponse(true, count, "Cantidad de blogs obtenida exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al obtener la cantidad de blogs.`);
    }
};

// OBTENER blogs (con paginación):
export const getBlogs = async (
    limitCount: number | null = null,
    lastDoc: any = null
): Promise<FormatResponse> => {

    try {
        const blogsCollectionRef = collection(db, COLLECTION_NAME);
        const queryConstraints = [];


        queryConstraints.push(orderBy('createdAt', 'asc'));

        if (limitCount) queryConstraints.push(limit(limitCount));

        if (lastDoc) queryConstraints.push(startAfter(lastDoc));

        const q = queryConstraints.length > 0
            ? query(blogsCollectionRef, ...queryConstraints)
            : blogsCollectionRef;

        const querySnapshot = await getDocs(q);
        const blogs: InfoView[] = [];

        querySnapshot.forEach((doc: any) => {
            blogs.push({
                id: doc.id,
                ...doc.data()
            } as InfoView);
        });

        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] as unknown || null;

        return formatResponse(
            true,
            {
                blogs,
                lastDoc: newLastDoc
            },
            "blogs obtenidos exitosamente."
        );

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error en la búsqueda de blogs.`);
    }
};


// -----------------
// SET
// -----------------


// AGREGAR un nuevo blog (con limitación):
export const addNewBlog = async (
    newBlog: Omit<InfoView, 'id' | 'createdAt'> & { createdAt?: any },
    limitCount: number,
): Promise<FormatResponse> => {

    // Si faltan datos del blog, no agregar nada:
    if (!newBlog) return {
        data: null,
        message: 'Ingrese datos de un blog.',
        response: false
    };

    // Si está al límite, no agregar nada:
    if (limitCount >= COLLECTION_LIMIT_BLOGS) return {
        data: null,
        message: 'Se superó la cantidad maxima de almacenamiento en blogs',
        response: false
    };

    try {
        // Preparamos el objeto agregando el timestamp del servidor
        const blogDataToSave = {
            ...newBlog,
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), blogDataToSave);

        return formatResponse(true, {
            ...newBlog,
            id: docRef.id,
            createdAt: new Date().toISOString(),
        }, "Blog agregado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al almacenar el nuevo blog.`);
    }
};


// -----------------
// PATCH
// -----------------


// ACTUALIZAR y EDITAR un blog existente por su ID:
export const updatePlaylist = async (
    blogID: string,
    updatedData: InfoView
): Promise<FormatResponse> => {

    // Si falta ID del blog, no editar nada:
    if (!blogID || blogID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del blog.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, blogID);

        await updateDoc(docRef, updatedData as any);

        return formatResponse(true, {
            id: blogID,
            ...updatedData
        },
            "Blog actualizado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al actualizar el blog.`);
    }
};


// -----------------
// DELETE
// -----------------


// ELIMINAR un blog existente por su ID:
export const deleteBlog = async (
    blogID: string,
): Promise<FormatResponse> => {

    // Si falta ID del blog, no eliminar nada:
    if (!blogID || blogID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del blog.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, blogID);
        await deleteDoc(docRef);

        return formatResponse(true, null, "Blog eliminado exitosamente.");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al eliminar el Blog.`);
    }
};


