import PreviewList from "./components/PreviewList/PreviewList";
import infonavprev from './typed/infonavprev.example.json';

export default function App() {

  return <main>

    <h1>Proyecto mamá</h1>

    <PreviewList listData={infonavprev} />
  </main>
};