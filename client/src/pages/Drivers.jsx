import { useState, useEffect } from "react";
import api from "../api/axios";

const EMPTY_FORM = {
  name: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiryDate: "",
  contactNumber: "",
  safetyScore: "",
  status: "Available",
};

const CATEGORIES = ["LMV", "HMV", "HPMV", "TRANS", "PSV", "Other"];
const STATUSES = ["Available", "On Duty", "Off Duty", "Inactive"];

function statusBadge(s = "") {
  const map = {
    available: "badge-available",
    "on duty": "badge-active",
    "off duty": "badge-offduty",
    inactive: "badge-inactive",
  };
  return `badge ${map[s.toLowerCase()] || "badge-draft"}`;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function fetchDrivers() {
    try {
      const { data } = await api.get("/drivers");
      setDrivers(Array.isArray(data) ? data : data.drivers || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/drivers", form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add driver.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Drivers</h1>
          <p>Manage your fleet drivers</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "✕ Cancel" : "+ Add Driver"}
        </button>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {showForm && (
        <div className="form-panel">
          <h3>Add New Driver</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g. KA0119801234567"
                  required
                />
              </div>
              <div className="form-group">
                <label>License Category</label>
                <select
                  name="licenseCategory"
                  value={form.licenseCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>License Expiry Date</label>
                <input
                  name="licenseExpiryDate"
                  type="date"
                  value={form.licenseExpiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
              <div className="form-group">
                <label>Safety Score (0–100)</label>
                <input
                  name="safetyScore"
                  type="number"
                  min="0"
                  max="100"
                  value={form.safetyScore}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Adding…" : "Add Driver"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div> Loading…
          </div>
        ) : drivers.length === 0 ? (
          <div className="empty">No drivers found. Add one above.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License Number</th>
                <th>Category</th>
                <th>Expiry Date</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => (
                <tr key={d._id || i}>
                  <td>
                    <strong>{d.name}</strong>
                  </td>
                  <td>{d.licenseNumber}</td>
                  <td>{d.licenseCategory}</td>
                  <td>
                    {d.licenseExpiryDate
                      ? new Date(d.licenseExpiryDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>{d.contactNumber}</td>
                  <td>
                    {d.safetyScore != null ? (
                      <span
                        style={{
                          color:
                            d.safetyScore >= 80
                              ? "var(--success)"
                              : d.safetyScore >= 60
                                ? "var(--warning)"
                                : "var(--danger)",
                        }}
                      >
                        {d.safetyScore}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span className={statusBadge(d.status)}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
