import React from 'react';
import { useProducts, useInventory } from '../hooks/useQueries';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import CardSkeleton from '../components/CardSkeleton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const StockBadge = ({ productId }) => {
    const { data: stockData, isLoading } = useInventory(productId);

    if (isLoading) return <Loader2 className="w-3 h-3 animate-spin text-gray-400" />;

    const stock = stockData?.quantity ?? 0;
    const isOutOfStock = stock <= 0;

    return (
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
            }`}>
            {isOutOfStock ? 'OUT OF STOCK' : `STOCK: ${stock}`}
        </div>
    );
};

const ProductList = () => {
    const { data: products, isLoading, error } = useProducts();
    const { user } = useAuth();
    const { addToCart } = useCart();

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
        <div className="pb-12">
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
                    {products.map((product) => {
                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                            >
                                <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                    <Link to={`/catalog/${product.id}`} className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                        <ShoppingBag className="w-12 h-12 opacity-20" />
                                    </Link>
                                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                        <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm">
                                            {product.form}
                                        </div>
                                        <StockBadge productId={product.id} />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <Link to={`/catalog/${product.id}`}>
                                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.manufacturer}</p>
                                        <p className="text-xs text-gray-400 mt-1">{product.strength}</p>
                                    </Link>

                                    <div className="mt-6">
                                        <Button
                                            onClick={() => addToCart(product, 1)}
                                            variant="outline"
                                            className="w-full text-sm py-2 flex items-center justify-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary transition-all"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductList;


