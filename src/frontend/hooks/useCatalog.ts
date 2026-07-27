import { useState, useEffect, useCallback } from 'react';
import {
    getCatalogs,
    getCatalogsCount,
    addCatalog,
    updateCatalog,
    deleteCatalog
} from './backend/fire-base/controllers/catalog.controller.ts';
import { NUM_OF_CATALOGS_PAGE } from './backend/fire-base/constants.ts'; // O ajusta la constante según corresponda

// Tipado:
import type { Catalog, CatalogPatch } from './backend/fire-base/interfaces.ts';

// Interfaces:
export interface GetCatalogsData {
    data: {
        catalogs: Catalog[],
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

export interface CatalogActionStatus {
    isLoading: boolean;
    isError: boolean;
    message: string | null;
}

// ---------------------------------------------

export function useCatalogs(initialLimitCount: number = NUM_OF_CATALOGS_PAGE) {

    // -----------------
    // GET STATES
    // -----------------
    const [getCatalogsData, setGetCatalogsData] = useState<GetCatalogsData>({
        data: {
            catalogs: [],
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

    const [catalogsCount, setCatalogsCount] = useState<number>(0);
    const [countStatus, setCountStatus] = useState<CatalogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    // -----------------
    // MUTATION STATES (Add, Update, Delete)
    // -----------------
    const [addStatus, setAddStatus] = useState<CatalogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [updateStatus, setUpdateStatus] = useState<CatalogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [deleteStatus, setDeleteStatus] = useState<CatalogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });


    // -----------------
    // FETCH CATALOGS (GET)
    // -----------------
    const fetchCatalogs = useCallback(async (limit: number | null, docRef: any, isInitial: boolean) => {
        setGetCatalogsData(prev => ({
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
            const response = await getCatalogs(limit, docRef);

            if (response.success) {
                const newCatalogs = response.data.catalogs;
                const newLastDoc = response.data.lastDoc;
                const newMessage = response.message;

                setGetCatalogsData(prev => ({
                    ...prev,
                    data: {
                        catalogs: isInitial ? newCatalogs : [...prev.data.catalogs, ...newCatalogs],
                        lastDoc: newLastDoc
                    },
                    message: newMessage,
                    status: {
                        ...prev.status,
                        hasMore: !(newCatalogs.length === 0 || (limit && newCatalogs.length < limit))
                    }
                }));
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

            setGetCatalogsData(prev => ({
                ...prev,
                message: errorMessage,
                status: {
                    ...prev.status,
                    isError: true
                }
            }));
        } finally {
            setGetCatalogsData(prev => ({
                ...prev,
                status: {
                    ...prev.status,
                    isLoading: false,
                    isLoadingMore: false
                }
            }));
        }
    }, []);

    const loadMoreCatalogs = () => {
        if (
            !getCatalogsData.status.isLoadingMore
            && getCatalogsData.status.hasMore
            && getCatalogsData.data.lastDoc
        ) {
            fetchCatalogs(initialLimitCount, getCatalogsData.data.lastDoc, false);
        }
    };


    // -----------------
    // GET CATALOGS COUNT
    // -----------------
    const fetchCatalogsCount = useCallback(async () => {
        setCountStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await getCatalogsCount();
            if (response.success) {
                setCatalogsCount(response.data);
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
    // ADD CATALOG (SET)
    // -----------------
    const handleAddCatalog = async (newCatalog: Catalog, currentLimitCount: number) => {
        setAddStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await addCatalog(newCatalog, currentLimitCount);
            if (response.success) {
                setAddStatus({ isLoading: false, isError: false, message: response.message });
                fetchCatalogs(initialLimitCount, null, true);
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
    // UPDATE CATALOG (PATCH)
    // -----------------
    const handleUpdateCatalog = async (catalogID: string, updatedData: CatalogPatch) => {
        setUpdateStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await updateCatalog(catalogID, updatedData);
            if (response.success) {
                setUpdateStatus({ isLoading: false, isError: false, message: response.message });

                setGetCatalogsData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        catalogs: prev.data.catalogs.map(catalog =>
                            catalog.id === catalogID ? { ...catalog, ...updatedData } : catalog
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
    // DELETE CATALOG
    // -----------------
    const handleDeleteCatalog = async (catalogID: string) => {
        setDeleteStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await deleteCatalog(catalogID);
            if (response.success) {
                setDeleteStatus({ isLoading: false, isError: false, message: response.message });

                setGetCatalogsData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        catalogs: prev.data.catalogs.filter(catalog => catalog.id !== catalogID)
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
    useEffect(() => {
        fetchCatalogs(initialLimitCount, null, true);
    }, [fetchCatalogs, initialLimitCount]);


    return {
        getCatalogsData,
        loadMoreCatalogs,
        refetchCatalogs: () => fetchCatalogs(initialLimitCount, null, true),

        catalogsCount,
        countStatus,
        fetchCatalogsCount,

        addStatus,
        handleAddCatalog,

        updateStatus,
        handleUpdateCatalog,

        deleteStatus,
        handleDeleteCatalog,
    };
}