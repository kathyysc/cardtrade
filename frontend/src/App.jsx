import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SellPage from './pages/SellPage'
import BrowsePage from './pages/BrowsePage'
import ListingDetailPage from './pages/ListingDetailPage'
import MyListingsPage from './pages/MyListingsPage'
import { AuthProvider, useAuth } from './services/AuthContext'

/**
 * 受保護的路由 — 需要登入才能訪問
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

/**
 * App 主元件 — 路由設定
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* 公開頁面 */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/listing/:id" element={<ListingDetailPage />} />

              {/* 需要登入的頁面 */}
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
              <Route path="/sell" element={
                <ProtectedRoute><SellPage /></ProtectedRoute>
              } />
              <Route path="/my-listings" element={
                <ProtectedRoute><MyListingsPage /></ProtectedRoute>
              } />

              {/* 其他路由重導向到首頁 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
