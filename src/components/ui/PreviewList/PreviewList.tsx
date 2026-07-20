import type { InfoNavPrev } from "../../../typed/interfaces";

// Definir la interface de Props
interface PreviewListProps {
    listData: InfoNavPrev[];
}

export default function PreviewList({
    listData
}: PreviewListProps) {

    // Omitir listado sin datos:
    if (!listData || listData.length <= 0) return null;

    return (
        <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto',
            maxWidth: '400px'
        }}>
            {listData.map((element, index) => (
                <div key={index}>
                    <li style={{ marginBottom: '10px' }}>
                        <a
                            href={element?.link}
                            style={{
                                textDecoration: 'none',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}
                        >
                            <img
                                src={element?.cover}
                                alt="Carousel slide"
                                style={{
                                    width: '80px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                            <p style={{ margin: 0, fontWeight: 500 }}>{element?.title}</p>
                        </a>
                    </li>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
                </div>
            ))}
        </ul>
    );
};