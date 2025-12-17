"use client";

import React from "react";
import { useUser } from "../context";
import { User, Mail, Calendar } from "lucide-react";

const AccountDetails = () => {
  const { user } = useUser();

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-primaryText mb-6">
        Account Details
      </h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primaryColor/10 rounded-lg">
            <User className="w-5 h-5 text-primaryColor" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Full Name
            </label>
            <p className="text-base text-primaryText font-semibold">
              {user?.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primaryColor/10 rounded-lg">
            <Mail className="w-5 h-5 text-primaryColor" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Email Address
            </label>
            <p className="text-base text-primaryText font-semibold">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primaryColor/10 rounded-lg">
            <Calendar className="w-5 h-5 text-primaryColor" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Account Created
            </label>
            <p className="text-base text-primaryText font-semibold">
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        {/* {user?.role && (
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primaryColor/10 rounded-lg">
              <User className="w-5 h-5 text-primaryColor" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Role
              </label>
              <p className="text-base text-primaryText font-semibold capitalize">
                {user.role}
              </p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AccountDetails;

