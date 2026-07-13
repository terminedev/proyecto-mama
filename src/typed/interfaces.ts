// Carrusel
export interface Carousel {
    numPages: number,
    maxPages: number,
    indexPage: number,
    bodyPage: CarouselBody[]
};

export interface CarouselBody {
    numPage: number,
    cover: string,
    message: string,
    link: string
}