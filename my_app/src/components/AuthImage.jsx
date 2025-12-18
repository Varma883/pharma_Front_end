import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Loader2, ImageOff } from 'lucide-react';

const AuthImage = ({ src, alt, className, ...props }) => {
    const [imgUrl, setImgUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) {
            setLoading(false);
            setError(true);
            return;
        }

        let isMounted = true;
        let blobUrl = null;

        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await api.get(src, {
                    responseType: 'blob'
                });

                if (isMounted) {
                    blobUrl = URL.createObjectURL(response.data);
                    setImgUrl(blobUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching authenticated image:", err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [src]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
        );
    }

    if (error || !imgUrl) {
        return (
            <div className={`flex items-center justify-center bg-gray-50 text-gray-300 ${className}`}>
                <ImageOff className="w-8 h-8 opacity-20" />
            </div>
        );
    }

    return <img src={imgUrl} alt={alt} className={className} {...props} />;
};

export default AuthImage;
