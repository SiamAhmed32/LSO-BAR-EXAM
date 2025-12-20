import { Layout } from "@/components";
import FreeExamPage from "@/components/shared/FreeExamPage";

const SolicitorSetAIntroPage = () => {
  return (
    <Layout>
      <FreeExamPage
        examType="solicitor"
        examTitle="Solicitor Exam Set A"
        startPath="/solicitor-exam/set-a/start"
        isPaid={true}
        examId="solicitor-set-a"
      />
    </Layout>
  );
};

export default SolicitorSetAIntroPage;




