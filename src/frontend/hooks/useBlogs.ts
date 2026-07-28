import { useState, useEffect, useCallback } from 'react';
import {
    getBlogs,
    getBlogsCount,
    addNewBlog,
    updateBlog,
    deleteBlog
} from './backend/fire-base/controllers/blog.controller.ts';
import { NUM_OF_BLOGS_PAGE } from './backend/fire-base/constants.ts';

// Tipado:
import type { Blog, BlogPatch } from './backend/fire-base/interfaces.ts';

// Interfaces:
export interface GetBlogsData {
    data: {
        blogs: Blog[],
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

export interface BlogActionStatus {
    isLoading: boolean;
    isError: boolean;
    message: string | null;
}

// ---------------------------------------------

export function useBlogs(initialLimitCount: number = NUM_OF_BLOGS_PAGE) {

    // -----------------
    // GET STATES
    // -----------------


    const [getBlogsData, setGetBlogsData] = useState<GetBlogsData>({
        data: {
            blogs: [],
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

    const [blogsCount, setBlogsCount] = useState<number>(0);
    const [countStatus, setCountStatus] = useState<BlogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });


    // -----------------
    // MUTATION STATES (Add, Update, Delete)
    // -----------------


    const [addStatus, setAddStatus] = useState<BlogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [updateStatus, setUpdateStatus] = useState<BlogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [deleteStatus, setDeleteStatus] = useState<BlogActionStatus>({
        isLoading: false,
        isError: false,
        message: null,
    });


    // -----------------
    // FETCH BLOGS (GET)
    // -----------------


    const fetchBlogs = useCallback(async (limit: number | null, docRef: any, isInitial: boolean) => {
        setGetBlogsData(prev => ({
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
            const response = await getBlogs(limit, docRef);

            if (response.success) {
                const newBlogs = response.data.blogs;
                const newLastDoc = response.data.lastDoc;
                const newMessage = response.message;

                setGetBlogsData(prev => ({
                    ...prev,
                    data: {
                        blogs: isInitial ? newBlogs : [...prev.data.blogs, ...newBlogs],
                        lastDoc: newLastDoc
                    },
                    message: newMessage,
                    status: {
                        ...prev.status,
                        hasMore: !(newBlogs.length === 0 || (limit && newBlogs.length < limit))
                    }
                }));
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

            setGetBlogsData(prev => ({
                ...prev,
                message: errorMessage,
                status: {
                    ...prev.status,
                    isError: true
                }
            }));

        } finally {
            setGetBlogsData(prev => ({
                ...prev,
                status: {
                    ...prev.status,
                    isLoading: false,
                    isLoadingMore: false
                }
            }));

        }
    }, []);

    const loadMoreBlogs = () => {
        if (
            !getBlogsData.status.isLoadingMore
            && getBlogsData.status.hasMore
            && getBlogsData.data.lastDoc
        ) {
            fetchBlogs(initialLimitCount, getBlogsData.data.lastDoc, false);
        }
    };


    // -----------------
    // GET BLOGS COUNT
    // -----------------


    const fetchBlogsCount = useCallback(async () => {
        setCountStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await getBlogsCount();
            if (response.success) {
                setBlogsCount(response.data);
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
    // ADD BLOG (SET)
    // -----------------


    const handleAddBlog = async (newBlog: Blog, currentLimitCount: number) => {
        setAddStatus({ isLoading: true, isError: false, message: null });

        try {
            const response = await addNewBlog(newBlog, currentLimitCount);
            if (response.success) {
                setAddStatus({ isLoading: false, isError: false, message: response.message });
                fetchBlogs(initialLimitCount, null, true);
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
    // UPDATE BLOG (PATCH)
    // -----------------


    const handleUpdateBlog = async (blogID: string, updatedData: BlogPatch) => {
        setUpdateStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await updateBlog(blogID, updatedData);
            if (response.success) {
                setUpdateStatus({ isLoading: false, isError: false, message: response.message });

                // Actualizar localmente el estado de los blogs para reflejar el cambio de inmediato
                setGetBlogsData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        blogs: prev.data.blogs.map(blog =>
                            blog.id === blogID ? { ...blog, ...updatedData } : blog
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
    // DELETE BLOG
    // -----------------


    const handleDeleteBlog = async (blogID: string) => {
        setDeleteStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await deleteBlog(blogID);
            if (response.success) {
                setDeleteStatus({ isLoading: false, isError: false, message: response.message });

                // Remover localmente el blog eliminado del estado
                setGetBlogsData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        blogs: prev.data.blogs.filter(blog => blog.id !== blogID)
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
        fetchBlogs(NUM_OF_BLOGS_PAGE, null, true);
    }, [fetchBlogs, NUM_OF_BLOGS_PAGE]);


    return {
        // Datos y funciones de lectura / paginación
        getBlogsData,
        loadMoreBlogs,
        refetchBlogs: () => fetchBlogs(NUM_OF_BLOGS_PAGE, null, true),

        // Conteo
        blogsCount,
        countStatus,
        fetchBlogsCount,

        // Agregar
        addStatus,
        handleAddBlog,

        // Actualizar
        updateStatus,
        handleUpdateBlog,

        // Eliminar
        deleteStatus,
        handleDeleteBlog,
    };
}