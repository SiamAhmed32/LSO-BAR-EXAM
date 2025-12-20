import { Layout } from "@/components";
import FreeExamPage from "@/components/shared/FreeExamPage";

const BarristerSetBIntroPage = () => {
  return (
    <Layout>
      <FreeExamPage
        examType="barrister"
        examTitle="Barrister Exam Set B"
        startPath="/barrister-exam/set-b/start"
        isPaid={true}
        examId="barrister-set-b"
      />
    </Layout>
  );
};

export default BarristerSetBIntroPage;
