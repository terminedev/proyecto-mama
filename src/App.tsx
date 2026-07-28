import MainLoad from "./frontend/components/ui/asynchrony/MainLoad/MainLoad";
import { useBlogs } from "./frontend/hooks/useBlogs";
import { useCatalog } from "./frontend/hooks/useCatalog";
import { useAuth } from "./frontend/hooks/useLogin";
import SpaRoutes from "./frontend/routes/SpaRoutes";

// Contenido principal de la aplicación:
export default function App() {

  const { getBlogsData, loadMoreBlogs, refetchBlogs } = useBlogs();
  const { getCatalogsData } = useCatalog();
  const { authState } = useAuth();

  if (
    getBlogsData.status.isLoading
    || getCatalogsData.status.isLoading
    || authState.isLoading
  ) return <MainLoad />


  // Enrutador principal:
  return <SpaRoutes
    blogs={getBlogsData}
    loadMoreBlogs={loadMoreBlogs}
    refetchBlogs={refetchBlogs}
    catalog={getCatalogsData}
  />
}