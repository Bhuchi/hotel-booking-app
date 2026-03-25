import { supabase } from './supabaseClient';

// User Authentication
export const signUp = async (email, password, firstName, lastName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  });
  return { data, error };
};

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Edit user profile
export const updateProfile = async (userId, firstName, lastName) => {
  const { data, error } = await supabase
    .from('users')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data;
};

//Fetch available rooms based on checkin and checkout dates
export const getAvailableRooms = async (startDate, endDate) => {

  const { data: overlaps, error: overlapError } = await supabase
    .from('bookings')
    .select('room_id')
    .eq('status', 'confirmed')
    .lt('check_in_date', endDate)
    .gt('check_out_date', startDate);

  if (overlapError) throw overlapError;

  const bookedRoomIds = overlaps.map(b => b.room_id);

  const { data: rooms, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
    .not('id', 'in', `(${bookedRoomIds.length > 0 ? bookedRoomIds.join(',') : '00000000-0000-0000-0000-000000000000'})`);

  if (roomError) throw roomError;
  return rooms;
};

// Create a new booking
export const createBooking = async (userId, roomId, checkInDate, checkOutDate) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      { user_id: userId,
        room_id: roomId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }
    ])
    .select();
  return { data, error };
};

// List all bookings for a user, including room details
export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      rooms (
        room_number,
        type,
        price_per_night
      )
    `)
    .eq('user_id', userId)
    .order('check_in_date', { ascending: true });

  if (error) throw error;
  return data;
};

// Cancel a booking by updating its status to 'cancelled'
export const cancelBooking = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status: 'cancelled', 
      cancelled_at: new Date().toISOString() 
    })
    .eq('id', bookingId)
    .select();

  if (error) throw error;
  return data;
};