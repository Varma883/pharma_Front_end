import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import OrderList from './pages/OrderList';
import Inventory from './pages/Inventory';
import CreateProduct from './pages/CreateProduct';
import UserList from './pages/UserList';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
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
          <ProtectedRoute>
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
