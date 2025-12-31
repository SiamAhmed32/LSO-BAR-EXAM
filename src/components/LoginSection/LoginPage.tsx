'use client';

import React from "react";
import { motion } from "framer-motion";
import { LoginForm } from "./login-form";
import { Layout } from "../Layout";

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex min-h-svh w-full items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-primaryBg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md sm:max-w-lg"
        >
          <LoginForm />
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
