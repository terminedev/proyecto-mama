import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getCountFromServer,
    getDocs,
    limit,
    query,
    startAfter,
    updateDoc
} from "firebase/firestore";
import {
    db,
    formatResponse
} from "../main";

// Tipados: 
import type { Catalog, CatalogPatch, FormatResponse } from "../interfaces";
import {
    COLLECTION_LIMIT_CATALOGS
} from "../constants.ts";


// ----------------------------------
// FIREBASE
// ----------------------------------


const COLLECTION_NAME = "catalogs";


// -----------------
// CRUD
// -----------------


// -----------------
// GET
// -----------------


// OBTENER la cantidad total de «catálogos» en la colección:
export const getCatalogsCount = async (): Promise<FormatResponse> => {
    try {
        const collRef = collection(db, COLLECTION_NAME);
        const snapshot = await getCountFromServer(collRef);
        const count = snapshot.data().count as number;

        return formatResponse(true, count, "Cantidad de «catálogos» obtenida exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al obtener la cantidad de «catálogos».`);
    }
};

// OBTENER «catálogos» (con paginación):
export const getCatalogs = async (
    limitCount: number | null = null,
    lastDoc: any = null
): Promise<FormatResponse> => {

    try {
        const catalogsCollectionRef = collection(db, COLLECTION_NAME);
        const queryConstraints = [];

        if (limitCount) queryConstraints.push(limit(limitCount));

        if (lastDoc) queryConstraints.push(startAfter(lastDoc));

        const q = queryConstraints.length > 0
            ? query(catalogsCollectionRef, ...queryConstraints)
            : catalogsCollectionRef;

        const querySnapshot = await getDocs(q);
        const catalogs: Catalog[] = [];

        querySnapshot.forEach((doc: any) => {
            catalogs.push({
                id: doc.id,
                ...doc.data()
            } as Catalog);
        });

        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] as unknown || null;

        return formatResponse(
            true,
            {
                catalogs,
                lastDoc: newLastDoc
            },
            "«Catálogos» obtenidos exitosamente."
        );

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error en la búsqueda de «catálogos».`);
    }
};


// -----------------
// SET
// -----------------


// AGREGAR un nuevo «catálogo» (con limitación):
export const addCatalog = async (
    newCatalog: Catalog,
    limitCount: number,
): Promise<FormatResponse> => {

    // Si faltan datos del «catálogo», no agregar nada:
    if (!newCatalog) return {
        data: null,
        message: 'Ingrese datos de un «catálogo».',
        response: false
    };

    // Si está al límite, no agregar nada:
    if (limitCount >= COLLECTION_LIMIT_CATALOGS) return {
        data: null,
        message: 'Se superó la cantidad maxima de almacenamiento en «catálogos»',
        response: false
    };

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), newCatalog);

        return formatResponse(true, {
            ...newCatalog,
            id: docRef.id,
        }, "«Catálogo» agregado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al almacenar el nuevo «catálogo».`);
    }
};


// -----------------
// PATCH
// -----------------


// ACTUALIZAR y EDITAR un «catálogo» existente por su ID:
export const updateCatalog = async (
    catalogID: string,
    updatedData: CatalogPatch
): Promise<FormatResponse> => {

    // Si falta ID del «catálogo», no editar nada:
    if (!catalogID || catalogID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del «catálogo».',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, catalogID);

        await updateDoc(docRef, updatedData as any);

        return formatResponse(true, {
            id: catalogID,
            ...updatedData
        },
            "«Catálogo» actualizado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al actualizar el «catálogo».`);
    }
};


// -----------------
// DELETE
// -----------------


// ELIMINAR un «catálogo» existente por su ID:
export const deleteCatalog = async (
    catalogID: string,
): Promise<FormatResponse> => {

    // Si falta ID del «catálogo», no eliminar nada:
    if (!catalogID || catalogID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del «catálogo».',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, catalogID);
        await deleteDoc(docRef);

        return formatResponse(true, null, "«Catálogo» eliminado exitosamente.");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al eliminar el «catálogo».`);
    }
};


