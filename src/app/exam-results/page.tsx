import ProtectedPage from "@/components/shared/ProtectedPage";
import ExamResultsPageClient from "./ExamResultsPageClient";

const ExamResultsPage = () => {
  return (
    <ProtectedPage>
      <ExamResultsPageClient />
    </ProtectedPage>
  );
};

export default ExamResultsPage;

