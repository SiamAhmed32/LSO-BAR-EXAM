import ProtectedPage from "@/components/shared/ProtectedPage";
import BarristerSetAStartPageClient from "./BarristerSetAStartPageClient";

const BarristerSetAStartPage = () => {
  return (
    <ProtectedPage>
      <BarristerSetAStartPageClient />
    </ProtectedPage>
  );
};

export default BarristerSetAStartPage;
