import React from 'react';

// Tipado:
import type { GetBlogsData } from '../../../../hooks/useBlogs';

// Interfaces:
interface ListBlogsProps {
    blogsData: GetBlogsData;
    onLoadMore: () => void;
    onRetry?: () => void;
}

// ---------------------------------------------


export const ListBlogs: React.FC<ListBlogsProps> = ({ blogsData, onLoadMore, onRetry }) => {
    const { data, message, status } = blogsData;
    const { blogs } = data;
    const { isLoading, isLoadingMore, isError, hasMore } = status;

    // 1. Estado de Carga Inicial
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando blogs...</span>
            </div>
        );
    }

    // 2. Estado de Error
    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                <p className="font-semibold">Ocurrió un error</p>
                <p className="text-sm mt-1">{message || 'No se pudieron cargar los blogs.'}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        );
    }

    // 3. Estado Sin Elementos (Vacío)
    if (!blogs || blogs.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                <p>No hay blogs disponibles en este momento.</p>
            </div>
        );
    }

    // 4. Listado de Elementos + Botón para Cargar Más
    return (
        <div className="space-y-6">
            {/* Grid o Lista de Blogs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                    <div
                        key={blog.id || index}
                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{blog.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3">{blog.content}</p>
                    </div>
                ))}
            </div>

            {/* Sección de Cargar Más / Paginación */}
            <div className="flex flex-col items-center justify-center pt-6">
                {hasMore ? (
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center shadow-sm"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cargando más...
                            </>
                        ) : (
                            'Cargar más blogs'
                        )}
                    </button>
                ) : (
                    <p className="text-sm text-gray-400 italic">No hay más blogs por mostrar</p>
                )}
            </div>
        </div>
    );
};