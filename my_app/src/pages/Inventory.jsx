import React, { useState } from 'react';
import { useProducts, useInventory, useUpdateStock } from '../hooks/useQueries';
import { Box, RefreshCw, Save, Loader2, AlertCircle } from 'lucide-react';

// Sub-component to handle individual product stock logic
const InventoryItem = ({ product }) => {
    const { data: stockData, isLoading, refetch, isError } = useInventory(product.id);
    const { mutate: updateStock, isPending: isUpdating } = useUpdateStock();

    // Local state for the input
    const [newQuantity, setNewQuantity] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (newQuantity === '') return;

        updateStock({ product_id: product.id, quantity: parseInt(newQuantity) }, {
            onSuccess: () => {
                setSuccessMsg('Stock updated!');
                setNewQuantity('');
                refetch();
                setTimeout(() => setSuccessMsg(''), 3000);
            },
            onError: (err) => {
                setError(err.response?.data?.detail || 'Update failed');
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">ID: {product.id} • {product.strength}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Current Stock</div>
                    <div className="font-bold text-2xl text-primary flex items-center justify-end gap-2">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isError ? (
                            <span className="text-red-500 text-sm">Error</span>
                        ) : (
                            stockData?.quantity ?? '—'
                        )}
                        <button onClick={() => refetch()} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600" title="Refresh Stock">
                            <RefreshCw className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="flex gap-2 items-end">
                <div className="flex-1">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Set New Stock</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="Qty"
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isUpdating || newQuantity === ''}
                    className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update
                </button>
            </form>

            {(error || successMsg) && (
                <div className={`mt-2 text-xs p-2 rounded ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {error || successMsg}
                </div>
            )}
        </div>
    );
};

const Inventory = () => {
    const { data: products, isLoading, error } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

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
                <p>Failed to load products for inventory.</p>
            </div>
        );
    }

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Check levels and restock products</p>
                </div>
                <input
                    type="text"
                    placeholder="Search products..."
                    className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts?.map(product => (
                    <InventoryItem key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Inventory;
