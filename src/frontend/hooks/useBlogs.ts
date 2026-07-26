import { useState, useEffect, useCallback } from 'react';


import { getBlogs } from './path-to-your-service';

export function useBlogs(initialLimitCount: number | null = 10) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Función para cargar los blogs (sirve tanto para el monte inicial como para paginar)
    const fetchBlogs = useCallback(async (limit: number | null, docRef: any, isInitial: boolean) => {
        if (isInitial) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const response = await getBlogs(limit, docRef);

            if (response.success && response.data) {
                const newBlogs = response.data.blogs;
                const newLastDoc = response.data.lastDoc;

                setBlogs(prev => isInitial ? newBlogs : [...prev, ...newBlogs]);
                setLastDoc(newLastDoc);

                // Si trajimos menos elementos del límite (o ninguno), asumimos que ya no hay más
                if (newBlogs.length === 0 || (limit && newBlogs.length < limit)) {
                    setHasMore(false);
                }
            } else {
                setError(response.message || 'Error al obtener los blogs.');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado.');
            console.error(err);
        } finally {
            if (isInitial) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    }, []);

    // 1. Ejecutar automáticamente al montar el componente
    useEffect(() => {
        fetchBlogs(initialLimitCount, null, true);
    }, [initialLimitCount, fetchBlogs]);

    // 2. Función extra para cargar más blogs (Paginación)
    const loadMore = () => {
        if (!loadingMore && hasMore && lastDoc) {
            fetchBlogs(initialLimitCount, lastDoc, false);
        }
    };

    return {
        blogs,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore
    };
}