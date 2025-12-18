import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Truck, Users } from 'lucide-react';
import { Button } from '../components/Button';

const LandingPage = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-white">
            {/* Hero Section */}
            <div className="text-center max-w-3xl px-6 py-20">
                <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-teal-50 rounded-full animate-bounce">
                        <Activity className="w-16 h-16 text-primary" />
                    </div>
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Healthcare <span className="text-primary">Reimagined</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                    Order medicines, track inventory, and manage your pharmacy needs with a secure, modern platform designed for efficiency.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/login">
                        <Button className="px-8 py-3 text-lg shadow-lg shadow-teal-500/30">Get Started</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="secondary" className="px-8 py-3 text-lg">Create Account</Button>
                    </Link>
                </div>
            </div>

            {/* Feature Grids (Vector-like representation) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-20 max-w-6xl w-full">
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
                    <p className="text-gray-600">Enterprise-grade security for all your medical data and transactions.</p>
                </div>
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <Truck className="w-10 h-10 text-secondary mb-4" />
                    <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                    <p className="text-gray-600">Real-time tracking for all your pharmaceutical orders.</p>
                </div>
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <Users className="w-10 h-10 text-orange-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Expert Supoprt</h3>
                    <p className="text-gray-600">24/7 dedicated support for pharmacies and healthcare providers.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
