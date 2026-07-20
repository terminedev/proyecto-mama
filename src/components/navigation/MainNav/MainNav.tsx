// Modulos de estilo:
import stylesStructure from './MainNav.module.css';

export default function MainNav() {
    return (
        <nav className={`center-all ${stylesStructure.mainNav}`}>
            <a href="/" className={stylesStructure.mainNavBrand}>
                <h1 className={stylesStructure.mainNavTitle}>Título Principal</h1>
                <p className={stylesStructure.mainNavSubtitle}>Subtítulo Secundario Opcional</p>
            </a>
            <div className={`scroll-row ${stylesStructure.mainNavLinks}`}>
                <a href="/principal" className={stylesStructure.mainNavLink}>Principal</a>
                <a href="/categorias" className={stylesStructure.mainNavLink}>Categorías</a>
                <a href="/acerca-de" className={stylesStructure.mainNavLink}>Acerca De</a>
                <a href="/contacto" className={stylesStructure.mainNavLink}>Contactos</a>
            </div>
        </nav>
    );
}