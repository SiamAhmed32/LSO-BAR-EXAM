import React from "react";

import { Layout } from "../Layout";
import { RegisterForm } from "./register-form";

const RegisterPage = () => {
  return (
    <Layout>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
