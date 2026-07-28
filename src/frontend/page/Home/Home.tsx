// Tipado:
import AboutMe from "../../components/ui/info/AboutMe/AboutMe";
import { ListBlogs } from "../../components/ui/lists/ListBlogs/ListBlogs";
import type { GetBlogsData } from "../../hooks/useBlogs";
import type { GetCatalogsData } from "../../hooks/useCatalog";

// ---------------------------------------------

// Definir la interface de Props
interface HomeProps {
    blogs: GetBlogsData;
    catalog: GetCatalogsData;
    loadMoreBlogs: () => void;
    refetchBlogs: () => Promise<void>;
}

// Página principal:
export default function Home({
    blogs,
    loadMoreBlogs,
    refetchBlogs,
    catalog
}: HomeProps) {

    return <>
        <ListBlogs
            blogsData={blogs}
            onLoadMore={loadMoreBlogs}
            onRetry={refetchBlogs}
        />

        <AboutMe />


    </>
};