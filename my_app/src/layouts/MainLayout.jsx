import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, ShoppingBag, ClipboardList, Box, Home, ShoppingCart } from 'lucide-react';
import CartSidebar from '../components/CartSidebar';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const { cartItems, setIsCartOpen } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path)
            ? "bg-blue-50 text-primary"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    };

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            {/* Sidebar / Floating Cart Icon on Left */}
            {user && (
                <div className="fixed left-6 bottom-10 z-[60]">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-visible"
                        title="View Cart"
                    >
                        <ShoppingCart className="w-8 h-8" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                                {cartItemCount}
                            </span>
                        )}
                        <span className="absolute left-full ml-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            My Cart
                        </span>
                    </button>
                </div>
            )}

            <CartSidebar />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/catalog" className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    P
                                </div>
                                <span className="font-bold text-xl text-gray-900">PharmaConnect</span>
                            </Link>

                            {user && (
                                <div className="hidden md:ml-10 md:flex md:space-x-4">
                                    <Link to="/catalog" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/catalog')}`}>
                                        <Home className="w-4 h-4" />
                                        Catalog
                                    </Link>
                                    <Link to="/orders" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/orders')}`}>
                                        <ClipboardList className="w-4 h-4" />
                                        Orders
                                    </Link>

                                    {/* Admin Only */}
                                    {user?.isAdmin && (
                                        <Link to="/inventory" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/inventory')}`}>
                                            <Box className="w-4 h-4" />
                                            Inventory
                                        </Link>
                                    )}

                                    {/* Admin Only */}
                                    {user?.isAdmin && (
                                        <Link to="/catalog/create" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 text-primary bg-blue-50 hover:bg-blue-100 ${isActive('/catalog/create')}`}>
                                            Add Product
                                        </Link>
                                    )}

                                    {/* Root/Superadmin Only */}
                                    {user?.isRoot && (
                                        <Link to="/users" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 text-purple-700 bg-purple-50 hover:bg-purple-100 ${isActive('/users')}`}>
                                            Users
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-700 hidden sm:block">
                                        Welcome, <span className="font-semibold">{user.username || user.full_name}</span>
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} PharmaConnect. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};


export default MainLayout;
