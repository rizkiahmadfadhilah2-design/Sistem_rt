import React, { useEffect, useState } from "react"
import Sidebar from "../component/Sidebar1"
import api from "../services/Api"
import { Users, Home, Wallet } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Line
} from "recharts"
import CountUp from "react-countup"
import { Sparklines, SparklinesLine } from "react-sparklines"
import { motion } from "framer-motion"

/* ===== THEME WARNA ===== */
const CHART_COLORS = {
  primary: "#2563eb",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626"
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger
]

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalWarga: 0,
    totalRumah: 0,
    totalKas: 0,
    wargaTerbaru: [],
    kasTerbaru: []
  })

  const [grafikUsia, setGrafikUsia] = useState([])
  const [grafikKas, setGrafikKas] = useState([])
  const [grafikStatus, setGrafikStatus] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }

        const dash = await api.get("/dashboard", { headers })
        setDashboard(dash.data)

        const usia = await api.get("/dashboard/grafik/usia", { headers })
        setGrafikUsia([
          { name: "Anak (0–12)", value: usia.data.anak },
          { name: "Remaja (13–25)", value: usia.data.remaja },
          { name: "Dewasa (26–60)", value: usia.data.dewasa },
          { name: "Lansia (>60)", value: usia.data.lansia }
        ])

        const kas = await api.get("/dashboard/grafik/kas", { headers })
        setGrafikKas(kas.data)

        const status = await api.get("/dashboard/grafik/status", { headers })
        setGrafikStatus(status.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="animate-pulse text-gray-500">
            Loading dashboard...
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 space-y-8">
        {/* ===== TITLE ===== */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold"
        >
          Dashboard Sistem Informasi RT
        </motion.h1>

        {/* ===== STAT CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<Users size={30} />}
            label="Total Warga"
            value={dashboard.totalWarga}
            color="blue"
            trend={[5, 8, 12, 15]}
          />
          <StatCard
            icon={<Home size={30} />}
            label="Total Rumah"
            value={dashboard.totalRumah}
            color="green"
            trend={[2, 4, 6, 8]}
          />
          <StatCard
            icon={<Wallet size={30} />}
            label="Total Kas"
            value={dashboard.totalKas}
            color="yellow"
            isCurrency
            trend={[100000, 150000, 200000]}
          />
        </div>

        {/* ===== PIE CHART ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartBox title="Distribusi Warga Berdasarkan Usia">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={grafikUsia}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  labelLine={false}
                >
                  {grafikUsia.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(v) => [`${v} Orang`, "Jumlah"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Status Warga">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={grafikStatus}
                  dataKey="total"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  labelLine={false}
                >
                  {grafikStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(v) => [`${v} Warga`, "Total"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>

        {/* ===== KAS ===== */}
        <ChartBox title="Kas Bulanan">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={grafikKas}>
              <XAxis dataKey="bulan" />
              <YAxis tickFormatter={(v) => `Rp ${v / 1000}k`} />
              <Legend />
              <ReTooltip
                formatter={(v) =>
                  `Rp ${Number(v).toLocaleString("id-ID")}`
                }
              />
              <Bar
                dataKey="pemasukan"
                fill={CHART_COLORS.success}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="pengeluaran"
                fill={CHART_COLORS.danger}
                radius={[6, 6, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* ===== TIMELINE ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimelineBox
            title="Warga Terbaru"
            items={dashboard.wargaTerbaru}
            type="warga"
          />
          <TimelineBox
            title="Kas Terbaru"
            items={dashboard.kasTerbaru}
            type="kas"
          />
        </div>
      </main>
    </div>
  )
}

/* ================= COMPONENT ================= */

function StatCard({ icon, label, value, color, isCurrency, trend }) {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    yellow: "from-yellow-400 to-yellow-600"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`bg-gradient-to-r ${colors[color]} p-5 rounded-xl shadow text-white overflow-hidden`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-sm">{label}</p>
          <h2 className="text-2xl font-bold">
            {isCurrency && "Rp "}
            <CountUp end={value} separator="." />
          </h2>
        </div>
      </div>

      <Sparklines data={trend} className="mt-3 h-6">
        <SparklinesLine color="white" />
      </Sparklines>
    </motion.div>
  )
}

function ChartBox({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white p-4 sm:p-6 rounded-xl shadow overflow-hidden"
    >
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </motion.div>
  )
}

function TimelineBox({ title, items, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-4 sm:p-6 rounded-xl shadow"
    >
      <h2 className="font-semibold mb-4">{title}</h2>

      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada data</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto overflow-x-hidden">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex flex-col sm:flex-row sm:justify-between gap-2 border p-3 rounded hover:bg-gray-50"
            >
              <div>
                {type === "warga" ? (
                  <>
                    <p className="font-semibold">{i.nama}</p>
                    <p className="text-sm text-gray-500">
                      No {i.no_rumah} | RT {i.rt}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">{i.keterangan}</p>
                    <p className="text-sm text-gray-500">
                      {i.jenis.toUpperCase()} |{" "}
                      {new Date(i.tanggal).toLocaleDateString("id-ID")}
                    </p>
                  </>
                )}
              </div>

              {type === "kas" && (
                <span
                  className={`font-semibold ${
                    i.jenis === "pemasukan"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Rp {Number(i.jumlah).toLocaleString("id-ID")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
