import { useState } from 'react';
import type { InfoNavPrev } from '../../typed/interfaces';

// Definir la interface de Props
interface CarouselProps {
    carousel: InfoNavPrev[];
}

export default function Carousel({
    carousel
}: CarouselProps) {

    // Omitir carrusel sin datos:
    if (!carousel || carousel.length <= 0) return null;


    // Gestionar página actual del carrusel:
    const [currentPage, setCurrentPage] = useState(carousel[0] || {});

    // Estilos básicos
    const styles = {
        section: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '2rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center'
        },
        image: {
            width: '100%',
            height: 'auto',
            borderRadius: '4px'
        },
        link: {
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
        }
    };

    // HTML:
    return (
        <section style={styles.section as React.CSSProperties}>
            <img src={currentPage?.cover} alt="Carousel slide" style={styles.image} />
            <p>{currentPage?.title}</p>
            <a href={currentPage?.link} style={styles.link}>Inspeccionar</a>

            <CarouselButtons
                setCurrentPage={setCurrentPage}
                totalNumberPages={carousel.length}
                carousel={carousel}
            />
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

    const listStyle = {
        display: 'flex',
        listStyle: 'none',
        gap: '0.5rem',
        padding: 0,
        marginTop: '1rem'
    };

    const buttonStyle = {
        padding: '5px 10px',
        cursor: 'pointer'
    };

    return (
        <ul style={listStyle as React.CSSProperties}>
            {Array.from({ length: totalNumberPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                    <button
                        style={buttonStyle}
                        onClick={() => setCurrentPage(carousel[page - 1])}
                    >
                        {page}
                    </button>
                </li>
            ))}
        </ul>
    );
}