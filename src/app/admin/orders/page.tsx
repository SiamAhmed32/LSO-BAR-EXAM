"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@/components/shared";
import {
  AdminTable,
  Column,
  AdminCustomButton,
  TableSkeleton,
  ConfirmModal,
} from "@/components/Admin";
import { ShoppingBag, Search, Filter, Download, XCircle } from "lucide-react";
import { toast } from "react-toastify";
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
  remainingAttempts?: number | null;
  usedAttempts?: number;
  totalAttempts?: number | null;
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
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  payment: Payment | null;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
      setStats(data.data.stats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelOrder = (order: Order, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setOrderToCancel(order);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    try {
      setIsCancelling(true);
      const response = await fetch(`/api/admin/orders/${orderToCancel.id}/cancel`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel order");
      }

      toast.success("Order cancelled successfully. All exam attempts for this order are now disabled.");
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error instanceof Error ? error.message : "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancelModal = () => {
    if (!isCancelling) {
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExamName = (exam: { examType: string; examSet: string | null }) => {
    // Always generate name from examType and examSet (ignore title field)
    // This ensures consistent naming based on backend data
    const type = exam.examType === "BARRISTER" ? "Barrister" : "Solicitor";
    const set = exam.examSet === "SET_A" ? "Set A" : exam.examSet === "SET_B" ? "Set B" : "";
    return `${type} ${set}`.trim();
  };

  const columns: Column<Order>[] = [
   
    {
      key: "user",
      header: "Customer",
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-primaryText">
            {item.billingName}
          </p>
          <p className="text-xs text-primaryText/70">{item.billingEmail}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (item) => (
        <div>
          <p className="text-sm text-primaryText">
            {item.orderItems.length} exam(s)
          </p>
       
          {/* Show remaining attempts for each item */}
          {item.orderItems.some((oi) => oi.totalAttempts !== null && oi.totalAttempts !== undefined) && (
            <div className="mt-1 space-y-1">
              {item.orderItems.map((oi) => {
                if (oi.totalAttempts === null || oi.totalAttempts === undefined) return null;
                return (
                  <p key={oi.id} className="text-xs text-blue-600">
                    {getExamName(oi.exam)}: {oi.remainingAttempts ?? 0} / {oi.totalAttempts} attempts
                  </p>
                );
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="text-sm font-semibold text-primaryText">
          ${item.totalAmount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            item.payment?.status === "SUCCEEDED"
              ? "bg-green-100 text-green-800"
              : item.payment?.status === "FAILED"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.payment?.status || "N/A"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="text-sm text-primaryText/70">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <Box className="flex items-center gap-2">
          {item.status !== "CANCELLED" && (
            <AdminCustomButton
              onClick={(e) => handleCancelOrder(item, e)}
              variant="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Cancel Order"
            >
              <XCircle className="w-4 h-4" />
            </AdminCustomButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-6">
      <Box className="mb-8">
        <h1 className="text-3xl font-bold text-primaryText mb-2 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" />
          Orders Management
        </h1>
        <p className="text-gray-600 mb-4">
          View and manage all customer orders
        </p>

        {/* Stats */}
        {stats && (
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Box className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalOrders}
              </p>
            </Box>
            <Box className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-green-900">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </Box>
            <Box className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800 font-medium">
                Average Order Value
              </p>
              <p className="text-2xl font-bold text-purple-900">
                $
                {stats.totalOrders > 0
                  ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                  : "0.00"}
              </p>
            </Box>
          </Box>
        )}

        {/* Filters */}
        <Box className="flex flex-col sm:flex-row gap-4 mb-4">
          <Box className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-borderBg rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </Box>
          <Box className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-borderBg rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Box>
        </Box>
      </Box>

      {isLoading ? (
        <TableSkeleton columns={columns.length} rows={5} />
      ) : (
        <AdminTable
          data={orders}
          columns={columns}
          emptyMessage="No orders found"
          pagination={pagination}
          onPageChange={handlePageChange}
          fixedHeight={true}
          tableHeight="600px"
          onRowClick={(order) => {
            setSelectedOrder(order as Order);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        showUserInfo={true}
      />

      {/* Cancel Order Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        title="Cancel Order"
        message={`Are you sure you want to cancel this order? This action will disable all exam attempts associated with this order.${
          orderToCancel
            ? `\n\nOrder ID: ${orderToCancel.id.substring(0, 8)}...\nAmount: $${orderToCancel.totalAmount.toFixed(2)}`
            : ""
        }`}
        confirmText="Cancel Order"
        cancelText="Keep Order"
        isLoading={isCancelling}
      />
    </Box>
  );
};

export default AdminOrdersPage;

