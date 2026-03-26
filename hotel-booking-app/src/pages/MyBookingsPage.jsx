import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function MyBookingsPage({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms(*)')
      .eq('user_id', user.id)
      .order('check_in_date', { ascending: true })

    if (error) setError(error.message)
    else setBookings(data)
    setLoading(false)
  }

  async function handleCancel(bookingId) {
    setCancellingId(bookingId)
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', bookingId)

    if (error) {
      setError(error.message)
    } else {
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      )
    }
    setCancellingId(null)
  }

  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  return (
    <>
      <div className="page">
        <h1 style={styles.heading}>My Bookings</h1>

        {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}

        {loading ? (
          <p style={styles.hint}>Loading…</p>
        ) : (
          <>
            {/* Confirmed */}
            <section style={styles.section}>
              <p className="label">Confirmed ({confirmed.length})</p>
              {confirmed.length === 0 && (
                <p style={styles.hint}>No upcoming bookings.</p>
              )}
              {confirmed.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={handleCancel}
                  cancelling={cancellingId === b.id}
                />
              ))}
            </section>

            {/* Cancelled */}
            {cancelled.length > 0 && (
              <section style={styles.section}>
                <div className="divider">Cancelled</div>
                {cancelled.map(b => (
                  <BookingCard key={b.id} booking={b} cancelled />
                ))}
              </section>
            )}
          </>
        )}
      </div>
      <Navbar />
    </>
  )
}

function BookingCard({ booking, onCancel, cancelling, cancelled }) {
  const { rooms: room, check_in_date, check_out_date } = booking

  const nights = Math.round(
    (new Date(check_out_date) - new Date(check_in_date)) / 86400000
  )
  const total = nights * (room?.price_per_night ?? 0)
  const isPast = new Date(check_out_date) < new Date()

  return (
    <div className="card" style={{ ...styles.bookingCard, opacity: cancelled ? 0.5 : 1 }}>
      <div style={styles.bookingTop}>
        <div>
          <h3 style={styles.roomName}>{room?.name ?? 'Room'}</h3>
          <span className="badge badge-accent" style={{ marginTop: 4 }}>
            {room?.room_type}
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
            onClick={() => onCancel(booking.id)}
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
    fontSize: 36,
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
