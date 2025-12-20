import { Layout } from "@/components";
import FreeExamPage from "@/components/shared/FreeExamPage";

const SolicitorSetBIntroPage = () => {
  return (
    <Layout>
      <FreeExamPage
        examType="solicitor"
        examTitle="Solicitor Exam Set B"
        startPath="/solicitor-exam/set-b/start"
        isPaid={true}
        examId="solicitor-set-b"
      />
    </Layout>
  );
};

export default SolicitorSetBIntroPage;
