import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useInventory } from '../hooks/useQueries';
import { ArrowLeft, ShoppingBag, Loader2, Building2, Hash, Layers, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(id);
    const { data: stockData, isLoading: isStockLoading } = useInventory(id);
    const { addToCart } = useCart();

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
                <p>Failed to load product details.</p>
                <button
                    onClick={() => navigate('/catalog')}
                    className="mt-4 text-primary hover:underline"
                >
                    Back to Catalog
                </button>
            </div>
        );
    }

    if (!product) return null;

    const stock = stockData?.quantity ?? 0;
    const isOutOfStock = stock <= 0;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/catalog')}
                className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100 relative">
                        <ShoppingBag className="w-32 h-32 text-gray-300" />
                        <div className="absolute top-4 right-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                                }`}>
                                {isStockLoading ? 'Checking...' : isOutOfStock ? 'OUT OF STOCK' : `${stock} IN STOCK`}
                            </div>
                        </div>
                    </div>
                    <div className="p-8 md:w-2/3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-lg text-gray-500 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {product.manufacturer}
                                </p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {product.form}
                            </span>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    Strength
                                </div>
                                <div className="font-semibold text-gray-900">{product.strength}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    NDC Code
                                </div>
                                <div className="font-semibold text-gray-900">{product.ndc}</div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                onClick={() => addToCart(product, 1)}
                                className="w-full sm:w-auto flex items-center gap-2 px-8 py-3"
                                disabled={isOutOfStock}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Order Now (Add to Cart)
                            </Button>

                            {!isOutOfStock && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Available for delivery
                                </div>
                            )}
                        </div>

                        <div className="mt-6 text-xs text-gray-400">
                            Added on: {new Date(product.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

