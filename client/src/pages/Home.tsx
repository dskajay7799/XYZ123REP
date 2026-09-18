import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Calculator,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coins,
  Download,
  FileText,
  Filter,
  Grid2X2,
  Landmark,
  LayoutDashboard,
  ListFilter,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

const formatCurrency = (value: number) => currency.format(Math.round(value));
const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { id: "transactions", label: "Transactions", icon: ArrowUpRight },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "dividends", label: "Dividends", icon: Coins },
  { id: "simulator", label: "Simulator", icon: Calculator },
];

const baseHoldings = [
  {
    id: "reliance",
    symbol: "RELIANCE",
    name: "Reliance Industries",
    type: "Stocks",
    units: 10,
    avgBuy: 2450,
    currentPrice: 2754,
    color: "#295bd5",
    sector: "Conglomerate",
  },
  {
    id: "hdfc",
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    type: "Stocks",
    units: 16,
    avgBuy: 1510,
    currentPrice: 1642,
    color: "#5b84e9",
    sector: "Financials",
  },
  {
    id: "parag",
    symbol: "PPFAS",
    name: "Parag Parikh Flexi Cap",
    type: "Mutual Funds",
    units: 48.2,
    avgBuy: 62.4,
    currentPrice: 73.1,
    color: "#12a8a3",
    sector: "Diversified",
  },
  {
    id: "gold",
    symbol: "SGB 2031",
    name: "Sovereign Gold Bond",
    type: "Gold",
    units: 8.5,
    avgBuy: 6100,
    currentPrice: 7240,
    color: "#c99742",
    sector: "Precious metals",
  },
  {
    id: "fd",
    symbol: "HDFC FD",
    name: "HDFC Bank Fixed Deposit",
    type: "Fixed Deposits",
    units: 1,
    avgBuy: 30000,
    currentPrice: 32160,
    color: "#8b73d6",
    sector: "Fixed income",
  },
  {
    id: "nifty",
    symbol: "NIFTYBEES",
    name: "Nippon India ETF Nifty BeES",
    type: "ETFs",
    units: 12,
    avgBuy: 210,
    currentPrice: 235,
    color: "#d36d94",
    sector: "Index",
  },
];

const initialTransactions = [
  { id: 1, date: "12 Sep 2026", asset: "RELIANCE", type: "BUY", quantity: 2, price: 2754, amount: 5508, note: "Monthly allocation" },
  { id: 2, date: "20 Aug 2026", asset: "RELIANCE", type: "DIVIDEND", quantity: 10, price: 52, amount: 520, note: "Interim dividend" },
  { id: 3, date: "04 Jul 2026", asset: "HDFCBANK", type: "BUY", quantity: 4, price: 1510, amount: 6040, note: "Core allocation" },
  { id: 4, date: "18 May 2026", asset: "CASH", type: "DEPOSIT", quantity: 1, price: 20000, amount: 20000, note: "Salary transfer" },
  { id: 5, date: "25 Apr 2026", asset: "PPFAS", type: "BUY", quantity: 12.5, price: 62.4, amount: 780, note: "SIP contribution" },
  { id: 6, date: "14 Mar 2026", asset: "SGB 2031", type: "BUY", quantity: 2.5, price: 6100, amount: 15250, note: "Diversification" },
  { id: 7, date: "28 Feb 2026", asset: "CASH", type: "DEPOSIT", quantity: 1, price: 15000, amount: 15000, note: "Opening deposit" },
];

const history = [
  { month: "Oct 25", value: 104800 },
  { month: "Nov 25", value: 109600 },
  { month: "Dec 25", value: 112200 },
  { month: "Jan 26", value: 118900 },
  { month: "Feb 26", value: 124300 },
  { month: "Mar 26", value: 127800 },
  { month: "Apr 26", value: 131400 },
  { month: "May 26", value: 136200 },
  { month: "Jun 26", value: 138100 },
  { month: "Jul 26", value: 143700 },
  { month: "Aug 26", value: 148900 },
  { month: "Sep 26", value: 153800 },
];

const dividendHistory = [
  { month: "Oct", amount: 0 },
  { month: "Nov", amount: 220 },
  { month: "Dec", amount: 0 },
  { month: "Jan", amount: 160 },
  { month: "Feb", amount: 0 },
  { month: "Mar", amount: 0 },
  { month: "Apr", amount: 450 },
  { month: "May", amount: 0 },
  { month: "Jun", amount: 320 },
  { month: "Jul", amount: 0 },
  { month: "Aug", amount: 520 },
  { month: "Sep", amount: 0 },
];

const assetTypes = ["All assets", "Stocks", "Mutual Funds", "ETFs", "Gold", "Fixed Deposits", "Other"];

