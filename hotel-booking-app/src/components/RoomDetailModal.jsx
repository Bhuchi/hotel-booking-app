import { useEffect } from 'react'

export default function RoomDetailModal({ room, available, onBook, booking, onClose }) {
  const { name, type, room_type, price_per_night, description, image_url, capacity, amenities, room_number, floor, max_guests } = room

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const roomType = type ?? room_type

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Image */}
        {image_url ? (
          <img src={image_url} alt={name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.placeholderIcon}>🛏</span>
          </div>
        )}

        {/* Close button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div style={styles.body}>
          {/* Badges */}
          <div style={styles.badgeRow}>
            <span className="badge badge-accent">{roomType}</span>
            {available
              ? <span className="badge badge-success">Available</span>
              : <span className="badge badge-muted">Unavailable</span>
            }
          </div>

          {/* Name */}
          <h2 style={styles.name}>{name}</h2>

          {/* Description */}
          {description && (
            <p style={styles.description}>{description}</p>
          )}

          {/* Details grid */}
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Price</span>
              <span style={styles.detailValue}>
                <span style={styles.price}>${price_per_night}</span>
                <span style={styles.perNight}> / night</span>
              </span>
            </div>

            {room_number != null && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Room No.</span>
                <span style={styles.detailValue}>{room_number}</span>
              </div>
            )}

            {floor != null && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Floor</span>
                <span style={styles.detailValue}>{floor}</span>
              </div>
            )}

            {max_guests != null && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Max Guests</span>
                <span style={styles.detailValue}>{max_guests} guest{max_guests > 1 ? 's' : ''}</span>
              </div>
            )}

            {capacity != null && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Capacity</span>
                <span style={styles.detailValue}>{capacity} guest{capacity > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          {amenities && amenities.length > 0 && (
            <div style={styles.amenitiesSection}>
              <span style={styles.detailLabel}>Amenities</span>
              <div style={styles.amenitiesList}>
                {(Array.isArray(amenities) ? amenities : amenities.split(',')).map((a, i) => (
                  <span key={i} style={styles.amenityTag}>{a.toString().trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Book button */}
          <button
            className="btn btn-primary"
            style={{ marginTop: 8 }}
            disabled={!available || booking}
            onClick={() => { onBook(room); onClose() }}
          >
            {booking ? 'Booking…' : available ? 'Book This Room' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-card)',
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 260,
    objectFit: 'cover',
    display: 'block',
    borderRadius: 'var(--radius-card) var(--radius-card) 0 0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 260,
    background: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-card) var(--radius-card) 0 0',
  },
  placeholderIcon: {
    fontSize: 64,
    opacity: 0.4,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(0,0,0,0.6)',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    width: 32,
    height: 32,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  badgeRow: {
    display: 'flex',
    gap: 8,
  },
  name: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 32,
    letterSpacing: '0.04em',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: 14,
    lineHeight: 1.6,
  },
  detailsGrid: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: '14px 16px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text)',
  },
  price: {
    fontSize: 22,
    fontWeight: 500,
    color: 'var(--accent)',
  },
  perNight: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  amenitiesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  amenitiesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  amenityTag: {
    background: 'rgba(255,229,0,0.1)',
    border: '1px solid rgba(255,229,0,0.25)',
    color: 'var(--accent)',
    borderRadius: 6,
    fontSize: 12,
    padding: '3px 10px',
  },
}
