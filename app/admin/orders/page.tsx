"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft,
  RefreshCw, Search, ChevronDown, Eye,
} from "lucide-react";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  discountPercent: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateOrder(orderId: string, status: string, trackingNumber?: string) {
    setUpdating(true);
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, trackingNumber }),
      });
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: status as any, trackingNumber } : null);
      }
    } catch {}
    setUpdating(false);
  }

  const filtered = orders.filter((o) => {
    const matchesSearch = search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-brand-muted hover:text-gray-900 text-sm flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-cyan" /> Orders
          </h1>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-xl border border-brand-border bg-white text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-brand-muted">Total Orders</p>
        </div>
        <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
          <p className="text-xs text-blue-600">Confirmed</p>
        </div>
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 text-center">
          <p className="text-2xl font-bold text-purple-700">{stats.shipped}</p>
          <p className="text-xs text-purple-600">Shipped</p>
        </div>
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
          <p className="text-xs text-green-600">Delivered</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 text-center">
          <p className="text-2xl font-bold text-brand-cyan">AED {stats.revenue.toFixed(0)}</p>
          <p className="text-xs text-brand-muted">Revenue</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-white border border-brand-border rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        </div>
      </div>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-1">No orders found</p>
          <p className="text-brand-muted text-sm">Orders will appear here when customers check out.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            return (
              <div
                key={order.id}
                className="bg-white border border-brand-border rounded-xl p-4 hover:border-brand-cyan/30 transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted">
                        {order.customerName} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">AED {order.total.toFixed(2)}</p>
                    <Eye className="w-4 h-4 text-brand-muted" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-brand-muted hover:text-gray-900 text-xl">&times;</button>
              </div>

              {/* Status */}
              <div className="mb-6">
                <p className="text-xs text-brand-muted mb-2 font-medium">Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={updating}
                      onClick={() => updateOrder(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedOrder.status === s
                          ? STATUS_CONFIG[s].color
                          : "border-brand-border text-brand-muted hover:border-brand-cyan/50"
                      }`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking */}
              <div className="mb-6">
                <p className="text-xs text-brand-muted mb-2 font-medium">Tracking Number</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={selectedOrder.trackingNumber || ""}
                    id="tracking-input"
                    placeholder="Enter tracking number"
                    className="flex-1 px-3 py-2 bg-white border border-brand-border rounded-lg text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                  />
                  <button
                    disabled={updating}
                    onClick={() => {
                      const input = document.getElementById("tracking-input") as HTMLInputElement;
                      updateOrder(selectedOrder.id, selectedOrder.status, input.value);
                    }}
                    className="px-4 py-2 rounded-lg bg-brand-cyan text-white text-xs font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Customer */}
              <div className="mb-6">
                <p className="text-xs text-brand-muted mb-2 font-medium">Customer</p>
                <div className="p-3 rounded-lg bg-gray-50 text-sm space-y-1">
                  <p className="text-gray-900 font-medium">{selectedOrder.customerName}</p>
                  {selectedOrder.customerEmail && <p className="text-brand-muted">{selectedOrder.customerEmail}</p>}
                  {selectedOrder.customerPhone && <p className="text-brand-muted">{selectedOrder.customerPhone}</p>}
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <p className="text-xs text-brand-muted mb-2 font-medium">Items</p>
                <div className="border border-brand-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-3 py-2 text-xs font-medium text-brand-muted">Product</th>
                        <th className="text-center px-3 py-2 text-xs font-medium text-brand-muted">Qty</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-brand-muted">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i} className="border-t border-brand-border">
                          <td className="px-3 py-2">
                            <p className="text-gray-900 font-medium">{item.name}</p>
                            <p className="text-xs text-brand-muted">{item.size}</p>
                          </td>
                          <td className="px-3 py-2 text-center text-gray-900">{item.quantity}</td>
                          <td className="px-3 py-2 text-right text-gray-900">AED {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 rounded-xl bg-[#1B3A5C] text-white">
                <span className="text-sm">Total</span>
                <span className="text-xl font-bold">AED {selectedOrder.total.toFixed(2)}</span>
              </div>

              <p className="text-[10px] text-brand-muted text-center mt-4">
                Ordered {new Date(selectedOrder.createdAt).toLocaleString("en-AE", { timeZone: "Asia/Dubai" })}
                {selectedOrder.updatedAt && ` · Updated ${new Date(selectedOrder.updatedAt).toLocaleString("en-AE", { timeZone: "Asia/Dubai" })}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
