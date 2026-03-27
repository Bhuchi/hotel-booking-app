export default function RoomCard({ room, available, onBook, booking }) {
  const { name, type, room_type, price_per_night, description, image_url } = room

  return (
    <div className="card" style={styles.card}>
      {image_url && (
        <img src={image_url} alt={name} style={styles.image} />
      )}

      <div style={styles.body}>
        <div style={styles.topRow}>
          <span className="badge badge-accent">{type ?? room_type}</span>
          {available
            ? <span className="badge badge-success">Available</span>
            : <span className="badge badge-muted">Unavailable</span>
          }
        </div>

        <h3 style={styles.name}>{name}</h3>

        {description && (
          <p style={styles.description}>{description}</p>
        )}

        <div style={styles.footer}>
          <div>
            <span style={styles.price}>${price_per_night}</span>
            <span style={styles.perNight}> / night</span>
          </div>

          <button
            className="btn btn-primary"
            style={styles.bookBtn}
            disabled={!available || booking}
            onClick={() => onBook(room)}
          >
            {booking ? 'Booking…' : 'Book'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    display: 'block',
  },
  body: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  topRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 22,
    letterSpacing: '0.04em',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: 13,
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--accent)',
  },
  perNight: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  bookBtn: {
    width: 'auto',
    padding: '10px 20px',
    fontSize: 14,
  },
}