function StatCard({ label, value, detail, trend, icon: Icon, tone = "blue" }: any) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className={`icon-tile ${tones[tone]}`}><Icon size={18} strokeWidth={2.1} /></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        {trend ? <span className="positive inline-flex items-center gap-1"><ArrowUpRight size={13} />{trend}</span> : null}
        <span className="muted">{detail}</span>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function EmptyPanel({ title, copy, icon: Icon = FileText }: { title: string; copy: string; icon?: any }) {
  return (
    <div className="empty-panel">
      <div className="icon-tile bg-slate-100 text-slate-500"><Icon size={19} /></div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}

function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [range, setRange] = useState("1Y");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All assets");
  const [sortBy, setSortBy] = useState("value");
  const [holdings, setHoldings] = useState(baseHoldings);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<any>(null);
  const [simulator, setSimulator] = useState({ current: 153800, monthly: 15000, rate: 10, years: 10 });
  const [newInvestment, setNewInvestment] = useState({ name: "", type: "Stocks", units: "", buyPrice: "", currentPrice: "", date: "2026-09-18" });

  const computedHoldings = useMemo(() => holdings.map((holding) => {
    const invested = holding.units * holding.avgBuy;
    const value = holding.units * holding.currentPrice;
    const gain = value - invested;
    return { ...holding, invested, value, gain, returnPct: invested ? (gain / invested) * 100 : 0 };
  }), [holdings]);

  const totals = useMemo(() => computedHoldings.reduce((acc, holding) => ({
    invested: acc.invested + holding.invested,
    value: acc.value + holding.value,
    gain: acc.gain + holding.gain,
  }), { invested: 0, value: 0, gain: 0 }), [computedHoldings]);

  const overallReturn = totals.invested ? (totals.gain / totals.invested) * 100 : 0;

  const allocation = useMemo(() => {
    const grouped = computedHoldings.reduce<Record<string, number>>((acc, holding) => {
      acc[holding.type] = (acc[holding.type] || 0) + holding.value;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      pct: totals.value ? (value / totals.value) * 100 : 0,
      color: computedHoldings.find((holding) => holding.type === name)?.color || "#8c98aa",
    })).sort((a, b) => b.value - a.value);
  }, [computedHoldings, totals.value]);

  const filteredHoldings = useMemo(() => computedHoldings
    .filter((holding) => typeFilter === "All assets" || holding.type === typeFilter)
    .filter((holding) => `${holding.name} ${holding.symbol}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "return" ? b.returnPct - a.returnPct : sortBy === "gain" ? b.gain - a.gain : b.value - a.value), [computedHoldings, search, sortBy, typeFilter]);

  const visibleHistory = range === "1M" ? history.slice(-2) : range === "3M" ? history.slice(-4) : range === "6M" ? history.slice(-7) : range === "3Y" ? history : history;
  const bestHolding = [...computedHoldings].sort((a, b) => b.returnPct - a.returnPct)[0];
  const lowestHolding = [...computedHoldings].sort((a, b) => a.returnPct - b.returnPct)[0];
  const largestHolding = [...computedHoldings].sort((a, b) => b.value - a.value)[0];
  const totalDividends = dividendHistory.reduce((sum, item) => sum + item.amount, 0);
  const projected = useMemo(() => {
    const months = simulator.years * 12;
    const monthlyRate = simulator.rate / 100 / 12;
    const rows = [];
    let value = simulator.current;
    for (let month = 0; month <= months; month += 1) {
      if (month > 0) value = value * (1 + monthlyRate) + simulator.monthly;
      if (month % 12 === 0 || month === months) rows.push({ year: `Y${month / 12}`, value: Math.round(value) });
    }
    return rows;
  }, [simulator]);

  const handleNav = (id: string) => {
    setActiveSection(id);
    setMobileNavOpen(false);
  };

  const addInvestment = (event: React.FormEvent) => {
    event.preventDefault();
    const units = Number(newInvestment.units);
    const buyPrice = Number(newInvestment.buyPrice);
    const currentPrice = Number(newInvestment.currentPrice || newInvestment.buyPrice);
    if (!newInvestment.name || !units || !buyPrice || !currentPrice) {
      toast.error("Add an asset name, units, buy price, and current price.");
      return;
    }
    const symbol = newInvestment.name.toUpperCase().replace(/\s+/g, "").slice(0, 10);
    const colors = ["#295bd5", "#12a8a3", "#c99742", "#8b73d6", "#d36d94"];
    const next = { id: `${symbol}-${Date.now()}`, symbol, name: newInvestment.name, type: newInvestment.type, units, avgBuy: buyPrice, currentPrice, color: colors[holdings.length % colors.length], sector: "User added" };
    setHoldings((current) => [...current, next]);
    setTransactions((current) => [{ id: Date.now(), date: newInvestment.date, asset: symbol, type: "BUY", quantity: units, price: buyPrice, amount: units * buyPrice, note: "Added in InvestView" }, ...current]);
    setShowAdd(false);
    setNewInvestment({ name: "", type: "Stocks", units: "", buyPrice: "", currentPrice: "", date: "2026-09-18" });
    toast.success(`${newInvestment.name} added to your portfolio.`);
  };

  const pageTitle = navItems.find((item) => item.id === activeSection)?.label || "Dashboard";

  return (
    <div className={`app-shell ${dark ? "theme-dark" : ""}`}>
      <aside className={`sidebar ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Activity size={20} /></div>
          <div><div className="brand-name">InvestView</div><div className="brand-tagline">Personal wealth, clarified.</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="workspace-switcher"><div className="workspace-avatar">AS</div><div className="min-w-0 flex-1"><div className="workspace-name">Arjun's portfolio</div><div className="workspace-subtitle">Demo portfolio <span className="status-dot" /></div></div><ChevronDown size={15} className="muted" /></div>
        <nav className="nav-list" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${activeSection === id ? "active" : ""}`} onClick={() => handleNav(id)}><Icon size={18} /><span>{label}</span>{id === "transactions" ? <span className="nav-count">7</span> : null}</button>)}
          <p className="nav-label nav-label-spaced">Manage</p>
          <button className={`nav-item ${activeSection === "settings" ? "active" : ""}`} onClick={() => handleNav("settings")}><Settings2 size={18} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => toast.info("Help center is coming soon.")}><CircleHelp size={18} /><span>Help center</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17} /></div><p className="upgrade-title">Make your money legible.</p><p className="upgrade-copy">InvestView keeps your own numbers in focus — no noise, no advice.</p><button onClick={() => toast.info("InvestView is currently running in demo mode.")} className="upgrade-link">About demo mode <ChevronRight size={14} /></button></div><div className="security-note"><ShieldCheck size={15} /><span>Private by design</span></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div></div><div className="topbar-actions"><div className="demo-pill"><span className="pulse-dot" />Demo data</div><button className="icon-button" onClick={() => toast.info("No new notifications.")} aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><div className="profile-chip"><div className="profile-avatar">AS</div><span>Arjun Shah</span><ChevronDown size={14} /></div></div></header>

        <div className="page-content">
          {activeSection === "dashboard" ? <>
            <div className="page-intro"><div><p className="eyebrow">Thursday, 18 September 2026</p><h1>Good evening, Arjun <span className="wave">✦</span></h1><p className="page-subtitle">A clear view of where your money stands today.</p></div><div className="intro-actions"><button className="secondary-button" onClick={() => toast.success("Demo report prepared for download.")}><Download size={16} />Export report</button><button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={17} />Add investment</button></div></div>
            <div className="demo-notice"><div className="notice-icon"><Zap size={17} /></div><div><strong>You’re exploring a demo portfolio.</strong><span> Values are illustrative and not live market data. Add your own holdings to make this view yours.</span></div><button onClick={() => setShowAdd(true)}>Add your first holding <ChevronRight size={14} /></button></div>
            <section className="stats-grid"><StatCard label="Portfolio value" value={formatCurrency(totals.value)} detail="Across 6 holdings" trend="8.42% this year" icon={WalletCards} tone="blue" /><StatCard label="Total invested" value={formatCurrency(totals.invested)} detail="Capital deployed" icon={Landmark} tone="violet" /><StatCard label="Total gain" value={`+${formatCurrency(totals.gain)}`} detail="Unrealized · illustrative" trend={`${overallReturn.toFixed(2)}% return`} icon={TrendingUp} tone="green" /><StatCard label="Dividends received" value={formatCurrency(totalDividends)} detail="Last 12 months" trend="+₹520 this month" icon={Coins} tone="amber" /></section>
            <div className="dashboard-grid"><section className="panel chart-panel"><SectionHeading eyebrow="Portfolio growth" title="Value over time" action={<div className="range-tabs">{["1M", "3M", "6M", "1Y", "3Y", "All"].map((item) => <button key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>)}</div>} /><div className="chart-summary"><div><span className="chart-value">{formatCurrency(totals.value)}</span><span className="positive chart-change"><ArrowUpRight size={15} />{overallReturn.toFixed(2)}%</span></div><span className="muted text-xs">Updated from demo history · 18 Sep 2026</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={visibleHistory} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}><defs><linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#295bd5" stopOpacity={0.2} /><stop offset="100%" stopColor="#295bd5" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8edf4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8b96a8", fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b96a8", fontSize: 11 }} tickFormatter={(value) => formatCompact(value)} width={66} /><Tooltip cursor={{ stroke: "#c6d2e5", strokeDasharray: "4 4" }} content={({ active, payload, label }) => active && payload?.[0] ? <div className="chart-tooltip"><span>{label} 2026</span><strong>{formatCurrency(Number(payload[0].value))}</strong><small>Portfolio value · illustrative</small></div> : null} /><Area type="monotone" dataKey="value" stroke="#295bd5" strokeWidth={2.5} fill="url(#valueFill)" activeDot={{ r: 5, fill: "#295bd5", stroke: "#fff", strokeWidth: 3 }} /></AreaChart></ResponsiveContainer></div></section><section className="panel allocation-panel"><SectionHeading eyebrow="Asset allocation" title="Where your money sits" action={<button className="icon-button subtle"><MoreHorizontal size={17} /></button>} /><div className="allocation-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={allocation} dataKey="value" nameKey="name" innerRadius={67} outerRadius={91} paddingAngle={3} stroke="none" startAngle={90} endAngle={-270}>{allocation.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value: number) => formatCurrency(value)} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{formatCompact(totals.value)}</strong><span>Total value</span></div></div><div className="allocation-list">{allocation.map((item) => <button className="allocation-row" key={item.name} onClick={() => { setTypeFilter(item.name); setActiveSection("portfolio"); }}><span className="allocation-name"><i style={{ backgroundColor: item.color }} />{item.name}</span><span className="allocation-percent">{item.pct.toFixed(1)}%</span><span className="muted allocation-value">{formatCurrency(item.value)}</span></button>)}</div></section></div>
            <section className="panel holdings-panel"><SectionHeading eyebrow="Your investments" title="Holdings" action={<button className="text-button" onClick={() => setActiveSection("portfolio")}>View all holdings <ChevronRight size={15} /></button>} /><div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search holdings" /></div><div className="toolbar-right"><button className="filter-button" onClick={() => setTypeFilter(typeFilter === "All assets" ? "Stocks" : "All assets")}><Filter size={15} />{typeFilter === "All assets" ? "Filter" : typeFilter}<ChevronDown size={14} /></button><button className="icon-button subtle" onClick={() => setSortBy(sortBy === "value" ? "return" : "value")} aria-label="Change sort"><ListFilter size={16} /></button></div></div><HoldingsTable holdings={filteredHoldings.slice(0, 5)} onSelect={setSelectedHolding} /></section>
            <div className="bottom-grid"><section className="panel"><SectionHeading eyebrow="Latest activity" title="Recent transactions" action={<button className="text-button" onClick={() => setActiveSection("transactions")}>See ledger <ChevronRight size={15} /></button>} /><TransactionList transactions={transactions.slice(0, 4)} /></section><section className="panel"><SectionHeading eyebrow="Stay on track" title="Portfolio signals" /><div className="signal-list"><div className="signal-row"><div className="signal-icon green"><TrendingUp size={16} /></div><div><strong>{bestHolding?.symbol} is leading</strong><span>Best return in your current mix</span></div><b className="positive">+{bestHolding?.returnPct.toFixed(1)}%</b></div><div className="signal-row"><div className="signal-icon blue"><Target size={16} /></div><div><strong>Stocks are your largest sleeve</strong><span>{allocation.find((item) => item.name === "Stocks")?.pct.toFixed(1)}% of total value</span></div><ChevronRight size={16} className="muted" /></div><div className="signal-row"><div className="signal-icon amber"><CalendarDays size={16} /></div><div><strong>Next dividend tracked</strong><span>Reliance · expected in Dec 2026</span></div><span className="muted text-xs">₹520</span></div></div></section></div>
          </> : activeSection === "portfolio" ? <PortfolioPage holdings={filteredHoldings} search={search} setSearch={setSearch} typeFilter={typeFilter} setTypeFilter={setTypeFilter} sortBy={sortBy} setSortBy={setSortBy} onSelect={setSelectedHolding} onAdd={() => setShowAdd(true)} totals={totals} /> : activeSection === "transactions" ? <TransactionsPage transactions={transactions} /> : activeSection === "analytics" ? <AnalyticsPage holdings={computedHoldings} allocation={allocation} totals={totals} best={bestHolding} lowest={lowestHolding} largest={largestHolding} /> : activeSection === "dividends" ? <DividendsPage dividendHistory={dividendHistory} total={totalDividends} /> : activeSection === "simulator" ? <SimulatorPage simulator={simulator} setSimulator={setSimulator} projected={projected} /> : <SettingsPage dark={dark} setDark={setDark} />}
          <footer className="disclaimer"><ShieldCheck size={14} /><span>InvestView is an educational portfolio-tracking tool. It does not provide investment advice or recommendations. Market data and projections may be delayed, simulated, or based on user-provided assumptions.</span></footer>
        </div>
      </main>

      {showAdd ? <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAdd(false); }}><form className="modal-card" onSubmit={addInvestment}><div className="modal-header"><div><p className="eyebrow">Portfolio action</p><h2>Add investment</h2></div><button type="button" className="icon-button subtle" onClick={() => setShowAdd(false)}><X size={18} /></button></div><p className="modal-copy">Add a holding using your own records. Current values are manually entered until a market-data provider is connected.</p><div className="form-grid"><label className="form-field wide"><span>Asset name</span><input autoFocus value={newInvestment.name} onChange={(event) => setNewInvestment({ ...newInvestment, name: event.target.value })} placeholder="e.g. Tata Motors" /></label><label className="form-field"><span>Asset type</span><select value={newInvestment.type} onChange={(event) => setNewInvestment({ ...newInvestment, type: event.target.value })}>{assetTypes.slice(1).map((type) => <option key={type}>{type}</option>)}</select></label><label className="form-field"><span>Purchase date</span><input type="date" value={newInvestment.date} onChange={(event) => setNewInvestment({ ...newInvestment, date: event.target.value })} /></label><label className="form-field"><span>Quantity / units</span><input type="number" min="0" step="0.01" value={newInvestment.units} onChange={(event) => setNewInvestment({ ...newInvestment, units: event.target.value })} placeholder="0.00" /></label><label className="form-field"><span>Average buy price</span><input type="number" min="0" step="0.01" value={newInvestment.buyPrice} onChange={(event) => setNewInvestment({ ...newInvestment, buyPrice: event.target.value })} placeholder="₹ 0" /></label><label className="form-field"><span>Current price</span><input type="number" min="0" step="0.01" value={newInvestment.currentPrice} onChange={(event) => setNewInvestment({ ...newInvestment, currentPrice: event.target.value })} placeholder="₹ 0" /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={16} />Add holding</button></div></form></div> : null}
      {selectedHolding ? <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedHolding(null); }}><div className="modal-card detail-card"><div className="modal-header"><div><p className="eyebrow">Holding details</p><h2>{selectedHolding.name}</h2></div><button className="icon-button subtle" onClick={() => setSelectedHolding(null)}><X size={18} /></button></div><div className="detail-symbol"><span className="holding-logo" style={{ backgroundColor: selectedHolding.color }}>{selectedHolding.symbol.slice(0, 2)}</span><div><strong>{selectedHolding.symbol}</strong><span>{selectedHolding.type} · {selectedHolding.sector}</span></div><span className="asset-chip">Demo value</span></div><div className="detail-metrics"><div><span>Current value</span><strong>{formatCurrency(selectedHolding.value)}</strong></div><div><span>Invested</span><strong>{formatCurrency(selectedHolding.invested)}</strong></div><div><span>Gain / loss</span><strong className={selectedHolding.gain >= 0 ? "positive" : "negative"}>{selectedHolding.gain >= 0 ? "+" : ""}{formatCurrency(selectedHolding.gain)}</strong></div><div><span>Return</span><strong className={selectedHolding.returnPct >= 0 ? "positive" : "negative"}>{selectedHolding.returnPct.toFixed(2)}%</strong></div></div><div className="detail-note"><Clock3 size={15} /><span>{number.format(selectedHolding.units)} units at an average buy price of {formatCurrency(selectedHolding.avgBuy)}. This view is based on your entered records.</span></div><button className="primary-button full-width" onClick={() => { setSelectedHolding(null); setActiveSection("transactions"); }}>View related transactions <ChevronRight size={15} /></button></div></div> : null}
    </div>
  );
}

function HoldingsTable({ holdings, onSelect }: { holdings: any[]; onSelect: (holding: any) => void }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Asset</th><th>Type</th><th>Units</th><th>Avg. buy</th><th>Current value</th><th>Gain / loss</th><th>Return</th><th /></tr></thead><tbody>{holdings.map((holding) => <tr key={holding.id} onClick={() => onSelect(holding)}><td><div className="asset-cell"><span className="holding-logo" style={{ backgroundColor: holding.color }}>{holding.symbol.slice(0, 2)}</span><div><strong>{holding.symbol}</strong><span>{holding.name}</span></div></div></td><td><span className="type-label">{holding.type}</span></td><td>{number.format(holding.units)}</td><td>{formatCurrency(holding.avgBuy)}</td><td><strong>{formatCurrency(holding.value)}</strong></td><td className={holding.gain >= 0 ? "positive" : "negative"}>{holding.gain >= 0 ? "+" : ""}{formatCurrency(holding.gain)}</td><td><span className={`return-pill ${holding.returnPct >= 0 ? "up" : "down"}`}>{holding.returnPct >= 0 ? "+" : ""}{holding.returnPct.toFixed(2)}%</span></td><td><ChevronRight size={16} className="muted" /></td></tr>)}</tbody></table>{holdings.length === 0 ? <EmptyPanel title="No holdings found" copy="Try a different search or filter." icon={Search} /> : null}</div>;
}

function TransactionList({ transactions }: { transactions: any[] }) {
  return <div className="transaction-list">{transactions.map((transaction) => <div className="transaction-row" key={transaction.id}><div className={`transaction-icon ${transaction.type.toLowerCase()}`}>{transaction.type === "DIVIDEND" ? <Coins size={15} /> : transaction.type === "DEPOSIT" ? <WalletCards size={15} /> : <ArrowUpRight size={15} />}</div><div className="transaction-copy"><strong>{transaction.type === "DIVIDEND" ? "Dividend received" : transaction.type === "DEPOSIT" ? "Cash deposited" : `Bought ${transaction.asset}`}</strong><span>{transaction.date} · {transaction.note}</span></div><div className={`transaction-amount ${transaction.type === "BUY" ? "negative" : "positive"}`}>{transaction.type === "BUY" ? "−" : "+"}{formatCurrency(transaction.amount)}</div></div>)}</div>;
}

function PageHeader({ eyebrow, title, copy, action }: any) { return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-subtitle">{copy}</p></div>{action}</div>; }

function PortfolioPage({ holdings, search, setSearch, typeFilter, setTypeFilter, sortBy, setSortBy, onSelect, onAdd, totals }: any) {
  return <><PageHeader eyebrow="Portfolio" title="Your holdings" copy="A complete view of the assets you have recorded." action={<button className="primary-button" onClick={onAdd}><Plus size={17} />Add investment</button>} /><div className="mini-summary-row"><div><span>Current value</span><strong>{formatCurrency(totals.value)}</strong></div><div><span>Capital invested</span><strong>{formatCurrency(totals.invested)}</strong></div><div><span>Unrealized gain</span><strong className="positive">+{formatCurrency(totals.gain)}</strong></div><div><span>Holdings</span><strong>{holdings.length}</strong></div></div><section className="panel holdings-panel"><div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by asset or symbol" /></div><div className="toolbar-right"><select className="filter-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>{assetTypes.map((type) => <option key={type}>{type}</option>)}</select><button className="filter-button" onClick={() => setSortBy(sortBy === "value" ? "return" : "value")}><SlidersHorizontal size={15} />Sort: {sortBy === "value" ? "Value" : "Return"}</button></div></div><HoldingsTable holdings={holdings} onSelect={onSelect} /></section></>;
}

function TransactionsPage({ transactions }: { transactions: any[] }) {
  return <><PageHeader eyebrow="Activity" title="Transaction ledger" copy="Every contribution, purchase, and income event in one place." action={<button className="secondary-button" onClick={() => toast.success("Transaction CSV prepared for download.")}><Download size={16} />Export CSV</button>} /><div className="mini-summary-row"><div><span>All activity</span><strong>{transactions.length}</strong></div><div><span>Invested this year</span><strong>{formatCurrency(transactions.filter((item) => item.type === "BUY").reduce((sum, item) => sum + item.amount, 0))}</strong></div><div><span>Dividends</span><strong className="positive">+{formatCurrency(transactions.filter((item) => item.type === "DIVIDEND").reduce((sum, item) => sum + item.amount, 0))}</strong></div><div><span>Last activity</span><strong>12 Sep</strong></div></div><section className="panel holdings-panel"><div className="table-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search transactions" /></div><div className="toolbar-right"><button className="filter-button"><CalendarDays size={15} />Date range <ChevronDown size={14} /></button><button className="filter-button"><Filter size={15} />All types <ChevronDown size={14} /></button></div></div><div className="table-scroll"><table className="data-table transaction-table"><thead><tr><th>Date</th><th>Asset</th><th>Type</th><th>Quantity</th><th>Price</th><th>Amount</th><th>Notes</th></tr></thead><tbody>{transactions.map((item) => <tr key={item.id}><td className="muted">{item.date}</td><td><strong>{item.asset}</strong></td><td><span className={`transaction-tag ${item.type.toLowerCase()}`}>{item.type}</span></td><td>{item.quantity === 1 ? "—" : number.format(item.quantity)}</td><td>{formatCurrency(item.price)}</td><td className={item.type === "BUY" ? "negative" : "positive"}>{item.type === "BUY" ? "−" : "+"}{formatCurrency(item.amount)}</td><td className="muted">{item.note}</td></tr>)}</tbody></table></div></section></>;
}

function AnalyticsPage({ holdings, allocation, totals, best, lowest, largest }: any) {
  return <><PageHeader eyebrow="Descriptive analytics" title="Understand the mix" copy="Descriptive statistics about your own portfolio — not recommendations." action={<div className="demo-pill"><span className="pulse-dot" />Based on demo data</div>} /><div className="analytics-hero"><div><span className="eyebrow">Portfolio return</span><strong>+{((totals.gain / totals.invested) * 100).toFixed(2)}%</strong><span>Since first recorded contribution</span></div><div className="hero-divider" /><div><span className="eyebrow">Total gain</span><strong>{formatCurrency(totals.gain)}</strong><span>Unrealized · illustrative</span></div><div className="hero-spark"><ResponsiveContainer width="100%" height="100%"><AreaChart data={history}><defs><linearGradient id="miniFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.28} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></linearGradient></defs><Area dataKey="value" type="monotone" stroke="#fff" fill="url(#miniFill)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div><div className="analytics-grid"><section className="panel"><SectionHeading eyebrow="Composition" title="Allocation by asset class" /><div className="analytics-allocation">{allocation.map((item: any) => <div className="analytics-allocation-row" key={item.name}><div className="allocation-name"><i style={{ backgroundColor: item.color }} />{item.name}</div><div className="allocation-bar"><span style={{ width: `${item.pct}%`, backgroundColor: item.color }} /></div><strong>{item.pct.toFixed(1)}%</strong></div>)}</div></section><section className="panel"><SectionHeading eyebrow="Performance snapshot" title="Portfolio markers" /><div className="marker-list"><div><span>Best-performing holding</span><strong>{best?.symbol}</strong><b className="positive">+{best?.returnPct.toFixed(2)}%</b></div><div><span>Lowest-performing holding</span><strong>{lowest?.symbol}</strong><b className={lowest?.returnPct >= 0 ? "positive" : "negative"}>{lowest?.returnPct >= 0 ? "+" : ""}{lowest?.returnPct.toFixed(2)}%</b></div><div><span>Largest position</span><strong>{largest?.symbol}</strong><b>{formatCurrency(largest?.value)}</b></div><div><span>Average holding return</span><strong>{(holdings.reduce((sum: number, item: any) => sum + item.returnPct, 0) / holdings.length).toFixed(2)}%</strong><b className="muted">Across {holdings.length} assets</b></div></div></section></div><section className="panel"><SectionHeading eyebrow="Contribution analysis" title="What drove the gain?" /><div className="contribution-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={holdings.sort((a: any, b: any) => b.gain - a.gain)} layout="vertical" margin={{ left: 14, right: 20, top: 4, bottom: 4 }}><CartesianGrid horizontal={false} stroke="#edf0f5" /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b96a8" }} tickFormatter={(value) => formatCompact(value)} /><YAxis type="category" dataKey="symbol" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#5e6b7f" }} width={68} /><Tooltip formatter={(value: number) => formatCurrency(value)} /><Bar dataKey="gain" fill="#295bd5" radius={[0, 5, 5, 0]} barSize={24} /></BarChart></ResponsiveContainer></div></section></>;
}

function DividendsPage({ dividendHistory, total }: { dividendHistory: any[]; total: number }) {
  return <><PageHeader eyebrow="Income" title="Dividends" copy="Track cash income received from the investments you’ve recorded." action={<button className="secondary-button" onClick={() => toast.info("Dividend entry flow is available from the transaction ledger.")}><Plus size={16} />Record dividend</button>} /><div className="stats-grid three"><StatCard label="Total dividends" value={formatCurrency(total)} detail="Since first record" trend="+18.4% vs last year" icon={Coins} tone="amber" /><StatCard label="This year" value={formatCurrency(1450)} detail="2026 calendar year" icon={CalendarDays} tone="blue" /><StatCard label="Average monthly" value={formatCurrency(total / 12)} detail="Last 12 months" icon={Activity} tone="green" /></div><div className="dashboard-grid dividends-grid"><section className="panel chart-panel"><SectionHeading eyebrow="Cash income" title="Dividend income over time" action={<span className="asset-chip">Illustrative</span>} /><div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={dividendHistory} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e8edf4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8b96a8", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b96a8", fontSize: 11 }} tickFormatter={(value) => `₹${value}`} /><Tooltip formatter={(value: number) => formatCurrency(value)} /><Bar dataKey="amount" fill="#c99742" radius={[5, 5, 0, 0]} barSize={22} /></BarChart></ResponsiveContainer></div></section><section className="panel"><SectionHeading eyebrow="By asset" title="Income sources" /><div className="dividend-source"><div className="source-row"><div className="holding-logo small" style={{ backgroundColor: "#295bd5" }}>RE</div><div><strong>RELIANCE</strong><span>Interim + final dividend</span></div><b>{formatCurrency(970)}</b></div><div className="source-row"><div className="holding-logo small" style={{ backgroundColor: "#8b73d6" }}>FD</div><div><strong>HDFC FD</strong><span>Accrued interest</span></div><b>{formatCurrency(480)}</b></div><div className="source-row"><div className="holding-logo small" style={{ backgroundColor: "#c99742" }}>SG</div><div><strong>SGB 2031</strong><span>Coupon interest</span></div><b>{formatCurrency(0)}</b></div></div><div className="income-note"><Coins size={16} /><span>Dividend tracking is based on entries in your ledger; nothing here is fetched live.</span></div></section></div></>;
}

function SimulatorPage({ simulator, setSimulator, projected }: any) {
  return <><PageHeader eyebrow="What-if planning" title="Portfolio simulator" copy="Explore hypothetical outcomes based on assumptions you control." action={<div className="asset-chip"><Calculator size={14} /> Educational only</div>} /><div className="simulator-layout"><section className="panel simulator-controls"><SectionHeading eyebrow="Your assumptions" title="Adjust the scenario" /><label className="range-field"><div><span>Starting portfolio value</span><strong>{formatCurrency(simulator.current)}</strong></div><input type="range" min="0" max="1000000" step="5000" value={simulator.current} onChange={(event) => setSimulator({ ...simulator, current: Number(event.target.value) })} /></label><label className="range-field"><div><span>Monthly contribution</span><strong>{formatCurrency(simulator.monthly)}</strong></div><input type="range" min="0" max="100000" step="1000" value={simulator.monthly} onChange={(event) => setSimulator({ ...simulator, monthly: Number(event.target.value) })} /></label><label className="range-field"><div><span>Expected annual return</span><strong>{simulator.rate}%</strong></div><input type="range" min="0" max="20" step="0.5" value={simulator.rate} onChange={(event) => setSimulator({ ...simulator, rate: Number(event.target.value) })} /></label><label className="range-field"><div><span>Investment period</span><strong>{simulator.years} years</strong></div><input type="range" min="1" max="30" step="1" value={simulator.years} onChange={(event) => setSimulator({ ...simulator, years: Number(event.target.value) })} /></label><div className="simulator-warning"><ShieldCheck size={17} /><span>Projections are hypothetical, assumption-dependent, and not guaranteed. They are not a recommendation.</span></div></section><section className="panel chart-panel"><SectionHeading eyebrow="Hypothetical projection" title={`A possible ${simulator.years}-year path`} action={<span className="asset-chip">Assumption-based</span>} /><div className="sim-result"><div><span>Projected value</span><strong>{formatCurrency(projected[projected.length - 1]?.value || 0)}</strong></div><div><span>Total contributions</span><strong>{formatCurrency(simulator.current + (simulator.monthly * simulator.years * 12))}</strong></div><div><span>Illustrative growth</span><strong className="positive">+{formatCurrency((projected[projected.length - 1]?.value || 0) - simulator.current - (simulator.monthly * simulator.years * 12))}</strong></div></div><div className="chart-wrap simulator-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={projected} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}><defs><linearGradient id="projectionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#12a8a3" stopOpacity={0.24} /><stop offset="100%" stopColor="#12a8a3" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8edf4" /><XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#8b96a8", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b96a8", fontSize: 11 }} tickFormatter={(value) => formatCompact(value)} /><Tooltip formatter={(value: number) => formatCurrency(value)} /><Area type="monotone" dataKey="value" stroke="#12a8a3" strokeWidth={2.5} fill="url(#projectionFill)" /></AreaChart></ResponsiveContainer></div></section></div></>;
}

function SettingsPage({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  return <><PageHeader eyebrow="Workspace preferences" title="Settings" copy="Keep the experience aligned with how you track your money." /><div className="settings-grid"><section className="panel settings-card"><SectionHeading eyebrow="Appearance" title="Your workspace" /><div className="setting-row"><div className="setting-icon"><Moon size={17} /></div><div><strong>Dark mode</strong><span>Use a low-light interface for evening reviews.</span></div><button className={`toggle ${dark ? "on" : ""}`} onClick={() => setDark(!dark)} aria-label="Toggle dark mode"><span /></button></div><div className="setting-row"><div className="setting-icon"><Grid2X2 size={17} /></div><div><strong>Default landing page</strong><span>Open Dashboard when you start a session.</span></div><span className="setting-value">Dashboard <ChevronDown size={14} /></span></div><div className="setting-row"><div className="setting-icon"><Coins size={17} /></div><div><strong>Display currency</strong><span>Used for summaries and portfolio calculations.</span></div><span className="setting-value">INR (₹) <ChevronDown size={14} /></span></div></section><section className="panel settings-card"><SectionHeading eyebrow="Data & privacy" title="Your records" /><div className="setting-row"><div className="setting-icon"><ShieldCheck size={17} /></div><div><strong>Demo mode</strong><span>Illustrative records are stored only in this browser session.</span></div><span className="status-badge">Active</span></div><div className="setting-row"><div className="setting-icon"><FileText size={17} /></div><div><strong>Market data provider</strong><span>No live provider connected. Prices are user-entered or illustrative.</span></div><span className="setting-value muted">Not connected</span></div><button className="danger-button" onClick={() => toast.info("Demo reset is disabled in this preview.")}>Reset demo portfolio</button></section></div></>;
}

export default Home;
