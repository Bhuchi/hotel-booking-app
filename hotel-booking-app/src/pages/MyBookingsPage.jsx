import { useState, useEffect } from 'react'
import { getUserBookings, cancelBooking } from '../lib/services'
import Navbar from '../components/Navbar'
import RoomDetailModal from '../components/RoomDetailModal'

export default function MyBookingsPage({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [inspectedRoom, setInspectedRoom] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    try {
      const data = await getUserBookings(user.id)
      setBookings(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleCancel(bookingId) {
    setCancellingId(bookingId)
    try {
      await cancelBooking(bookingId)
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      )
    } catch (err) {
      setError(err.message)
    }
    setCancellingId(null)
  }

  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  return (
    <>
      {inspectedRoom && (
        <RoomDetailModal
          room={inspectedRoom}
          available={false}
          onBook={() => {}}
          booking={false}
          onClose={() => setInspectedRoom(null)}
        />
      )}
      <div className="page">
        <h1 style={styles.heading}>My Bookings</h1>

        {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}

        {loading ? (
          <p style={styles.hint}>Loading…</p>
        ) : (
          <>
            {/* Confirmed */}
            <section style={styles.section}>
              <p className="label" style={{ marginBottom: 16 }}>Confirmed ({confirmed.length})</p>
              {confirmed.length === 0 && (
                <p style={styles.hint}>No upcoming bookings.</p>
              )}
              <div className="booking-grid">
                {confirmed.map(b => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCancel={handleCancel}
                    cancelling={cancellingId === b.id}
                    onInspect={setInspectedRoom}
                  />
                ))}
              </div>
            </section>

            {/* Cancelled */}
            {cancelled.length > 0 && (
              <section style={styles.section}>
                <div className="divider">Cancelled</div>
                <div className="booking-grid">
                  {cancelled.map(b => (
                    <BookingCard key={b.id} booking={b} cancelled onInspect={setInspectedRoom} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <Navbar />
    </>
  )
}

function BookingCard({ booking, onCancel, cancelling, cancelled, onInspect }) {
  const { rooms: room, check_in_date, check_out_date } = booking

  // Support different possible column names from the database
  const roomName = room?.name ?? room?.room_name ?? room?.title ?? 'Room'
  const roomType = room?.room_type ?? room?.type ?? ''

  const nights = Math.round(
    (new Date(check_out_date) - new Date(check_in_date)) / 86400000
  )
  const total = nights * (room?.price_per_night ?? 0)
  const isPast = new Date(check_out_date) < new Date()

  return (
    <div className="card" style={{ ...styles.bookingCard, opacity: cancelled ? 0.5 : 1, cursor: 'pointer' }} onClick={() => onInspect(room)}>
      <div style={styles.bookingTop}>
        <div>
          <h3 style={styles.roomName}>{roomName}</h3>
          <span className="badge badge-accent" style={{ marginTop: 4 }}>
            {roomType}
          </span>
        </div>
        {cancelled
          ? <span className="badge badge-danger">Cancelled</span>
          : isPast
            ? <span className="badge badge-muted">Completed</span>
            : <span className="badge badge-success">Confirmed</span>
        }
      </div>

      <div style={styles.dates}>
        <div>
          <p className="label">Check-in</p>
          <p style={styles.dateValue}>{formatDate(check_in_date)}</p>
        </div>
        <div style={styles.arrow}>→</div>
        <div>
          <p className="label">Check-out</p>
          <p style={styles.dateValue}>{formatDate(check_out_date)}</p>
        </div>
      </div>

      <div style={styles.bookingFooter}>
        <p style={styles.total}>
          <span style={styles.totalAmount}>${total}</span>
          <span style={styles.nightsLabel}> · {nights} night{nights !== 1 ? 's' : ''}</span>
        </p>
        {!cancelled && !isPast && (
          <button
            className="btn btn-danger"
            style={styles.cancelBtn}
            onClick={e => { e.stopPropagation(); onCancel(booking.id) }}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling…' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

const styles = {
  heading: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 40,
    marginBottom: 20,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 8,
  },
  hint: {
    color: 'var(--text-muted)',
    fontSize: 14,
    padding: '24px 0',
    textAlign: 'center',
  },
  bookingCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'opacity 0.2s',
  },
  bookingTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomName: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 20,
    letterSpacing: '0.04em',
  },
  dates: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--bg)',
    borderRadius: 10,
    padding: '12px 14px',
  },
  arrow: {
    color: 'var(--text-muted)',
    flex: 1,
    textAlign: 'center',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 2,
  },
  bookingFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 2,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--accent)',
  },
  nightsLabel: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  cancelBtn: {
    width: 'auto',
    padding: '8px 16px',
    fontSize: 13,
  },
}
