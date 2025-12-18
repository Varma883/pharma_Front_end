import React, { useState } from 'react';
import { useOrders, useCreateOrder } from '../hooks/useQueries';
import { useProducts } from '../hooks/useQueries'; // To select product name
import { Package, Plus, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';

const OrderList = () => {
    const { data: orders, isLoading, error } = useOrders();
    const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
    const { data: products } = useProducts(); // Helper to show product names if needed

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ product_id: '', quantity: 1 });
    const [createError, setCreateError] = useState('');

    const handleCreateOrder = (e) => {
        e.preventDefault();
        setCreateError('');

        if (!newItem.product_id || newItem.quantity < 1) {
            setCreateError('Please select a product and valid quantity.');
            return;
        }

        const payload = {
            items: [
                {
                    product_id: parseInt(newItem.product_id),
                    quantity: parseInt(newItem.quantity)
                }
            ]
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
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-600">
                <p>Failed to load orders.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Order
                </button>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-lg text-gray-900">Order #{order.id}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {order.items?.length} items
                                    {/* Ideally we would map product_id to name here using the products list */}
                                </div>
                            </div>
                            <div className="text-right">
                                {/* If there's a total price, display it. Requirements don't specify price in Order Object */}
                                <button className="text-primary text-sm hover:underline">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Create New Order</h2>

                        {createError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                                    value={newItem.product_id}
                                    onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {products?.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.strength})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Place Order
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
