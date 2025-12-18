import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogService } from '../services/catalog';
import { useProduct, useUpdateProduct } from '../hooks/useQueries';
import { Button } from '../components/Button';
import { ArrowLeft, Edit, Save, Plus, Loader2 } from 'lucide-react';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading: isProductLoading } = useProduct(id);
    const { mutate: updateProduct, isLoading: isUpdating } = useUpdateProduct();

    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        ndc: '',
        form: '',
        strength: '',
        price: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                manufacturer: product.manufacturer || '',
                ndc: product.ndc || '',
                form: product.form || '',
                strength: product.strength || '',
                price: product.price || ''
            });
            if (product.image_url) {
                setImagePreview(product.image_url);
            }
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('manufacturer', formData.manufacturer);
        data.append('ndc', formData.ndc);
        data.append('form', formData.form);
        data.append('strength', formData.strength);
        data.append('price', parseFloat(formData.price) || 0);

        if (imageFile) {
            data.append('image', imageFile);
        }

        updateProduct({ id, data }, {
            onSuccess: () => navigate(`/catalog/${id}`),
            onError: (err) => alert("Failed to update product: " + (err.response?.data?.detail || err.message))
        });
    };

    if (isProductLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <button
                onClick={() => navigate(`/catalog/${id}`)}
                className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Product
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Edit className="w-6 h-6 text-blue-600" />
                    </div>
                    Update Product
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Area */}
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary transition-colors bg-gray-50/50 group">
                        {imagePreview ? (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-white shadow-inner flex items-center justify-center">
                                {/* Using normal img for preview, AuthImage not needed for local preview or initial loaded URL if handled by browser cache, but AuthImage is safer for subsequent loads */}
                                <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50">
                                        Change Image
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-32">
                                <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Click to upload product image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">NDC</label>
                            <input
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.ndc}
                                onChange={e => setFormData({ ...formData, ndc: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Form</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={formData.form}
                                onChange={e => setFormData({ ...formData, form: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Strength</label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={formData.strength}
                            onChange={e => setFormData({ ...formData, strength: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
