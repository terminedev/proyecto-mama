import { useState, useEffect, useCallback } from 'react';
import {
    getProductsByCategory,
    getProductsCount,
    addNewProduct,
    updateProduct,
    deleteProduct
} from './backend/fire-base/controllers/product.controller.ts';
import { NUM_OF_PRODUCTS_PAGE } from './backend/fire-base/constants.ts';

// Tipado:
import type { Product, ProductPatch } from './backend/fire-base/interfaces.ts';

// Interfaces:
export interface GetProductsData {
    data: {
        products: Product[],
        lastDoc: any,
    },
    message: string | null,
    status: {
        isLoading: boolean,
        isLoadingMore: boolean,
        isError: boolean,
        hasMore: boolean,
    }
};

export interface ProductActionStatus {
    isLoading: boolean;
    isError: boolean;
    message: string | null;
}

// ---------------------------------------------

export function useProducts(category: string, initialLimitCount: number = NUM_OF_PRODUCTS_PAGE) {


    // -----------------
    // GET STATES
    // -----------------


    const [getProductsData, setGetProductsData] = useState<GetProductsData>({
        data: {
            products: [],
            lastDoc: null
        },
        message: null,
        status: {
            isLoading: true,
            isLoadingMore: false,
            isError: false,
            hasMore: true,
        }
    });

    const [productsCount, setProductsCount] = useState<number>(0);
    const [countStatus, setCountStatus] = useState<ProductActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    // -----------------
    // MUTATION STATES (Add, Update, Delete)
    // -----------------
    const [addStatus, setAddStatus] = useState<ProductActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [updateStatus, setUpdateStatus] = useState<ProductActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [deleteStatus, setDeleteStatus] = useState<ProductActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });


    // -----------------
    // FETCH PRODUCTS (POR CATEGORY)
    // -----------------
    const fetchProducts = useCallback(async (currentCategory: string, limit: number | null, docRef: any, isInitial: boolean) => {
        if (!currentCategory) return;

        setGetProductsData(prev => ({
            ...prev,
            status: {
                ...prev.status,
                isLoading: isInitial,
                isLoadingMore: !isInitial,
                isError: false
            },
            message: null
        }));

        try {
            const response = await getProductsByCategory(currentCategory, limit, docRef);

            if (response.success) {
                const newProducts = response.data.products;
                const newLastDoc = response.data.lastDoc;
                const newMessage = response.message;

                setGetProductsData(prev => ({
                    ...prev,
                    data: {
                        products: isInitial ? newProducts : [...prev.data.products, ...newProducts],
                        lastDoc: newLastDoc
                    },
                    message: newMessage,
                    status: {
                        ...prev.status,
                        hasMore: !(newProducts.length === 0 || (limit && newProducts.length < limit))
                    }
                }));
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

            setGetProductsData(prev => ({
                ...prev,
                message: errorMessage,
                status: {
                    ...prev.status,
                    isError: true
                }
            }));
        } finally {
            setGetProductsData(prev => ({
                ...prev,
                status: {
                    ...prev.status,
                    isLoading: false,
                    isLoadingMore: false
                }
            }));
        }
    }, []);

    const loadMoreProducts = () => {
        if (
            !getProductsData.status.isLoadingMore
            && getProductsData.status.hasMore
            && getProductsData.data.lastDoc
            && category
        ) {
            fetchProducts(category, initialLimitCount, getProductsData.data.lastDoc, false);
        }
    };


    // -----------------
    // GET PRODUCTS COUNT
    // -----------------


    const fetchProductsCount = useCallback(async () => {
        setCountStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await getProductsCount();
            if (response.success) {
                setProductsCount(response.data);
                setCountStatus({ isLoading: false, isError: false, message: response.message });
            } else {
                setCountStatus({ isLoading: false, isError: true, message: response.message });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setCountStatus({ isLoading: false, isError: true, message: errorMessage });
        }
    }, []);


    // -----------------
    // ADD PRODUCT (SET)
    // -----------------


    const handleAddProduct = async (newProduct: Product, currentLimitCount: number) => {
        setAddStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await addNewProduct(newProduct, currentLimitCount);
            if (response.success) {
                setAddStatus({ isLoading: false, isError: false, message: response.message });
                if (category) {
                    fetchProducts(category, initialLimitCount, null, true);
                }
                return response.data;
            } else {
                setAddStatus({ isLoading: false, isError: true, message: response.message });
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setAddStatus({ isLoading: false, isError: true, message: errorMessage });
            return null;
        }
    };


    // -----------------
    // UPDATE PRODUCT (PATCH)
    // -----------------


    const handleUpdateProduct = async (productID: string, updatedData: ProductPatch) => {
        setUpdateStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await updateProduct(productID, updatedData);
            if (response.success) {
                setUpdateStatus({ isLoading: false, isError: false, message: response.message });

                setGetProductsData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        products: prev.data.products.map(product =>
                            product.id === productID ? { ...product, ...updatedData } : product
                        )
                    }
                }));
                return true;
            } else {
                setUpdateStatus({ isLoading: false, isError: true, message: response.message });
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setUpdateStatus({ isLoading: false, isError: true, message: errorMessage });
            return false;
        }
    };


    // -----------------
    // DELETE PRODUCT
    // -----------------


    const handleDeleteProduct = async (productID: string) => {
        setDeleteStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await deleteProduct(productID);
            if (response.success) {
                setDeleteStatus({ isLoading: false, isError: false, message: response.message });

                setGetProductsData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        products: prev.data.products.filter(product => product.id !== productID)
                    }
                }));
                return true;
            } else {
                setDeleteStatus({ isLoading: false, isError: true, message: response.message });
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setDeleteStatus({ isLoading: false, isError: true, message: errorMessage });
            return false;
        }
    };


    // -----------------
    // PRIMER RENDER:
    // -----------------

    return {
        getProductsData,
        loadMoreProducts,
        refetchProducts: () => {
            if (category) fetchProducts(category, initialLimitCount, null, true);
        },

        productsCount,
        countStatus,
        fetchProductsCount,

        addStatus,
        handleAddProduct,

        updateStatus,
        handleUpdateProduct,

        deleteStatus,
        handleDeleteProduct,
    };
}