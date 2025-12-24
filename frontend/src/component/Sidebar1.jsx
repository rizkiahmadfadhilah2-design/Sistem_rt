import React, { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Mail,
  ChevronLeft,
  LogOut,
  Menu
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const [collapse, setCollapse] = useState(
    localStorage.getItem("sidebar-collapse") === "true"
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  const menusRT = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Data Warga", path: "/warga", icon: Users },
    { name: "Kas RT", path: "/kas", icon: Wallet },
    { name: "Laporan", path: "/laporan", icon: FileText },
    { name: "Surat Masuk", path: "/surat-masuk", icon: Mail }
  ]

  const menusWarga = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ajukan Surat", path: "/ajukan-surat", icon: Mail },
    { name: "Surat Saya", path: "/surat-saya", icon: FileText }
  ]

  const menus = role === "rt" ? menusRT : menusWarga

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      localStorage.clear()
      navigate("/")
    }
  }

  return (
    <>
      {/* ===== TOP BAR MOBILE ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow flex items-center px-4 z-40">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <span className="ml-4 font-semibold text-blue-700">Sistem RT</span>
      </div>

      {/* ===== OVERLAY MOBILE ===== */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR DESKTOP ===== */}
      <motion.aside
        animate={{ width: collapse ? 80 : 260 }}
        transition={{ duration: 0.3 }}
        className="
          hidden md:flex flex-col
          min-h-screen p-4
          bg-gradient-to-b from-blue-50 via-blue-100 to-indigo-100
          shadow-xl rounded-r-3xl
        "
      >
        <SidebarContent
          collapse={collapse}
          toggleCollapse={() => {
            const next = !collapse
            setCollapse(next)
            localStorage.setItem("sidebar-collapse", next)
          }}
          menus={menus}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </motion.aside>

      {/* ===== SIDEBAR MOBILE (DRAWER) ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3 }}
            className="
              fixed top-0 left-0 z-50
              w-64 min-h-screen p-4
              flex flex-col
              bg-gradient-to-b from-blue-50 via-blue-100 to-indigo-100
              shadow-xl
            "
          >
            <SidebarContent
              collapse={false}
              menus={menus}
              pathname={pathname}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* spacer top bar */}
      <div className="h-14 md:hidden" />
    </>
  )
}

/* ===============================
   SIDEBAR CONTENT
================================ */
function SidebarContent({
  collapse,
  toggleCollapse,
  menus,
  pathname,
  onLogout,
  onNavigate
}) {
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        {!collapse && (
          <h1 className="font-bold text-xl text-blue-700">
            Sistem <span className="text-indigo-600">RT</span>
          </h1>
        )}
        {toggleCollapse && (
          <button
            onClick={toggleCollapse}
            className="p-2 bg-white rounded-full shadow"
          >
            <ChevronLeft
              className={`${collapse ? "rotate-180" : ""} transition`}
            />
          </button>
        )}
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon
          const active = pathname === menu.path

          return (
            <Link
              key={menu.path}
              to={menu.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 p-3 rounded-xl transition
                ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-white/70"
                }`}
            >
              <Icon size={22} />
              {!collapse && <span>{menu.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* LOGOUT (FIX AMAN) */}
      <button
        onClick={onLogout}
        className="
          mt-auto
          flex items-center gap-3 p-3 rounded-xl
          bg-red-500 text-white shadow
          hover:bg-red-600 transition
        "
      >
        <LogOut size={20} />
        {!collapse && <span>Logout</span>}
      </button>
    </div>
  )
}
