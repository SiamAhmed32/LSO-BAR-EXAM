import { Layout } from "@/components";
import FreeExamPage from "@/components/shared/FreeExamPage";

const BarristerSetAIntroPage = () => {
  return (
    <Layout>
      <FreeExamPage
        examType="barrister"
        examTitle="Barrister Exam Set A"
        startPath="/barrister-exam/set-a/start"
        isPaid={true}
        examId="barrister-set-a"
      />
    </Layout>
  );
};

export default BarristerSetAIntroPage;
