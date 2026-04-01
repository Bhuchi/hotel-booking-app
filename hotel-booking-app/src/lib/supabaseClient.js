import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ROOM_IMAGE_FILES = {
  single: 'single.jpg',
  double: 'double.jpeg',
  suite: 'suite.jpeg',
  deluxe: 'deluxe.jpeg',
}

export function getRoomImageUrl(roomType) {
  const file = ROOM_IMAGE_FILES[roomType?.toLowerCase()]
  if (!file) return null
  return `${supabaseUrl}/storage/v1/object/public/room-images/${file}`
}