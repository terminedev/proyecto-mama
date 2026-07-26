import { Outlet } from "react-router-dom";
import MainNav from "../../../navigation/MainNav/MainNav";

export default function Layout() {

    return (
        <>
            {/* Cabecera: */}
            <header>
                <MainNav />
            </header>

            {/* Contenido principal: */}
            <main>
                <Outlet />
            </main>

            {/* Pie de página: */}
            <footer>

            </footer>
        </>
    );
}