import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import OrderList from './pages/OrderList';
import Inventory from './pages/Inventory';
import CreateProduct from './pages/CreateProduct';
import UpdateProduct from './pages/UpdateProduct';
import UserList from './pages/UserList';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/catalog" />;
  return children;
};



function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="catalog" element={<ProductList />} />
        <Route path="catalog/create" element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        } />
        {/* Added route for updating a product */}
        <Route path="catalog/update/:id" element={
          <ProtectedRoute adminOnly>
            <UpdateProduct />
          </ProtectedRoute>
        } />
        <Route path="catalog/:id" element={<ProductDetail />} />

        <Route path="users" element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        } />

        <Route path="orders" element={
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        } />

        <Route path="inventory" element={
          <ProtectedRoute adminOnly>
            <Inventory />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
