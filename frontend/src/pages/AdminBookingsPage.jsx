import { useEffect, useState } from "react";
import Shell from "../components/Shell";
import { api } from "../services/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected, cancelled
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: "", adminNotes: "" });

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const data = await api.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getFilteredBookings() {
    if (filter === "all") return bookings;
    return bookings.filter(booking => booking.status?.toLowerCase() === filter);
  }

  function openStatusUpdate(booking) {
    setUpdatingBooking(booking);
    setUpdateForm({ status: "", adminNotes: "" });
  }

  function closeStatusUpdate() {
    setUpdatingBooking(null);
    setUpdateForm({ status: "", adminNotes: "" });
  }

  async function submitStatusUpdate(event) {
    event.preventDefault();
    if (!updatingBooking) return;

    try {
      await api.updateBookingStatus(updatingBooking.id, updateForm);
      await loadBookings();
      closeStatusUpdate();
    } catch (err) {
      setError(err.message);
    }
  }

  function getStatusOptions(currentStatus) {
    if (currentStatus === "PENDING") {
      return [
        { value: "APPROVED", label: "Approve" },
        { value: "REJECTED", label: "Reject" }
      ];
    } else if (currentStatus === "APPROVED") {
      return [
        { value: "CANCELLED", label: "Cancel" }
      ];
    }
    return [];
  }

  return (
    <Shell title="Booking Management">
      <section className="table-card">
        <div className="table-header">
          <div>
            <p className="eyebrow">Admin Panel</p>
            <h3>Manage all booking requests.</h3>
          </div>
          <button type="button" className="secondary-button toolbar-button" onClick={loadBookings}>
            Refresh
          </button>
        </div>

        <div className="filter-bar">
          <label>
            Filter by status:
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        {error ? <p className="error">{error}</p> : null}

        {updatingBooking ? (
          <section className="table-card">
            <div className="table-header">
              <div>
                <p className="eyebrow">Update Status</p>
                <h3>Booking for Resource: {updatingBooking.resourceId}</h3>
              </div>
              <button type="button" className="secondary-button" onClick={closeStatusUpdate}>
                Close
              </button>
            </div>

            <form className="filter-grid" onSubmit={submitStatusUpdate}>
              <label>
                New Status
                <select
                  name="status"
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="">Select status</option>
                  {getStatusOptions(updatingBooking.status).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-full">
                Admin Notes (optional)
                <textarea
                  name="adminNotes"
                  value={updateForm.adminNotes}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                  placeholder="Add notes for the user..."
                />
              </label>
              <div className="filter-actions">
                <button type="submit">Update Status</button>
                <button type="button" className="secondary-button" onClick={closeStatusUpdate}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {loading ? (
          <div className="panel">Loading bookings...</div>
        ) : getFilteredBookings().length === 0 ? (
          <div className="panel">No bookings found for the selected filter.</div>
        ) : (
          <div className="booking-list">
            {getFilteredBookings().map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div className="booking-header">
                  <div>
                    <p className="eyebrow">Booking Request</p>
                    <h4>Resource: {booking.resourceId}</h4>
                  </div>
                  <span className={`status-pill ${booking.status?.toLowerCase() || "pending"}`}>
                    {booking.status || "PENDING"}
                  </span>
                </div>
                <div className="booking-details">
                  <div>
                    <strong>Purpose:</strong>
                    <span>{booking.purpose}</span>
                  </div>
                  <div>
                    <strong>Attendees:</strong>
                    <span>{booking.attendees}</span>
                  </div>
                  <div>
                    <strong>Start:</strong>
                    <span>{new Date(booking.startTime).toLocaleString()}</span>
                  </div>
                  <div>
                    <strong>End:</strong>
                    <span>{new Date(booking.endTime).toLocaleString()}</span>
                  </div>
                  <div>
                    <strong>Requested:</strong>
                    <span>{new Date(booking.createdAt).toLocaleString()}</span>
                  </div>
                  {booking.adminNotes ? (
                    <div>
                      <strong>Admin Notes:</strong>
                      <span>{booking.adminNotes}</span>
                    </div>
                  ) : null}
                </div>
                <div className="booking-actions">
                  {getStatusOptions(booking.status).length > 0 ? (
                    <button type="button" onClick={() => openStatusUpdate(booking)}>
                      Update Status
                    </button>
                  ) : (
                    <span className="status-note">No actions available</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}
