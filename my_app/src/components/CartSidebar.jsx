import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './Button';
import { useCreateOrder } from '../hooks/useQueries';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
    const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCheckout = () => {
        setError('');
        const payload = {
            items: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        createOrder(payload, {
            onSuccess: () => {
                clearCart();
                setIsCartOpen(false);
                navigate('/orders');
            },
            onError: (err) => {
                setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
            }
        });
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            <div className="absolute inset-y-0 left-0 max-w-full flex">
                <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out">
                    <div className="h-full flex flex-col bg-white shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShoppingCart className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Items Section */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                    <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
                                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-2 text-primary text-sm font-semibold hover:underline"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-50 bg-gray-50/50 group">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                                <p className="text-sm text-gray-500 truncate">{item.manufacturer}</p>

                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 px-2 hover:bg-gray-50 text-gray-500 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-3 py-0.5 text-sm font-medium border-x border-gray-100 min-w-[32px] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 px-2 hover:bg-gray-50 text-gray-500 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-gray-500 font-medium">Total Items</span>
                                    <span className="text-xl font-bold text-gray-900">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                </div>

                                <Button
                                    className="w-full py-4 flex items-center justify-center gap-2 text-lg"
                                    onClick={handleCheckout}
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <ShoppingCart className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                                <p className="mt-4 text-center text-xs text-gray-400">
                                    Review your order before clicking the button above.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
