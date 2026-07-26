// Librerias
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// Componentes de UI Globales
import Layout from "../components/Layout/Layout";
import ScrollToTop from "./ScrollToTop";


// Vistas de Carga Inmediata (Eager Loading)
import MainLoad from "../components/ui/asynchrony/MainLoad/MainLoad";


// Vistas de Carga Diferida (Lazy Loading)
// const CompleteCatalog = lazy(() => import("pages/CompleteCatalog"));


export default function SpaRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Suspense fallback={<MainLoad />}>
                <Routes>
                    <Route element={<Layout />}>

                        {/* Ruta Principal */}
                        <Route path="/" element={<p>Home</p>} />

                        {/* Captura de 404 (Not Found) */}
                        <Route path="*" element={<Navigate to={'/'} replace />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}