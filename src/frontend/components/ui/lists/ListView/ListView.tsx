// Tipado:
import type { InfoView } from "../../../typed/interfaces";

// Modulos de estilo:
import stylesStructure from "./ListView.module.css";


// ---------------------------------------------


// Definir la interface de Props
interface ListViewProps {
    listData: InfoView[];
}

// Lista de elementos: 
export default function ListView({
    listData
}: ListViewProps) {

    // Omitir listado sin datos:
    if (!listData || listData.length <= 0) return null;

    return (
        <ul className={stylesStructure.list}>
            {listData.map((item, index) => (
                <li key={index} className={stylesStructure.listItem}>
                    {/* Imagen principal */}
                    {item.images && item.images.length > 0 && (
                        <img
                            src={item.images[0]}
                            alt={item.title}
                            className={stylesStructure.image}
                        />
                    )}

                    {/* Contenido */}
                    <div className={stylesStructure.content}>
                        <h3 className={stylesStructure.title}>
                            {item.title}
                        </h3>
                        <p className={stylesStructure.message}>
                            {item.message}
                        </p>
                        <span className={stylesStructure.date}>
                            {item.publicationDate}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
};