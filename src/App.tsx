import AboutMe from "./components/ui/AboutMe/AboutMe";
import example from './components/ui/AboutMe/aboutme.example.json';

export default function App() {

  return <main>

    <AboutMe infoAuthor={example} />
  </main>
}