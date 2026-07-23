import { useState } from 'react';

// Tipado:
import type { InfoNavPrev } from '../../../typed/interfaces';

// Modulos de estilo:
import stylesStructure from "./Carousel.module.css";

// ---------------------------------------------

// Definir la interface de Props:
interface CarouselProps {
    carousel: InfoNavPrev[];
}

// Carrusel de elementos:
export default function Carousel({
    carousel
}: CarouselProps) {

    // Omitir carrusel sin datos:
    if (!carousel || carousel.length <= 0) return null;

    // Gestionar página actual del carrusel:
    const [currentPage, setCurrentPage] = useState(carousel[0] || {});

    // HTML:
    return (
        <section className={`defaultSpacing ${stylesStructure.carouselContainer}`}>
            <img src={currentPage?.cover} alt="" className={stylesStructure.carouselImage} />
            <CarouselButtons
                setCurrentPage={setCurrentPage}
                totalNumberPages={carousel.length}
                carousel={carousel}
            />
            <p className={stylesStructure.carouselMessage}>{currentPage?.message}</p>
            <a href={currentPage?.link} className={`btnDefault ${stylesStructure.carouselLink}`}>Inspeccionar</a>
        </section>
    );
};


// -----------------
// COMPONENTES COMPLEMENTARIOS
// -----------------


// Botones del Carrusel:
interface CarouselButtonsProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<InfoNavPrev>>;
    totalNumberPages: number;
    carousel: InfoNavPrev[];
}

export function CarouselButtons({
    setCurrentPage,
    totalNumberPages,
    carousel
}: CarouselButtonsProps) {

    return (
        <ul className={`center-list  ${stylesStructure.buttonsList}`}>
            {Array.from({ length: totalNumberPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={stylesStructure.buttonItem}>
                    <button
                        onClick={() => setCurrentPage(carousel[page - 1])}
                        className={`btnDefault ${stylesStructure.paginationButton}`}
                    >
                        {page}
                    </button>
                </li>
            ))}
        </ul>
    );
}
