import { useState } from 'react';
import type { Carousel } from '../../typed/interfaces';

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


interface CarouselButtonsProps {
    indexPage: number;
}
export function CarouselButtons({ indexPage }: CarouselButtonsProps) {

    // Retroceder página:
    const goBackPage = () => {

    };

    return <>
        <button>◀</button>
        <button>{indexPage}</button>
        <button>▶</button>
    </>
};