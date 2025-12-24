import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Warga from "./pages/Warga"
import Kas from "./pages/kas"
import Laporan from "./pages/laporan"
import AjukanSurat from "./pages/AjukanSurat"
import SuratMasuk from "./pages/SuratMasuk"
import SuratSaya from "./pages/SuratSaya"
import HasilSurat from "./pages/HasilSurat"

import ProtectedRoute from "./component/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Login />} />

        {/* ===== PROTECTED (SEMUA ROLE) ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== RT ONLY ===== */}
        <Route
          path="/warga"
          element={
            <ProtectedRoute role="rt">
              <Warga />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kas"
          element={
            <ProtectedRoute role="rt">
              <Kas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/laporan"
          element={
            <ProtectedRoute role="rt">
              <Laporan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/surat-masuk"
          element={
            <ProtectedRoute role="rt">
              <SuratMasuk />
            </ProtectedRoute>
          }
        />

        {/* ===== WARGA ONLY ===== */}
        <Route
          path="/ajukan-surat"
          element={
            <ProtectedRoute role="warga">
              <AjukanSurat />
            </ProtectedRoute>
          }
        />

        <Route
        path="/surat-saya"
        element={
          <ProtectedRoute role ="warga">
            <SuratSaya />
          </ProtectedRoute>
        }
        />

        <Route
  path="/hasil-surat/:id"
  element={
    <ProtectedRoute role="warga">
      <HasilSurat />
    </ProtectedRoute>
  }
/>
  
        
        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}
