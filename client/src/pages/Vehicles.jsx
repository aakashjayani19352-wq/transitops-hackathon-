import { useState, useEffect } from 'react';
import api from '../api/axios';

const EMPTY_FORM = {
  registrationNumber: '',
  name: '',
  type: '',
  maxLoadCapacity: '',
  odometer: '',
  acquisitionCost: '',
  status: 'Available',
};

const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Motorcycle', 'Car', 'Other'];
const STATUSES = ['Available', 'Active', 'Maintenance', 'Inactive'];

function statusBadge(s = '') {
  const map = { available: 'badge-available', active: 'badge-active', maintenance: 'badge-maintenance', inactive: 'badge-inactive' };
  return `badge ${map[s.toLowerCase()] || 'badge-draft'}`;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function fetchVehicles() {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(Array.isArray(data) ? data : data.vehicles || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchVehicles(); }, []);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/vehicles', form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Vehicles</h1>
          <p>Manage your fleet vehicles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {showForm && (
        <div className="form-panel">
          <h3>Add New Vehicle</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Registration Number</label>
                <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="e.g. KA-01-AB-1234" required />
              </div>
              <div className="form-group">
                <label>Vehicle Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Tata Ace" required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Select type</option>
                  {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Max Load Capacity (kg)</label>
                <input name="maxLoadCapacity" type="number" value={form.maxLoadCapacity} onChange={handleChange} placeholder="e.g. 5000" />
              </div>
              <div className="form-group">
                <label>Odometer (km)</label>
                <input name="odometer" type="number" value={form.odometer} onChange={handleChange} placeholder="e.g. 12000" />
              </div>
              <div className="form-group">
                <label>Acquisition Cost (₹)</label>
                <input name="acquisitionCost" type="number" value={form.acquisitionCost} onChange={handleChange} placeholder="e.g. 800000" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading…</div>
        ) : vehicles.length === 0 ? (
          <div className="empty">No vehicles found. Add one above.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Registration</th>
                <th>Name</th>
                <th>Type</th>
                <th>Max Load</th>
                <th>Odometer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v._id || i}>
                  <td><strong>{v.registrationNumber}</strong></td>
                  <td>{v.name}</td>
                  <td>{v.type}</td>
                  <td>{v.maxLoadCapacity ? `${v.maxLoadCapacity} kg` : '—'}</td>
                  <td>{v.odometer ? `${v.odometer} km` : '—'}</td>
                  <td><span className={statusBadge(v.status)}>{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
