import { useEffect, useState, useMemo } from "react";
import { getBookings } from "./api/bookings";
import { getMetrics } from "./api/metrics";
import { getTrends } from "./api/trends";
import type { Booking, Metrics, Trend } from "./api/types";
import "./App.css";

import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import MetricCard from "./components/MetricCard";

// Premium Custom SVG Icons
const Icons = {
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  TotalBookings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Revenue: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  Occupancy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Conversion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Sort: ({ active, order }: { active: boolean; order: "asc" | "desc" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sort-icon ${active ? "active" : ""}`}
      style={{
        transform: active && order === "desc" ? "rotate(180deg)" : "none",
        transition: "transform 0.2s ease",
      }}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
  ),
  Empty: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  ),
  Hotel: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="9" y2="16"></line>
      <line x1="15" y1="22" x2="15" y2="16"></line>
      <line x1="9" y1="16" x2="15" y2="16"></line>
      <path d="M9 6h.01"></path>
      <path d="M15 6h.01"></path>
      <path d="M9 10h.01"></path>
      <path d="M15 10h.01"></path>
    </svg>
  ),
  Logo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
      <path d="M2 10h20"></path>
    </svg>
  )
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string;
  prefix?: string;
}

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label, prefix = "" }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          padding: "12px",
          borderRadius: "10px",
          boxShadow: "var(--card-shadow)",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
        }}
      >
        <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color || "var(--accent)", margin: "4px 0", display: "flex", gap: "8px", justifyContent: "space-between" }}>
            <span>{p.name}:</span>
            <span style={{ fontWeight: 600 }}>
              {prefix}
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter conditions
  const [days, setDays] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [hotelFilter, setHotelFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  // Table sorting
  const [sortBy, setSortBy] = useState<keyof Booking>("bookingDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Trend Metric Tab
  const [trendMetric, setTrendMetric] = useState<"bookings" | "revenue" | "avgRoomRate">("bookings");

  // Theme support
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme to body element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch all bookings for the given period (no status filter at API layer for client-side search/filter capability)
        const bookingsRes = await getBookings(days);
        setBookings(bookingsRes.data || []);

        const metricsRes = await getMetrics(days);
        setMetrics(metricsRes.data || null);

        const trendsRes = await getTrends(6); // Retrieve last 6 months trend
        setTrends(trendsRes.data || []);

        // Reset page back to 1 on time window changes
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotel analytics dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  // Derived filter options based on raw data
  const hotelOptions = useMemo(() => {
    const names = bookings.map((b) => b.hotelName).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [bookings]);

  const roomOptions = useMemo(() => {
    const types = bookings.map((b) => b.roomType).filter(Boolean);
    return Array.from(new Set(types)).sort();
  }, [bookings]);

  const paymentOptions = useMemo(() => {
    const statuses = bookings.map((b) => b.paymentStatus).filter(Boolean);
    return Array.from(new Set(statuses)).sort();
  }, [bookings]);

  // Client-side filtering logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchSearch =
        booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = !statusFilter || booking.status === statusFilter;
      const matchHotel = !hotelFilter || booking.hotelName === hotelFilter;
      const matchRoom = !roomFilter || booking.roomType === roomFilter;
      const matchPayment = !paymentFilter || booking.paymentStatus === paymentFilter;

      return matchSearch && matchStatus && matchHotel && matchRoom && matchPayment;
    });
  }, [bookings, searchQuery, statusFilter, hotelFilter, roomFilter, paymentFilter]);

  // Client-side sorting logic
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (sortBy === "amount") {
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortBy, sortOrder]);

  // Client-side pagination calculations
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = useMemo(() => {
    return sortedBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBookings, startIndex]);

  // Handle click to sort columns
  const handleSort = (key: keyof Booking) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc"); // Default to desc (newer dates or larger sums first)
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setHotelFilter("");
    setRoomFilter("");
    setPaymentFilter("");
    setCurrentPage(1);
  };

  // Pie chart (Booking Status Distribution) data
  const pieData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: "Confirmed", value: metrics.confirmed, color: "var(--status-confirmed)" },
      { name: "Pending", value: metrics.pending, color: "var(--status-pending)" },
      { name: "Cancelled", value: metrics.cancelled, color: "var(--status-cancelled)" },
    ].filter((item) => item.value > 0);
  }, [metrics]);

  return (
    <div className="dashboard-container">
      {/* Top Header Navbar */}
      <header className="dashboard-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Icons.Logo />
          </div>
          <div className="brand-title">
            <h1>MyTravaly</h1>
            <p>Hotel Analytics & Bookings Control Center</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Icons.Moon /> : <Icons.Sun />}
          </button>

          {/* Time range controller */}
          <div className="range-selector">
            {[7, 30, 90, 180, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`range-tab ${days === d ? "active" : ""}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Error Alert Box */}
      {error && (
        <div
          style={{
            background: "var(--status-cancelled-bg)",
            color: "var(--status-cancelled)",
            border: "1px solid var(--status-cancelled)",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <section className="metrics-grid">
        <MetricCard
          title="Total Bookings"
          value={metrics ? metrics.totalBookings.toLocaleString() : "0"}
          icon={<Icons.TotalBookings />}
          subtitle={`Total rooms reserved`}
          isLoading={loading}
        />
        <MetricCard
          title="Total Revenue"
          value={metrics ? `₹${metrics.totalRevenue.toLocaleString()}` : "₹0"}
          icon={<Icons.Revenue />}
          subtitle="Net revenue generated"
          isLoading={loading}
        />
        <MetricCard
          title="Occupancy Rate"
          value={metrics ? `${metrics.occupancyRate}%` : "0%"}
          icon={<Icons.Occupancy />}
          subtitle="Proportion of occupied rooms"
          isLoading={loading}
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics ? `${metrics.conversionRate}%` : "0%"}
          icon={<Icons.Conversion />}
          subtitle="Percentage of visitors booking"
          isLoading={loading}
        />
      </section>

      {/* Dynamic Filter Panel Card */}
      <section className="filter-card">
        <div className="filter-header">
          <h3>
            <Icons.Filter />
            Interactive Filtering
          </h3>
          {(searchQuery || statusFilter || hotelFilter || roomFilter || paymentFilter) && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              <Icons.Trash />
              Clear Filters
            </button>
          )}
        </div>

        <div className="filter-grid">
          {/* Guest / ID search */}
          <div className="filter-group">
            <label htmlFor="search-input">Search Bookings</label>
            <div className="search-input-wrapper">
              <Icons.Search />
              <input
                id="search-input"
                type="text"
                className="search-input"
                placeholder="Guest name or Booking ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Hotel Filter */}
          <div className="filter-group">
            <label htmlFor="hotel-select">Hotel Location</label>
            <select
              id="hotel-select"
              className="filter-select"
              value={hotelFilter}
              onChange={(e) => {
                setHotelFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Hotels ({hotelOptions.length})</option>
              {hotelOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label htmlFor="status-select">Booking Status</label>
            <select
              id="status-select"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div className="filter-group">
            <label htmlFor="room-select">Room Category</label>
            <select
              id="room-select"
              className="filter-select"
              value={roomFilter}
              onChange={(e) => {
                setRoomFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Room Types ({roomOptions.length})</option>
              {roomOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="filter-group">
            <label htmlFor="payment-select">Payment Status</label>
            <select
              id="payment-select"
              className="filter-select"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Payment ({paymentOptions.length})</option>
              {paymentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Analytics Charts Grid */}
      <section className="charts-grid">
        {/* Trend chart */}
        <div className="chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <h3>
              <Icons.Hotel />
              Hotel Performance Trends
            </h3>
            
            {/* Metric toggler inside trends card */}
            <div className="trend-toggle-tabs">
              {(["bookings", "revenue", "avgRoomRate"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTrendMetric(m)}
                  className={`trend-tab ${trendMetric === m ? "active" : ""}`}
                >
                  {m === "bookings" ? "Reservations" : m === "revenue" ? "Revenue" : "Avg Room Rate"}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-container">
            {loading ? (
              <div className="skeleton skeleton-chart-box"></div>
            ) : trends.length === 0 ? (
              <div className="empty-state">
                <Icons.Empty />
                <h4>No Trend Data Available</h4>
                <p>Performance trends could not be calculated.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                {trendMetric === "revenue" ? (
                  <BarChart data={trends} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip content={<CustomTooltip prefix="₹" />} cursor={{ fill: "var(--accent-glow)", opacity: 0.4 }} />
                    <Bar name="Revenue" dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip prefix={trendMetric === "avgRoomRate" ? "₹" : ""} />} />
                    <Area
                      type="monotone"
                      name={trendMetric === "bookings" ? "Bookings" : "Average Room Rate"}
                      dataKey={trendMetric}
                      stroke="var(--accent)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorArea)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div className="chart-card">
          <h3>
            <Icons.Calendar />
            Status Distribution
          </h3>

          <div className="chart-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <div className="skeleton skeleton-chart-box"></div>
            ) : pieData.length === 0 ? (
              <div className="empty-state">
                <Icons.Empty />
                <h4>No Status Distribution</h4>
                <p>Status parameters contain no values.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    cx="50%"
                    cy="45%"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{value}</span>}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="bookings-card">
        <div className="bookings-header">
          <div className="bookings-header-title">
            <h3>Recent Bookings</h3>
            <span className="bookings-count-badge">
              {filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>
        </div>

        {loading ? (
          // Skeleton Table Loading View
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton" style={{ height: "40px", borderRadius: "8px" }}></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-table-row"></div>
            ))}
          </div>
        ) : sortedBookings.length === 0 ? (
          // Empty state when filters result in 0 rows
          <div className="empty-state">
            <Icons.Empty />
            <h4>No Bookings Found</h4>
            <p>We couldn't find any bookings matching your current filter settings.</p>
            <button
              onClick={handleClearFilters}
              className="pagination-btn"
              style={{ marginTop: "16px", background: "var(--accent)", color: "#ffffff", border: "none" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>
                      <div className="th-content">
                        ID
                        <Icons.Sort active={sortBy === "id"} order={sortOrder} />
                      </div>
                    </th>
                    <th onClick={() => handleSort("guestName")}>
                      <div className="th-content">
                        Guest
                        <Icons.Sort active={sortBy === "guestName"} order={sortOrder} />
                      </div>
                    </th>
                    <th onClick={() => handleSort("hotelName")}>
                      <div className="th-content">
                        Hotel
                        <Icons.Sort active={sortBy === "hotelName"} order={sortOrder} />
                      </div>
                    </th>
                    <th onClick={() => handleSort("checkIn")}>
                      <div className="th-content">
                        Stay Period
                        <Icons.Sort active={sortBy === "checkIn"} order={sortOrder} />
                      </div>
                    </th>
                    <th onClick={() => handleSort("status")}>
                      <div className="th-content">
                        Status
                        <Icons.Sort active={sortBy === "status"} order={sortOrder} />
                      </div>
                    </th>
                    <th onClick={() => handleSort("amount")}>
                      <div className="th-content">
                        Amount
                        <Icons.Sort active={sortBy === "amount"} order={sortOrder} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={{ fontWeight: 600 }}>{booking.id}</td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 500 }}>{booking.guestName}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                            Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td>{booking.hotelName}</td>
                      <td>
                        <div style={{ fontSize: "13px" }}>
                          <div>In: {booking.checkIn}</div>
                          <div style={{ color: "var(--text-tertiary)" }}>Out: {booking.checkOut}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 600 }}>₹{booking.amount.toLocaleString()}</span>
                          <span className="room-badge" style={{ marginTop: "4px", width: "fit-content" }}>
                            {booking.roomType}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-bookings-grid">
              {currentBookings.map((booking) => (
                <div key={booking.id} className="booking-mobile-card">
                  <div className="mobile-card-row">
                    <span className="mobile-card-id">{booking.id}</span>
                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                  </div>

                  <div>
                    <div className="mobile-card-guest">{booking.guestName}</div>
                    <div className="mobile-card-hotel">{booking.hotelName}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid var(--border-primary)", paddingTop: "12px" }}>
                    <div>
                      <div className="mobile-card-label">Check In</div>
                      <div className="mobile-card-val">{booking.checkIn}</div>
                    </div>
                    <div>
                      <div className="mobile-card-label">Check Out</div>
                      <div className="mobile-card-val">{booking.checkOut}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-primary)", paddingTop: "12px" }}>
                    <div>
                      <span className="room-badge">{booking.roomType}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>
                        ₹{booking.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Panel */}
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
              </div>

              <div className="pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;