import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getCountFromServer,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    updateDoc,
    where
} from "firebase/firestore";
import {
    db,
    formatResponse
} from "../main";

// Tipados: 
import type {
    FormatResponse,
    Product,
    ProductPatch
} from "../interfaces";
import { COLLECTION_LIMIT_PRODUCTS } from "../constants.ts";


// ----------------------------------
// FIREBASE
// ----------------------------------


const COLLECTION_NAME = "products";


// -----------------
// CRUD
// -----------------


// -----------------
// GET
// -----------------


// OBTENER la cantidad total de «productos» en la colección:
export const getProductsCount = async (): Promise<FormatResponse> => {
    try {
        const collRef = collection(db, COLLECTION_NAME);
        const snapshot = await getCountFromServer(collRef);
        const count = snapshot.data().count as number;

        return formatResponse(true, count, "Cantidad de «productos» obtenida exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al obtener la cantidad de «productos».`);
    }
};

// OBTENER «productos» por categoría (con paginación opcional):
export const getProductsByCategory = async (
    category: string,
    limitCount: number | null = null,
    lastDoc = null
): Promise<FormatResponse> => {

    if (!category || category.length <= 0) return {
        data: null,
        message: 'Ingrese una categoría.',
        response: false
    };

    try {
        const categoryCollectionRef = collection(db, COLLECTION_NAME);
        const queryConstraints = [];

        if (category) queryConstraints.push(where('categories', 'array-contains', category));

        queryConstraints.push(orderBy('createdAt', 'asc'));

        if (limitCount) queryConstraints.push(limit(limitCount));

        if (lastDoc) queryConstraints.push(startAfter(lastDoc));

        // Construir la query final
        const q = queryConstraints.length > 0
            ? query(categoryCollectionRef, ...queryConstraints)
            : categoryCollectionRef;

        const querySnapshot = await getDocs(q);
        const products: Product[] = [];

        querySnapshot.forEach((doc: any) => {
            products.push({
                id: doc.id,
                ...doc.data()
            } as Product);
        });

        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] as unknown || null;

        return formatResponse(
            true,
            {
                products,
                lastDoc: newLastDoc
            },
            "«Productos» filtrados obtenidos exitosamente."
        );

    } catch (error) {

        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error en la búsqueda de «productos».`);
    }
};


// -----------------
// SET
// -----------------


// AGREGAR un nuevo «producto» (con limitación):
export const addNewProduct = async (
    newProduct: Product,
    limitCount: number,
): Promise<FormatResponse> => {

    // Si faltan datos del «producto», no agregar nada:
    if (!newProduct) return {
        data: null,
        message: 'Ingrese datos de un «producto».',
        response: false
    };

    // Si está al límite, no agregar nada:
    if (limitCount >= COLLECTION_LIMIT_PRODUCTS) return {
        data: null,
        message: 'Se superó la cantidad maxima de almacenamiento en «productos»',
        response: false
    };

    try {
        // Preparamos el objeto agregando el timestamp del servidor
        const productDataToSave = {
            ...newProduct,
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), productDataToSave);

        return formatResponse(true, {
            ...newProduct,
            id: docRef.id,
            createdAt: new Date().toISOString(),
        }, "«Producto» agregado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al almacenar el nuevo «producto».`);
    }
};


// -----------------
// PATCH
// -----------------


// ACTUALIZAR y EDITAR un «producto» existente por su ID:
export const updateProduct = async (
    productID: string,
    updatedData: ProductPatch
): Promise<FormatResponse> => {

    // Si falta ID del producto, no editar nada:
    if (!productID || productID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del «producto».',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, productID);

        await updateDoc(docRef, updatedData as any);

        return formatResponse(true, {
            id: productID,
            ...updatedData
        },
            "«Producto» actualizado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al actualizar el «producto».`);
    }
};


// -----------------
// DELETE
// -----------------


// ELIMINAR un «producto» existente por su ID:
export const deleteProduct = async (
    productID: string,
): Promise<FormatResponse> => {

    // Si falta ID del producto, no eliminar nada:
    if (!productID || productID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del «producto».',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, productID);
        await deleteDoc(docRef);

        return formatResponse(true, null, "«Producto» eliminado exitosamente.");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al eliminar el «producto».`);
    }
};