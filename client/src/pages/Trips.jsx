import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const EMPTY_FORM = {
  source: "",
  destination: "",
  vehicle: "",
  driver: "",
  cargoWeight: "",
  plannedDistance: "",
};

function statusBadge(s = "") {
  const map = {
    draft: "badge-draft",
    dispatched: "badge-dispatched",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
  };
  return `badge ${map[s.toLowerCase()] || "badge-draft"}`;
}

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  // Complete trip state
  const [completeModal, setCompleteModal] = useState(null); // tripId
  const [completeForm, setCompleteForm] = useState({
    actualDistance: "",
    fuelConsumed: "",
  });

  const fetchTrips = useCallback(async () => {
    try {
      const { data } = await api.get("/trips");
      setTrips(Array.isArray(data) ? data : data.trips || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load trips.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
    api
      .get("/vehicles")
      .then(({ data }) =>
        setVehicles(Array.isArray(data) ? data : data.vehicles || []),
      );
    api
      .get("/drivers")
      .then(({ data }) =>
        setDrivers(Array.isArray(data) ? data : data.drivers || []),
      );
  }, [fetchTrips]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreateTrip(e) {
    e.preventDefault();
    setSubmitting(true);
    setActionError("");
    try {
      await api.post("/trips", form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchTrips();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to create trip.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDispatch(id) {
    setActionError("");
    try {
      await api.put(`/trips/${id}/dispatch`);
      await fetchTrips();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to dispatch trip.");
    }
  }

  async function handleCancel(id) {
    setActionError("");
    try {
      await api.put(`/trips/${id}/cancel`);
      await fetchTrips();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to cancel trip.");
    }
  }

  async function handleComplete(e) {
    e.preventDefault();
    setActionError("");
    try {
      await api.put(`/trips/${completeModal}/complete`, completeForm);
      setCompleteModal(null);
      setCompleteForm({ actualDistance: "", fuelConsumed: "" });
      await fetchTrips();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to complete trip.");
    }
  }

  function vehicleName(v) {
    if (!v) return "—";
    if (typeof v === "object")
      return `${v.name || ""} (${v.registrationNumber || ""})`;
    const found = vehicles.find((x) => x._id === v);
    return found ? `${found.name} (${found.registrationNumber})` : v;
  }

  function driverName(d) {
    if (!d) return "—";
    if (typeof d === "object") return d.name;
    const found = drivers.find((x) => x._id === d);
    return found ? found.name : d;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Trips</h1>
          <p>Manage trip assignments and operations</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "✕ Cancel" : "+ Create Trip"}
        </button>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {actionError && <div className="alert alert-error">⚠️ {actionError}</div>}

      {showForm && (
        <div className="form-panel">
          <h3>Create New Trip</h3>
          <form onSubmit={handleCreateTrip}>
            <div className="form-grid">
              <div className="form-group">
                <label>Source</label>
                <input
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  required
                />
              </div>
              <div className="form-group">
                <label>Vehicle</label>
                <select
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Driver</label>
                <select
                  name="driver"
                  value={form.driver}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select driver</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Cargo Weight (kg)</label>
                <input
                  name="cargoWeight"
                  type="number"
                  value={form.cargoWeight}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="form-group">
                <label>Planned Distance (km)</label>
                <input
                  name="plannedDistance"
                  type="number"
                  value={form.plannedDistance}
                  onChange={handleChange}
                  placeholder="e.g. 350"
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Creating…" : "Create Trip"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complete trip inline form */}
      {completeModal && (
        <div
          className="form-panel"
          style={{ borderColor: "rgba(34,197,94,0.3)" }}
        >
          <h3>Complete Trip</h3>
          <form onSubmit={handleComplete}>
            <div className="form-grid">
              <div className="form-group">
                <label>Actual Distance (km)</label>
                <input
                  type="number"
                  value={completeForm.actualDistance}
                  onChange={(e) =>
                    setCompleteForm((f) => ({
                      ...f,
                      actualDistance: e.target.value,
                    }))
                  }
                  placeholder="e.g. 360"
                  required
                />
              </div>
              <div className="form-group">
                <label>Fuel Consumed (L)</label>
                <input
                  type="number"
                  value={completeForm.fuelConsumed}
                  onChange={(e) =>
                    setCompleteForm((f) => ({
                      ...f,
                      fuelConsumed: e.target.value,
                    }))
                  }
                  placeholder="e.g. 45"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Confirm Complete
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setCompleteModal(null)}
              >
                Cancel
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
        ) : trips.length === 0 ? (
          <div className="empty">No trips found. Create one above.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Source → Destination</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo (kg)</th>
                <th>Planned Dist.</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t, i) => (
                <tr key={t._id || i}>
                  <td>
                    <strong>{t.source}</strong> → {t.destination}
                  </td>
                  <td>{vehicleName(t.vehicle)}</td>
                  <td>{driverName(t.driver)}</td>
                  <td>{t.cargoWeight ?? "—"}</td>
                  <td>{t.plannedDistance ? `${t.plannedDistance} km` : "—"}</td>
                  <td>
                    <span className={statusBadge(t.status)}>{t.status}</span>
                  </td>
                  <td>
                    <div className="action-group">
                      {t.status?.toLowerCase() === "draft" && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleDispatch(t._id)}
                        >
                          🚀 Dispatch
                        </button>
                      )}
                      {t.status?.toLowerCase() === "dispatched" && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              setCompleteModal(t._id);
                              setActionError("");
                            }}
                          >
                            ✅ Complete
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancel(t._id)}
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}
                      {(t.status?.toLowerCase() === "completed" ||
                        t.status?.toLowerCase() === "cancelled") && (
                        <span
                          style={{ color: "var(--text-dim)", fontSize: 12 }}
                        >
                          No actions
                        </span>
                      )}
                    </div>
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
