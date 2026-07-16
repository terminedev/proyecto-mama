import Carousel from "./components/Carousel/Carousel";
import carouselExample from './components/Carousel/carousel.example.json'

export default function App() {

  return <main>

    <h1>Proyecto mamá</h1>
    <Carousel carousel={carouselExample} />

  </main>
};