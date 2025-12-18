import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useInventory, useDeleteProduct } from '../hooks/useQueries';
import { ArrowLeft, ShoppingBag, Loader2, Building2, Hash, Layers, ShoppingCart, CheckCircle, Package, Edit2, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

import AuthImage from '../components/AuthImage';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(id);
    const { data: stockData, isLoading: isStockLoading } = useInventory(id);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { mutate: deleteProduct, isLoading: isDeleting } = useDeleteProduct();

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            deleteProduct(id, {
                onSuccess: () => navigate('/catalog')
            });
        }
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
                        {product.image_url ? (
                            <AuthImage
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <ShoppingBag className="w-32 h-32 text-gray-300" />
                        )}
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                                }`}>
                                {isStockLoading ? 'Checking...' : isOutOfStock ? 'OUT OF STOCK' : `${stock} IN STOCK`}
                            </div>
                            {product.price && (
                                <div className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-gray-100 text-gray-900">
                                    ${parseFloat(product.price).toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-8 md:w-2/3">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-lg text-gray-600">{product.manufacturer}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    Strength
                                </p>
                                <p className="font-semibold text-gray-900">{product.strength || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4" />
                                    Medication Form
                                </p>
                                <p className="font-semibold text-gray-900">{product.form || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    NDC Number
                                </p>
                                <p className="font-semibold text-gray-900 uppercase tracking-wider">{product.ndc || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Prescription Req.
                                </p>
                                <p className="font-semibold text-gray-900">Required</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center text-sm text-green-600 font-medium">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Available for immediate delivery
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Package className="w-4 h-4 mr-2" />
                                Standard shipping: 2-4 business days
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            {user?.isAdmin ? (
                                <>
                                    <Button
                                        onClick={() => navigate(`/catalog/update/${product.id}`)}
                                        className="flex-1 py-4 text-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                        Update Product
                                    </Button>
                                    <Button
                                        onClick={handleDelete}
                                        variant="outline"
                                        disabled={isDeleting}
                                        className="px-6 py-4 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => addToCart(product, 1)}
                                    disabled={isOutOfStock}
                                    className="flex-1 py-4 text-lg font-bold shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isOutOfStock ? 'Out of Stock' : 'Order Now'}
                                </Button>
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

