import { useState } from 'react';
import type { Carousel } from '../../typed/interfaces';
import { MAX_QUANTITY_CAROUSEL } from '../../typed/constants';

// Definir la interface de Props
interface CarouselProps {
    carousel: Carousel;
}

export default function Carousel({
    carousel
}: CarouselProps) {

    if (!carousel) return null;

    const [carouselLocal, setCarouselLocal] = useState(carousel);

    return <section>



    </section>
};


// -----------------
// COMPONENTES COMPLEMENTARIOS
// -----------------

// Botones del Carrusel:
interface CarouselButtonsProps {
    indexPage: number;
}
export function CarouselButtons({ indexPage }: CarouselButtonsProps) {


    const [currentIndex, setCurrentIndex] = useState(indexPage);

    // Actualizar indice de páginación:
    // Dirección: 0 (izquierda) - 1 (derecha)
    const updatePaginationIndex = (address: number) => {

        if (address === 0) {
            setCurrentIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : prevIndex);
        }

        if (address === 1) {
            setCurrentIndex(prevIndex => prevIndex < MAX_QUANTITY_CAROUSEL ? prevIndex + 1 : prevIndex);
        }
    };

    return <>
        <button onClick={() => updatePaginationIndex(0)}>◀</button>
        <button>{currentIndex}</button>
        <button onClick={() => updatePaginationIndex(1)}>▶</button>
    </>
};