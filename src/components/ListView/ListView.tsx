import type { InfoView } from "../../typed/interfaces";

// Definir la interface de Props
interface ListViewProps {
    listData: InfoView[];
}

export default function ListView({
    listData
}: ListViewProps) {

    // Omitir listado sin datos:
    if (!listData || listData.length <= 0) return null;

    return (
        <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto',
            maxWidth: '500px',
            fontFamily: 'sans-serif'
        }}>
            {listData.map((item, index) => (
                <li key={index} style={{
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'flex-start'
                }}>
                    {/* Imagen principal */}
                    {item.images && item.images.length > 0 && (
                        <img
                            src={item.images[0]}
                            alt={item.title}
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '6px'
                            }}
                        />
                    )}

                    {/* Contenido */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>
                            {item.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                            {item.message}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>
                            {item.publicationDate}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
};