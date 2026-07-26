// Modulos de estilo:
import stylesStructure from './MainNav.module.css';

// ---------------------------------------------

// Navegación principal del proyecto:
export default function MainNav() {
    return (
        <nav className={`center-all ${stylesStructure.mainNav}`}>
            <a href="/#principal" className={stylesStructure.mainNavBrand}>
                <h1 className={stylesStructure.mainNavTitle} id='principal'>Mar y Sol Crochet</h1>
                <p className={stylesStructure.mainNavSubtitle}>Subtítulo Secundario Opcional</p>
            </a>
            <div className={`scroll-row ${stylesStructure.mainNavLinks}`}>
                <a href="/#principal" className={stylesStructure.mainNavLink}>Principal</a>
                <a href="/#blog" className={stylesStructure.mainNavLink}>Mi blog</a>
                <a href="/#catalogo" className={stylesStructure.mainNavLink}>Catálogo</a>
                <a href="/#acerca-de-mi" className={stylesStructure.mainNavLink}>Acerca de mí</a>
            </div>
        </nav>
    );
}