import { useState } from 'react'

export default function RoomCard({ room, available, onBook, booking, onInspect }) {
  const { name, type, room_type, price_per_night, description, image_url } = room
  const [hovered, setHovered] = useState(false)

  return (
    <div className="card" style={styles.card}>
      {/* Image — clickable to inspect */}
      <div
        style={styles.imageWrap}
        onClick={() => onInspect(room)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            style={{ ...styles.image, transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.placeholderIcon}>🛏</span>
          </div>
        )}
        <div style={{ ...styles.imageOverlay, background: hovered ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0)' }}>
          <span style={{ ...styles.inspectLabel, opacity: hovered ? 1 : 0 }}>View Details</span>
        </div>
      </div>

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
  imageWrap: {
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.25s',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    background: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    opacity: 0.35,
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    // hover handled via CSS class below — we use onMouseEnter/Leave instead
  },
  inspectLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    background: 'rgba(0,0,0,0.55)',
    padding: '6px 14px',
    borderRadius: 8,
    opacity: 0,
    transition: 'opacity 0.2s',
    pointerEvents: 'none',
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
