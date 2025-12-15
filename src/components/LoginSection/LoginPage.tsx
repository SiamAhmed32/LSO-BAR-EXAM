import React from "react";
import { LoginForm } from "./login-form";
import { Layout } from "../Layout";

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex min-h-svh w-full items-center justify-center px-6 py-24 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
