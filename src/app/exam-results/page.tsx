import ProtectedPage from "@/components/shared/ProtectedPage";
import ExamResultsPageClient from "./ExamResultsPageClient";

interface ExamResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ExamResultsPage = async ({ searchParams }: ExamResultsPageProps) => {
  const params = await searchParams;
  const examSet = (params.examSet as string | undefined)?.toLowerCase();
  
  // Free exams (examSet === "free") don't require authentication
  // Paid exams (examSet === "set-a" or "set-b") require authentication
  // If examSet is not provided, default to requiring authentication for safety
  const isFreeExam = examSet === "free";
  
  if (isFreeExam) {
    // No authentication required for free exams
    return <ExamResultsPageClient />;
  }
  
  // Paid exams (or unknown exam types) require authentication
  return (
    <ProtectedPage>
      <ExamResultsPageClient />
    </ProtectedPage>
  );
};

export default ExamResultsPage;

