import CheckoutPage from "@/components/CheckoutSection/CheckoutPage";
import { getSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

type Props = {};

const page = async (props: Props) => {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <CheckoutPage />
    </>
  );
};

export default page;

