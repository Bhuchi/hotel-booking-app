import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import RoomCard from '../components/RoomCard'
import Navbar from '../components/Navbar'

const ROOM_TYPES = ['All', 'Single', 'Double', 'Suite', 'Deluxe']

export default function SearchPage({ user }) {
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [roomType, setRoomType] = useState('All')
  const [rooms, setRooms] = useState([])
  const [unavailableIds, setUnavailableIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState(null) // room id currently being booked
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    setLoading(true)
    setError('')

    let query = supabase.from('rooms').select('*').eq('is_active', true)
    if (roomType !== 'All') query = query.eq('room_type', roomType)

    const { data, error } = await query
    if (error) { setError(error.message); setLoading(false); return }
    setRooms(data)

    // Fetch unavailable room IDs for the selected dates
    const { data: booked } = await supabase
      .from('bookings')
      .select('room_id')
      .eq('status', 'confirmed')
      .lt('check_in_date', checkOut)
      .gt('check_out_date', checkIn)

    setUnavailableIds(new Set((booked || []).map(b => b.room_id)))
    setLoading(false)
  }

  async function handleBook(room) {
    setBookingId(room.id)
    setError('')
    setSuccessMsg('')

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      room_id: room.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      status: 'confirmed',
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccessMsg(`${room.name} booked from ${checkIn} to ${checkOut}!`)
      // Mark room as unavailable immediately
      setUnavailableIds(prev => new Set([...prev, room.id]))
    }
    setBookingId(null)
  }

  function handleSearch(e) {
    e.preventDefault()
    if (checkIn >= checkOut) { setError('Check-out must be after check-in.'); return }
    fetchRooms()
  }

  return (
    <>
      <div className="page">
        <h1 style={styles.heading}>Find a Room</h1>

        <form onSubmit={handleSearch} style={styles.form} className="card">
          <div style={styles.dateRow}>
            <div style={{ flex: 1 }}>
              <label className="label">Check-in</label>
              <input
                className="input"
                type="date"
                value={checkIn}
                min={today}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Check-out</label>
              <input
                className="input"
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Room Type</label>
            <div style={styles.typeRow}>
              {ROOM_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`btn ${roomType === type ? 'btn-primary' : 'btn-ghost'}`}
                  style={styles.typeBtn}
                  onClick={() => setRoomType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        {error && <p className="error-msg" style={{ marginTop: 16 }}>{error}</p>}
        {successMsg && <p style={styles.successMsg}>{successMsg}</p>}

        <div style={styles.list}>
          {loading && <p style={styles.hint}>Loading rooms…</p>}
          {!loading && rooms.length === 0 && (
            <p style={styles.hint}>No rooms found. Try different dates or type.</p>
          )}
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              available={!unavailableIds.has(room.id)}
              onBook={handleBook}
              booking={bookingId === room.id}
            />
          ))}
        </div>
      </div>
      <Navbar />
    </>
  )
}

const styles = {
  heading: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 36,
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 8,
  },
  dateRow: {
    display: 'flex',
    gap: 12,
  },
  typeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBtn: {
    width: 'auto',
    padding: '8px 14px',
    fontSize: 13,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  },
  hint: {
    color: 'var(--text-muted)',
    fontSize: 14,
    textAlign: 'center',
    padding: '32px 0',
  },
  successMsg: {
    background: 'rgba(0, 230, 118, 0.12)',
    border: '1px solid var(--success)',
    borderRadius: 10,
    color: 'var(--success)',
    fontSize: 14,
    padding: '10px 14px',
    marginTop: 16,
  },
}
