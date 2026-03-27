import { supabase } from './supabaseClient';

// User Authentication
export const signUp = async (email, password, firstName, lastName) => {
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) return { data: null, error: signUpError };

  // data.user can be null if email confirmation is required
  if (data.user) {
    // Use upsert in case a backend trigger already inserted the row
    await supabase.from('users').upsert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
    }, { onConflict: 'id' });
    // Non-fatal: if this fails, auth still works and user can log in
  }

  return { data, error: null };
};

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

// Fetch all active rooms, optionally filtered by room type
export const getRooms = async (roomType) => {
  let query = supabase.from('rooms').select('*').eq('is_active', true);
  if (roomType && roomType !== 'All') query = query.eq('type', roomType);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fetch room IDs that are booked (confirmed) within the given date range
export const getBookedRoomIds = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('room_id')
    .eq('status', 'confirmed')
    .lt('check_in_date', endDate)
    .gt('check_out_date', startDate);

  if (error) throw error;
  return new Set((data || []).map(b => b.room_id));
};

// Create a new booking
export const createBooking = async (userId, roomId, checkInDate, checkOutDate) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: userId,
      room_id: roomId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      status: 'confirmed',
    }])
    .select();
  return { data, error };
};

// List all bookings for a user, including room details
export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(*)')
    .eq('user_id', userId)
    .order('check_in_date', { ascending: true });

  if (error) throw error;
  return data;
};

// Cancel a booking by updating its status to 'cancelled'
export const cancelBooking = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select();

  if (error) throw error;
  return data;
};
