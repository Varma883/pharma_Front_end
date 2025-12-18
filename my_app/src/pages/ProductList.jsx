import React from 'react';
import { useProducts } from '../hooks/useQueries';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import CardSkeleton from '../components/CardSkeleton';
import { useAuth } from '../context/AuthContext';

const ProductList = () => {
    const { data: products, isLoading, error } = useProducts();
    const { user } = useAuth();

    if (isLoading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-600">
                <p>Failed to load products. Please try again.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                {user?.isAdmin && (
                    <Link to="/catalog/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Button>
                    </Link>
                )}
            </div>

            {!products || products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            to={`/catalog/${product.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                        >
                            <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                    <ShoppingBag className="w-12 h-12 opacity-20" />
                                </div>
                                <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                                    {product.form}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.manufacturer}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{product.strength}</span>
                                    <button className="text-primary text-sm font-medium hover:underline">View Details</button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
