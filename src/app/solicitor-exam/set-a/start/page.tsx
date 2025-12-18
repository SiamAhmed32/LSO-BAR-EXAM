import ProtectedPage from "@/components/shared/ProtectedPage";
import SolicitorSetAStartPageClient from "./SolicitorSetAStartPageClient";

const SolicitorSetAStartPage = () => {
  return (
    <ProtectedPage>
      <SolicitorSetAStartPageClient />
    </ProtectedPage>
  );
};

export default SolicitorSetAStartPage;
