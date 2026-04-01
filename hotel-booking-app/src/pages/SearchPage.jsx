import { useState, useEffect } from 'react'
import { getRooms, getBookedRoomIds, createBooking } from '../lib/services'
import RoomCard from '../components/RoomCard'
import RoomDetailModal from '../components/RoomDetailModal'
import Navbar from '../components/Navbar'

const ROOM_TYPES = [
  { label: 'All',    value: 'All' },
  { label: 'Single', value: 'single' },
  { label: 'Double', value: 'double' },
  { label: 'Suite',  value: 'suite' },
  { label: 'Deluxe', value: 'deluxe' },
]

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
  const [bookingId, setBookingId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [inspectRoom, setInspectRoom] = useState(null)

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    setLoading(true)
    setError('')

    try {
      const [roomsData, bookedIds] = await Promise.all([
        getRooms(roomType),
        getBookedRoomIds(checkIn, checkOut),
      ])
      setRooms(roomsData)
      setUnavailableIds(bookedIds)
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  async function handleBook(room) {
    setBookingId(room.id)
    setError('')
    setSuccessMsg('')

    const { error } = await createBooking(user.id, room.id, checkIn, checkOut)

    if (error) {
      setError(error.message)
    } else {
      setSuccessMsg(`${room.name} booked from ${checkIn} to ${checkOut}!`)
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
          <div style={styles.filterRow}>
            <div style={styles.dateGroup}>
              <div>
                <label className="label">Check-in</label>
                <input
                  className="input"
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={e => setCheckIn(e.target.value)}
                />
              </div>
              <div>
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

            <div style={styles.typeGroup}>
              <label className="label">Room Type</label>
              <div style={styles.typeRow}>
                {ROOM_TYPES.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn ${roomType === value ? 'btn-primary' : 'btn-ghost'}`}
                    style={styles.typeBtn}
                    onClick={() => setRoomType(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.searchBtnWrap}>
              <label className="label" style={{ visibility: 'hidden' }}>Search</label>
              <button className="btn btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
          </div>
        </form>

        {error && <p className="error-msg" style={{ marginTop: 16 }}>{error}</p>}
        {successMsg && <p style={styles.successMsg}>{successMsg}</p>}

        <div className="room-grid" style={{ marginTop: 24 }}>
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
              onInspect={setInspectRoom}
            />
          ))}
        </div>
      </div>
      <Navbar />

      {inspectRoom && (
        <RoomDetailModal
          room={inspectRoom}
          available={!unavailableIds.has(inspectRoom.id)}
          onBook={handleBook}
          booking={bookingId === inspectRoom.id}
          onClose={() => setInspectRoom(null)}
        />
      )}
    </>
  )
}

const styles = {
  heading: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 40,
    marginBottom: 20,
  },
  form: {
    marginBottom: 8,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 20,
    flexWrap: 'wrap',
  },
  dateGroup: {
    display: 'flex',
    gap: 12,
    flex: '0 0 auto',
  },
  typeGroup: {
    flex: 1,
    minWidth: 200,
  },
  typeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBtn: {
    width: 'auto',
    padding: '8px 16px',
    fontSize: 13,
  },
  searchBtnWrap: {
    flex: '0 0 auto',
  },
  hint: {
    color: 'var(--text-muted)',
    fontSize: 14,
    textAlign: 'center',
    padding: '48px 0',
    gridColumn: '1 / -1',
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
