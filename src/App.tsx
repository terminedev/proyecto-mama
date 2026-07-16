import ListView from "./components/ListView/ListView";
import listview from './components/ListView/listview.example.json';

export default function App() {

  return <main>

    <h1>Proyecto mamá</h1>

    <ListView listData={listview} />
  </main>
};