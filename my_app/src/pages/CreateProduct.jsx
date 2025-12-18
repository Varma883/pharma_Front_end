import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogService } from '../services/catalog';
import { Button } from '../components/Button';
import { ArrowLeft, Plus } from 'lucide-react';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        ndc: '',
        form: '',
        strength: '',
        price: '',
        quantity: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await catalogService.create({
                name: formData.name,
                manufacturer: formData.manufacturer,
                ndc: formData.ndc,
                form: formData.form,
                strength: formData.strength,
                // Sending price and quantity if they have values, otherwise optional
                ...(formData.price && { price: parseFloat(formData.price) }),
                ...(formData.quantity && { quantity: parseInt(formData.quantity) })
            });
            navigate('/catalog');
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <button
                onClick={() => navigate('/catalog')}
                className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Catalog
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-teal-50 rounded-lg">
                        <Plus className="w-6 h-6 text-primary" />
                    </div>
                    Add New Product
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Paracetamol 500mg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                            <input
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.manufacturer}
                                onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                                placeholder="e.g. Zenith Pharma"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">NDC</label>
                            <input
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.ndc}
                                onChange={e => setFormData({ ...formData, ndc: e.target.value })}
                                placeholder="00000-0000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Form</label>
                            <input
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.form}
                                onChange={e => setFormData({ ...formData, form: e.target.value })}
                                placeholder="e.g. Tablet, Capsule"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Strength</label>
                            <input
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.strength}
                                onChange={e => setFormData({ ...formData, strength: e.target.value })}
                                placeholder="e.g. 500mg"
                            />
                        </div>
                    </div>

                    {/* Price and Quantity - Keeping them as they might be useful, but making them optional or standardized if needed */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
