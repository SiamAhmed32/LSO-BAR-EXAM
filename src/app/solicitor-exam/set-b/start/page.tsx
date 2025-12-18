import ProtectedPage from "@/components/shared/ProtectedPage";
import SolicitorSetBStartPageClient from "./SolicitorSetBStartPageClient";

const SolicitorSetBStartPage = () => {
  return (
    <ProtectedPage>
      <SolicitorSetBStartPageClient />
    </ProtectedPage>
  );
};

export default SolicitorSetBStartPage;
