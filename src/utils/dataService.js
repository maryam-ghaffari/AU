// Data service for managing bookings
// In a real application, this would communicate with a backend API

import bookingsData from '../../data/bookings.json'
import servicesData from '../../data/services.json'

const BOOKINGS_KEY = 'bookings'

function getStoredBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    if (raw) return JSON.parse(raw)
    const initial = [...bookingsData]
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(initial))
    return initial
  } catch (error) {
    console.error('Error reading bookings from storage:', error)
    return [...bookingsData]
  }
}

// Simulate loading bookings from JSON file
export function loadBookings() {
  return getStoredBookings()
}

// Simulate saving bookings to JSON file
// In a real app, this would make an API call
export function saveBooking(booking) {
  try {
    const bookings = getStoredBookings()
    bookings.push(booking)
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
    console.log('Booking saved:', booking)
    return {
      success: true,
      message: 'Bokningen har sparats! Du kommer att få en bekräftelse via e-post.'
    }
  } catch (error) {
    console.error('Error saving booking:', error)
    return { success: false, message: 'Misslyckades att spara bokningen' }
  }
}

export function saveBookings(bookings) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
    return { success: true }
  } catch (error) {
    console.error('Error saving bookings:', error)
    return { success: false }
  }
}

// Load services
export function loadServices() {
  return [...servicesData]
}


