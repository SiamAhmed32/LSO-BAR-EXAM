"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@/components/shared";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import AdminCustomButton from "@/components/Admin/AdminCustomButton";
import {
  Package,
  Calendar,
  DollarSign,
  User,
  MapPin,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";

interface OrderItem {
  id: string;
  examId: string;
  examTitle: string | null;
  price: number;
  exam: {
    id: string;
    examType: string;
    examSet: string | null;
    title: string | null;
  };
}

interface Payment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  stripePaymentId: string | null;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  billingName: string;
  billingEmail: string;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingPostcode: string | null;
  billingCountry: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payment: Payment | null;
  user?: UserInfo;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  showUserInfo?: boolean; // For admin view
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  showUserInfo = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const getExamName = (exam: { examType: string; examSet: string | null }) => {
    // Always generate name from examType and examSet (ignore title field)
    // This ensures consistent naming based on backend data
    const type = exam.examType === "BARRISTER" ? "Barrister" : "Solicitor";
    const set = exam.examSet === "SET_A" ? "Set A" : exam.examSet === "SET_B" ? "Set B" : "";
    return `${type} ${set}`.trim();
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "PENDING":
      case "PROCESSING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!shouldRender || !order) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      >
        {/* Dialog */}
        <Box
          className={cn(
            "bg-primaryCard rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300",
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-primaryText">
              <Package className="w-6 h-6 text-primaryColor" />
              Order Details
            </h2>
            <AdminCustomButton
              onClick={onClose}
              variant="icon"
              className="text-gray-400 hover:text-primaryText"
            >
              <X className="w-5 h-5" />
            </AdminCustomButton>
          </Box>

          {/* Content */}
          <Box className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6 mt-4">
          {/* Order Header */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Order ID:
                  </span>
                  <span className="text-sm font-mono text-gray-900">
                    {order.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primaryColor" />
                  <span className="text-lg font-bold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info (Admin only) */}
          {showUserInfo && order.user && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium text-blue-800">Name:</span>
                  <p className="text-sm text-blue-900">{order.user.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-800">Email:</span>
                  <p className="text-sm text-blue-900">{order.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Billing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <p className="text-sm text-gray-900">{order.billingName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <p className="text-sm text-gray-900">{order.billingEmail}</p>
              </div>
              {order.billingAddress && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Address:
                  </span>
                  <p className="text-sm text-gray-900">{order.billingAddress}</p>
                </div>
              )}
              {order.billingCity && (
                <div>
                  <span className="text-sm font-medium text-gray-600">City:</span>
                  <p className="text-sm text-gray-900">{order.billingCity}</p>
                </div>
              )}
              {order.billingState && (
                <div>
                  <span className="text-sm font-medium text-gray-600">State:</span>
                  <p className="text-sm text-gray-900">{order.billingState}</p>
                </div>
              )}
              {order.billingPostcode && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Postcode:
                  </span>
                  <p className="text-sm text-gray-900">{order.billingPostcode}</p>
                </div>
              )}
              {order.billingCountry && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Country:
                  </span>
                  <p className="text-sm text-gray-900">{order.billingCountry}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Order Items ({order.orderItems.length})
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {getExamName(item.exam)}
                      </h4>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
              <div className="text-right">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <div className="text-2xl font-bold text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {order.payment && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Payment Status:
                  </span>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        order.payment.status === "SUCCEEDED"
                          ? "bg-green-100 text-green-800"
                          : order.payment.status === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Amount:</span>
                  <p className="text-sm text-gray-900">
                    ${order.payment.amount.toFixed(2)} {order.payment.currency.toUpperCase()}
                  </p>
                </div>
                {order.payment.stripePaymentId && (
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Stripe Payment ID:
                    </span>
                    <p className="text-sm font-mono text-gray-900">
                      {order.payment.stripePaymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
            </div>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default OrderDetailsModal;

