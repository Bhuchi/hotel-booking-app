import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('rooms')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setRooms(data)
      })
  }, [])

  if (error) return <p style={{ color: 'red' }}>❌ Connection failed: {error}</p>

  return (
    <div>
      <h1>Hotel Booking App</h1>
      {rooms.length > 0
        ? <p>✅ Connected! Found {rooms.length} rooms.</p>
        : <p>⏳ Connecting...</p>
      }
      <pre>{JSON.stringify(rooms, null, 2)}</pre>
    </div>
  )
}

export default App