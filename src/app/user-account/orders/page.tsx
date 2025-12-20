"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components";
import Container from "@/components/shared/Container";
import AccountSidebar from "@/components/UserAccSection/AccountSidebar";
import { ShoppingBag, Calendar, DollarSign, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import OrderDetailsModal from "@/components/shared/OrderDetailsModal";

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
}

const UserOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders?page=${currentPage}&limit=10`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Layout>
      <section className="pt-24 pb-12 lg:pt-28 lg:pb-16 bg-primaryBg min-h-screen">
        <Container>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <AccountSidebar />

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm">
                <div className="p-6 border-b border-borderBg">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-primaryColor" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-primaryText">
                      My Orders
                    </h1>
                  </div>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader size="lg" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-primaryText/70 mb-2">
                        No orders found
                      </p>
                      <p className="text-sm text-primaryText/50">
                        Your orders will appear here once you make a purchase.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-borderBg rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-primaryText/70">
                                  Order ID:
                                </span>
                                <span className="text-sm font-mono text-primaryText">
                                  {order.id.substring(0, 8)}...
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-primaryText/70">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primaryColor" />
                                <span className="text-xl font-bold text-primaryText">
                                  ${order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="border-t border-borderBg pt-4">
                            <h3 className="text-sm font-semibold text-primaryText mb-3">
                              Order Items:
                            </h3>
                            <div className="space-y-2">
                              {order.orderItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-primaryText">
                                      {item.examTitle ||
                                        `${item.exam.examType} ${
                                          item.exam.examSet || ""
                                        }`}
                                    </p>
                                    <p className="text-xs text-primaryText/70">
                                      {item.exam.examType} - {item.exam.examSet || "N/A"}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold text-primaryText">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Info */}
                          {order.payment && (
                            <div className="border-t border-borderBg pt-4 mt-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-primaryText/70">
                                  Payment Status:
                                </span>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
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
                          )}
                        </div>
                      ))}

                      {/* Pagination */}
                      {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={!pagination.hasPrevPage}
                            className="px-4 py-2 border border-borderBg rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 text-sm text-primaryText">
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(pagination.totalPages, p + 1)
                              )
                            }
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 border border-borderBg rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        showUserInfo={false}
      />
    </Layout>
  );
};

export default UserOrdersPage;

