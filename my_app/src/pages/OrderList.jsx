import React, { useState } from 'react';
import { useOrders, useCreateOrder, useProducts } from '../hooks/useQueries';
import { Package, Plus, Loader2, AlertCircle, ShoppingCart, Calendar, ChevronRight, Hash, Clock } from 'lucide-react';
import { Button } from '../components/Button';

const OrderList = () => {
    const { data: orders, isLoading, error } = useOrders();
    const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
    const { data: products } = useProducts();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ product_id: '', quantity: 1 });
    const [createError, setCreateError] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const handleCreateOrder = (e) => {
        e.preventDefault();
        setCreateError('');

        if (!newItem.product_id || newItem.quantity < 1) {
            setCreateError('Please select a product and valid quantity.');
            return;
        }

        const payload = {
            items: [{ product_id: parseInt(newItem.product_id), quantity: parseInt(newItem.quantity) }]
        };

        createOrder(payload, {
            onSuccess: () => {
                setIsModalOpen(false);
                setNewItem({ product_id: '', quantity: 1 });
            },
            onError: (err) => {
                setCreateError(err.response?.data?.detail || 'Failed to create order.');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex p-4 bg-red-50 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Failed to load orders</h3>
                <p className="text-gray-500 mt-2">Please check your connection and try again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
                    <p className="text-gray-500 mt-1">Manage and track your pharmaceutical orders</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    New Manual Order
                </Button>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="inline-flex p-6 bg-white rounded-2xl shadow-sm mb-6">
                        <Package className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">
                        Your pharmaceutical orders will appear here once you place them.
                    </p>
                    <Button
                        variant="link"
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 text-primary font-bold"
                    >
                        Place your first order
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.sort((a, b) => b.id - a.id).map((order) => {
                        const { date, time } = formatDate(order.created_at || new Date());
                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Order Header Info */}
                                    <div className="p-6 md:w-1/4 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100">
                                        <div className="flex items-center gap-2 text-primary font-bold mb-1">
                                            <Hash className="w-4 h-4" />
                                            <span className="tracking-wider">ORD-{String(order.id).padStart(5, '0')}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {time}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${order.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            {order.items?.map((item, idx) => {
                                                const product = products?.find(p => p.id === item.product_id);
                                                return (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-primary">
                                                                <Package className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{product?.name || `Product ID: ${item.product_id}`}</p>
                                                                <p className="text-xs text-gray-500">{product?.strength || 'Details unavailable'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-gray-400">Qty:</span>
                                                            <span className="ml-2 font-bold text-gray-900">{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                                            <p className="text-xs text-gray-400 italic">
                                                Thank you for choosing Pharma Hub
                                            </p>
                                            <button className="flex items-center gap-1 text-primary text-sm font-bold hover:gap-2 transition-all">
                                                Full Invoice Details
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl scale-in-center">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">New Order</h2>
                        </div>

                        {createError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="font-medium">{createError}</p>
                            </div>
                        )}

                        <form onSubmit={handleCreateOrder} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select Medication</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                    value={newItem.product_id}
                                    onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                                    required
                                >
                                    <option value="">Medication list...</option>
                                    {products?.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} — {p.strength}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Order Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all"
                                >
                                    {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
