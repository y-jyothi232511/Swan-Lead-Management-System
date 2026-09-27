import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

const [leads, setLeads] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [dateFilter, setDateFilter] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const leadsPerPage = 5;
const [activePage, setActivePage] = useState("Dashboard");

  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterested: "",
    status: "New",
    followUpDate: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // AUTHENTICATION
  // =========================

  const handleAuthChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/register";

      const body = isLogin
        ? {
            email: authForm.email,
            password: authForm.password,
          }
        : authForm;

      const response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setMessage("Login successful!");
      } else {
        setMessage("Registration successful. Please login.");
        setIsLogin(true);

        setAuthForm({
          name: "",
          email: authForm.email,
          password: "",
        });
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLeads([]);
    setMessage("");
  };

  // =========================
  // LEADS
  // =========================

  const fetchLeads = async () => {
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch leads");
    }

    setLeads(data);
    setCurrentPage(1);
  } catch (error) {
    setMessage(error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

  const handleLeadChange = (e) => {
    setLeadForm({
      ...leadForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/api/leads/${editingId}`
        : `${API_URL}/api/leads`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leadForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save lead");
      }

      setMessage(
        editingId
          ? "Lead updated successfully!"
          : "Lead added successfully!"
      );

      resetLeadForm();
      fetchLeads();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // =========================
  // EDIT LEAD
  // =========================

  const editLead = (lead) => {
    setEditingId(lead._id);

    setLeadForm({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      serviceInterested: lead.serviceInterested || "",
      status: lead.status || "New",
      followUpDate: lead.followUpDate
        ? new Date(lead.followUpDate).toISOString().split("T")[0]
        : "",
      notes: lead.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE LEAD
  // =========================

  const deleteLead = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete lead");
      }

      setMessage("Lead deleted successfully!");
      fetchLeads();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // =========================
  // RESET FORM
  // =========================

  const resetLeadForm = () => {
    setLeadForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceInterested: "",
      status: "New",
      followUpDate: "",
      notes: "",
    });

    setEditingId(null);
  };

  // =========================
  // COUNTS
  // =========================

  const total = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contacted = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const qualified = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const lost = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  // =========================
  // SEARCH
  // =========================

  const filteredLeads = leads.filter((lead) => {
  const text = search.toLowerCase();

  const matchesSearch =
    lead.name?.toLowerCase().includes(text) ||
    lead.email?.toLowerCase().includes(text) ||
    lead.phone?.includes(text) ||
    lead.company?.toLowerCase().includes(text) ||
    lead.serviceInterested?.toLowerCase().includes(text);

  const matchesStatus =
    statusFilter === "All" ||
    lead.status === statusFilter;

  const matchesDate =
    !dateFilter ||
    (lead.followUpDate &&
      new Date(lead.followUpDate)
        .toISOString()
        .split("T")[0] === dateFilter);

  return (
    matchesSearch &&
    matchesStatus &&
    matchesDate
  );
});

const totalPages = Math.ceil(
  filteredLeads.length / leadsPerPage
);

const startIndex =
  (currentPage - 1) * leadsPerPage;

const paginatedLeads = filteredLeads.slice(
  startIndex,
  startIndex + leadsPerPage
);

  // =========================
  // LOGIN PAGE
  // =========================

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">🦢</div>

          <h1>Swan Leads</h1>

          <p className="subtitle">
            Lead Management System
          </p>

          <div className="auth-tabs">
            <button
              className={isLogin ? "active-tab" : ""}
              onClick={() => {
                setIsLogin(true);
                setMessage("");
              }}
            >
              Login
            </button>

            <button
              className={!isLogin ? "active-tab" : ""}
              onClick={() => {
                setIsLogin(false);
                setMessage("");
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={authForm.name}
                onChange={handleAuthChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={authForm.email}
              onChange={handleAuthChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={authForm.password}
              onChange={handleAuthChange}
              required
            />

            <button type="submit" className="primary-btn">
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          {message && (
            <p className="message">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // =========================
  // MAIN APPLICATION
  // =========================

  return (
    <div className="app-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">🦢</div>

          <div>
            <h2>Swan Leads</h2>
            <span>Lead Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              activePage === "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Dashboard")}
          >
            🏠
            <span>Dashboard</span>
          </button>

          <button
            className={
              activePage === "Leads"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Leads")}
          >
            👥
            <span>Leads</span>
          </button>

          <button
            className={
              activePage === "Analytics"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Analytics")}
          >
            📊
            <span>Analytics</span>
          </button>

          <button
            className={
              activePage === "Settings"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Settings")}
          >
            ⚙️
            <span>Settings</span>
          </button>

        </nav>

        <div className="sidebar-bottom">
          <h3>Turn Leads into Opportunities</h3>

          <p>
            Organize your leads,
            track progress and grow.
          </p>

          <div className="bottom-links">
            Organize&nbsp;&nbsp; Track&nbsp;&nbsp; Grow
          </div>
        </div>

      </aside>

      {/* MAIN AREA */}

      <div className="main-area">

        {/* TOP HEADER */}

        <header className="top-header">

          <div>
            <h1>Swan Leads</h1>

            <h2>Lead Management System</h2>

            <p>
              Manage your leads, track progress and grow your business.
            </p>
          </div>

          <div className="header-actions">

            <button className="icon-button">
              🔔
            </button>

            <div className="profile-circle">
              👤
            </div>

            <button
              onClick={logout}
              className="header-logout"
            >
              ⇥ Logout
            </button>

          </div>

        </header>

        <main className="dashboard-content">

          {/* PAGE TITLE */}

          <div className="page-title">
            <div>
              <h2>{activePage}</h2>

              <p>
                {activePage === "Dashboard"
                  ? "Overview of your lead management activity."
                  : `Manage your ${activePage.toLowerCase()} here.`}
              </p>
            </div>
          </div>

          {/* MESSAGE */}

          {message && (
            <div className="success-message">
              ✓ {message}
            </div>
          )}

          {/* =========================
              STAT CARDS
          ========================= */}

          {(activePage === "Dashboard" ||
            activePage === "Analytics") && (
            <>
              <div className="stats-grid">

                <div className="stat-card purple">
                  <div className="stat-icon">👥</div>

                  <div>
                    <p>Total Leads</p>
                    <h3>{total}</h3>
                    <span>All leads in system</span>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon">📄</div>

                  <div>
                    <p>New</p>
                    <h3>{newLeads}</h3>
                    <span>Recently added leads</span>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">📞</div>

                  <div>
                    <p>Contacted</p>
                    <h3>{contacted}</h3>
                    <span>Leads contacted</span>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">🏆</div>

                  <div>
                    <p>Qualified</p>
                    <h3>{qualified}</h3>
                    <span>Qualified leads</span>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-icon">💰</div>

                  <div>
                    <p>Converted</p>
                    <h3>{converted}</h3>
                    <span>Converted leads</span>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">❌</div>

                  <div>
                    <p>Lost</p>
                    <h3>{lost}</h3>
                    <span>Lost leads</span>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* =========================
              ADD / EDIT LEAD
          ========================= */}

          {(activePage === "Dashboard" ||
            activePage === "Leads") && (
            <>
              <div className="middle-grid">

                {/* ADD LEAD */}

                <section className="panel">

                  <div className="panel-title">
                    <div className="title-icon">＋</div>

                    <h2>
                      {editingId
                        ? "Edit Lead"
                        : "Add New Lead"}
                    </h2>
                  </div>

                  <form
                    className="lead-form"
                    onSubmit={handleLeadSubmit}
                  >

                    {/* NAME */}

                    <div className="form-field">
                      <label>Lead Name</label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter lead name"
                        value={leadForm.name}
                        onChange={handleLeadChange}
                        required
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="form-field">
                      <label>Email</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={leadForm.email}
                        onChange={handleLeadChange}
                        required
                      />
                    </div>

                    {/* PHONE */}

                    <div className="form-field">
                      <label>Phone</label>

                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={leadForm.phone}
                        onChange={handleLeadChange}
                        required
                      />
                    </div>

                    {/* COMPANY */}

                    <div className="form-field">
                      <label>Company</label>

                      <input
                        type="text"
                        name="company"
                        placeholder="Enter company name"
                        value={leadForm.company}
                        onChange={handleLeadChange}
                      />
                    </div>

                    {/* SERVICE */}

                    <div className="form-field">
                      <label>Service Interested</label>

                      <input
                        type="text"
                        name="serviceInterested"
                        placeholder="Enter service interested"
                        value={leadForm.serviceInterested}
                        onChange={handleLeadChange}
                        required
                      />
                    </div>

                    {/* FOLLOW-UP DATE */}

                    <div className="form-field">
                      <label>Follow-up Date</label>

                      <input
                        type="date"
                        name="followUpDate"
                        value={leadForm.followUpDate}
                        onChange={handleLeadChange}
                      />
                    </div>

                    {/* STATUS */}

                    <div className="form-field">
                      <label>Status</label>

                      <select
                        name="status"
                        value={leadForm.status}
                        onChange={handleLeadChange}
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Qualified">
                          Qualified
                        </option>

                        <option value="Converted">
                          Converted
                        </option>

                        <option value="Lost">
                          Lost
                        </option>
                      </select>
                    </div>

                    {/* NOTES */}

                    <div className="form-field">
                      <label>Notes</label>

                      <textarea
                        name="notes"
                        placeholder="Enter notes about the lead"
                        value={leadForm.notes}
                        onChange={handleLeadChange}
                        rows="4"
                      ></textarea>
                    </div>

                    {/* BUTTONS */}

                    <div className="form-buttons">

                      <button
                        type="submit"
                        className="add-lead-btn"
                      >
                        ＋{" "}
                        {editingId
                          ? "Update Lead"
                          : "Add Lead"}
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={resetLeadForm}
                        >
                          Cancel
                        </button>
                      )}

                    </div>

                  </form>

                </section>

                {/* OVERVIEW */}

                <section className="panel overview-panel">

                  <div className="panel-title overview-title">

                    <div>
                      <h2>📊 Leads Overview</h2>
                    </div>

                    <select className="time-select">
                      <option>All Time</option>
                    </select>

                  </div>

                  <div className="chart-area">

                    <div
                      className="donut"
                      style={{
                        background: `conic-gradient(
                          #3b82f6 0% ${
                            total
                              ? (newLeads / total) * 100
                              : 0
                          }%,

                          #f97316 ${
                            total
                              ? (newLeads / total) * 100
                              : 0
                          }% ${
                            total
                              ? ((newLeads + contacted) /
                                  total) *
                                100
                              : 0
                          }%,

                          #10b981 ${
                            total
                              ? ((newLeads + contacted) /
                                  total) *
                                100
                              : 0
                          }% 100%
                        )`,
                      }}
                    >

                      <div className="donut-inner">
                        <strong>{total}</strong>
                        <span>Total Leads</span>
                      </div>

                    </div>

                    <div className="chart-legend">

                      <div>
                        <span className="legend-dot blue-dot"></span>
                        New
                        <b>{newLeads}</b>
                      </div>

                      <div>
                        <span className="legend-dot orange-dot"></span>
                        Contacted
                        <b>{contacted}</b>
                      </div>

                      <div>
                        <span className="legend-dot green-dot"></span>
                        Qualified
                        <b>{qualified}</b>
                      </div>

                    </div>

                  </div>

                </section>

              </div>
            </>
          )}

          {/* =========================
              ALL LEADS
          ========================= */}

          {(activePage === "Dashboard" ||
            activePage === "Leads") && (
            <>
              <section className="panel leads-panel">

                <div className="table-header">

                  <div className="panel-title">
                    <div className="title-icon list-icon">
                      ☷
                    </div>

                    <h2>All Leads</h2>
                  </div>

                 <div className="table-tools">

  <div className="search-box">
    🔍

    <input
      type="text"
      placeholder="Search by name, email, phone, company..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>

  <select
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="filter-select"
  >
    <option value="All">All Status</option>
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Qualified">Qualified</option>
    <option value="Converted">Converted</option>
    <option value="Lost">Lost</option>
  </select>

  <input
    type="date"
    value={dateFilter}
    onChange={(e) => {
      setDateFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="filter-date"
  />

  <button
  onClick={fetchLeads}
  className="refresh-btn"
  disabled={loading}
>
  {loading ? "⟳ Refreshing..." : "⟳ Refresh"}
</button>

</div>

                </div>

                {filteredLeads.length === 0 ? (

                  <div className="empty-state">
                    <div>📭</div>

                    <h3>No leads found</h3>

                    <p>
                      Add a new lead to get started.
                    </p>
                  </div>

                ) : (

                  <>
                    <div className="table-container">

                    <table>

                      <thead>
  <tr>
    <th>#</th>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Company</th>
    <th>Service</th>
    <th>Follow-up</th>
    <th>Created Date</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>

                      <tbody>

                        {paginatedLeads.map(
                         (lead, index) => (

                            <tr key={lead._id}>

                              <td>
                                {index + 1}
                              </td>

                              <td className="lead-name">
                                {lead.name}
                              </td>

                              <td>
                                {lead.email}
                              </td>

                              <td>
                                {lead.phone}
                              </td>

                              <td>
                                {lead.company || "-"}
                              </td>

                              <td>
                                {lead.serviceInterested ||
                                  "-"}
                              </td>

                              <td>
  {lead.followUpDate
    ? new Date(
        lead.followUpDate
      ).toLocaleDateString()
    : "-"}
</td>

<td>
  {lead.createdAt
    ? new Date(
        lead.createdAt
      ).toLocaleDateString()
    : "-"}
</td>

<td>
  <span
    className={`status-badge ${lead.status
                                    .toLowerCase()
                                    .replace(
                                      " ",
                                      "-"
                                    )}`}
                                >
                                  {lead.status}
                                </span>

                              </td>

                              <td>

                                <div className="actions">

                                  <button
                                    className="edit-btn"
                                    onClick={() =>
                                      editLead(lead)
                                    }
                                  >
                                    ✎ Edit
                                  </button>

                                  <button
                                    className="delete-btn"
                                    onClick={() =>
                                      deleteLead(
                                        lead._id
                                      )
                                    }
                                  >
                                    🗑 Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">

                      <button
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.max(page - 1, 1)
                          )
                        }
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>

                      <span>
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(page + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>

                    </div>
                  )}

                  </>

                )}

              </section>
            </>
          )}

          {/* =========================
              ANALYTICS
          ========================= */}

          {activePage === "Analytics" && (
            <section className="panel analytics-page">

              <div className="panel-title">
                <div className="title-icon">
                  📊
                </div>

                <h2>Lead Analytics</h2>
              </div>

              <div className="stats-grid">

                <div className="stat-card purple">
                  <div className="stat-icon">
                    🎯
                  </div>

                  <div>
                    <p>Conversion Rate</p>

                    <h3>
                      {total
                        ? Math.round(
                            (converted / total) *
                              100
                          )
                        : 0}
                      %
                    </h3>

                    <span>
                      Converted leads
                    </span>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">
                    🏆
                  </div>

                  <div>
                    <p>Qualified Rate</p>

                    <h3>
                      {total
                        ? Math.round(
                            (qualified / total) *
                              100
                          )
                        : 0}
                      %
                    </h3>

                    <span>
                      Qualified leads
                    </span>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">
                    📞
                  </div>

                  <div>
                    <p>Contact Rate</p>

                    <h3>
                      {total
                        ? Math.round(
                            (contacted / total) *
                              100
                          )
                        : 0}
                      %
                    </h3>

                    <span>
                      Contacted leads
                    </span>
                  </div>
                </div>

              </div>

              <div
                className="chart-legend"
                style={{
                  marginTop: "24px",
                  gap: "18px",
                }}
              >

                <div>
                  <span className="legend-dot blue-dot"></span>
                  New
                  <b>{newLeads}</b>
                </div>

                <div>
                  <span className="legend-dot orange-dot"></span>
                  Contacted
                  <b>{contacted}</b>
                </div>

                <div>
                  <span className="legend-dot green-dot"></span>
                  Qualified
                  <b>{qualified}</b>
                </div>

                <div>
                  <span
                    className="legend-dot"
                    style={{
                      background: "#8b5cf6",
                    }}
                  ></span>
                  Converted
                  <b>{converted}</b>
                </div>

                <div>
                  <span
                    className="legend-dot"
                    style={{
                      background: "#ef4444",
                    }}
                  ></span>
                  Lost
                  <b>{lost}</b>
                </div>

              </div>

            </section>
          )}

          {/* =========================
              SETTINGS
          ========================= */}

          {activePage === "Settings" && (
            <section className="panel settings-page">

              <div className="panel-title">

                <div className="title-icon">
                  ⚙️
                </div>

                <h2>Settings</h2>

              </div>

              <div className="lead-form">

                <div className="form-field">
                  <label>
                    Application Name
                  </label>

                  <input
                    type="text"
                    value="Swan Leads"
                    readOnly
                  />
                </div>

                <div className="form-field">
                  <label>System</label>

                  <input
                    type="text"
                    value="Lead Management System"
                    readOnly
                  />
                </div>

                <div className="form-field">
                  <label>
                    Account Status
                  </label>

                  <input
                    type="text"
                    value="Logged in"
                    readOnly
                  />
                </div>

                <button
                  className="add-lead-btn"
                  type="button"
                  onClick={logout}
                >
                  ⇥ Logout from Account
                </button>

              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;