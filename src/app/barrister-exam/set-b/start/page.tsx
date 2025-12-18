import ProtectedPage from "@/components/shared/ProtectedPage";
import BarristerSetBStartPageClient from "./BarristerSetBStartPageClient";

const BarristerSetBStartPage = () => {
  return (
    <ProtectedPage>
      <BarristerSetBStartPageClient />
    </ProtectedPage>
  );
};

export default BarristerSetBStartPage;
