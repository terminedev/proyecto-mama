// ---------------------------------------------

// Definir la interface de Props:
interface ConditionalViewProps {
    status: string,
    childrens: {
        loading: React.ReactNode;
        error: React.ReactNode;
        empty: React.ReactNode;
        data: React.ReactNode;
    }
}

// Evaluar una condición (el estado) y renderizar el hijo correspondiente:
export default function ConditionalView({
    status, childrens
}: ConditionalViewProps) {

    const {
        loading,
        error,
        empty,
        data
    } = childrens;

    switch (status) {
        case 'loading':
            return { loading };
        case 'error':
            return { error };
        case 'empty':
            return { empty };
        case 'data':
            return { data };
        default:
            return null;
    };
};