// Librerias
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Tipado:
import type { GetBlogsData } from "../hooks/useBlogs";
import type { GetCatalogsData } from "../hooks/useCatalog";


// Componentes de UI Globales
import Layout from "../components/Layout/Layout";
import ScrollToTop from "./ScrollToTop";


// Vistas de Carga Inmediata (Eager Loading)
import MainLoad from "../components/ui/asynchrony/MainLoad/MainLoad";
import Home from "../page/Home/Home";



// Vistas de Carga Diferida (Lazy Loading)
// const CompleteCatalog = lazy(() => import("pages/CompleteCatalog"));

// ---------------------------------------------

// Definir la interface de Props
interface SpaRoutesProps {
    blogs: GetBlogsData;
    catalog: GetCatalogsData;
    loadMoreBlogs: () => void;
    refetchBlogs: () => Promise<void>;
}

export default function SpaRoutes({
    blogs,
    loadMoreBlogs,
    refetchBlogs,
    catalog
}: SpaRoutesProps) {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Suspense fallback={<MainLoad />}>
                <Routes>
                    <Route element={<Layout />}>

                        {/* Ruta Principal */}
                        <Route path="/" element={
                            <Home
                                blogs={blogs}
                                loadMoreBlogs={loadMoreBlogs}
                                refetchBlogs={refetchBlogs}
                                catalog={catalog}
                            />
                        } />
                        {/* Captura de 404 (Not Found) */}
                        <Route path="*" element={<Navigate to={'/'} replace />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}