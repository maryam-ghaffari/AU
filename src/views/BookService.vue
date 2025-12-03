<template>
  <div class="book-service">
    <h1>Boka Service</h1>
    
    <div v-if="showSuccessMessage" class="success-message">
      <div v-if="emailSending">
        <strong>Bokningen har sparats!</strong> Skickar bekräftelse via e-post...
      </div>
      <div v-else>
        <strong>Bokningen har sparats!</strong> Bekräftelse har skickats till {{ lastBookingEmail || 'din e-post' }}.
      </div>
    </div>

    <form @submit.prevent="submitBooking" class="booking-form">
      <div class="form-group">
        <label for="customerName">Namn *</label>
        <input
          type="text"
          id="customerName"
          v-model="formData.customerName"
          required
          placeholder="Ange ditt fullständiga namn"
        />
      </div>

      <div class="form-group">
        <label for="email">E-post *</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="exempel@email.com"
        />
      </div>

      <div class="form-group">
        <label for="phone">Telefon *</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          required
          placeholder="070-1234567"
        />
      </div>

      <div class="form-group">
        <label for="registrationNumber">Registreringsnummer *</label>
        <input
          type="text"
          id="registrationNumber"
          v-model="formData.registrationNumber"
          required
          placeholder="ABC123"
          style="text-transform: uppercase;"
        />
      </div>

      <div class="form-group">
        <label for="serviceType">Typ av service *</label>
        <select id="serviceType" v-model="formData.serviceType" required>
          <option value="">Välj typ av service</option>
          <option v-for="service in services" :key="service.id" :value="service.name">
            {{ service.name }} - {{ service.price }} kr
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="date">Datum *</label>
        <input
          type="date"
          id="date"
          v-model="formData.date"
          required
          :min="minDate"
          @change="updateAvailableTimes"
        />
      </div>

      <div class="form-group">
        <label for="time">Tid *</label>
        <select id="time" v-model="formData.time" required :disabled="!formData.date">
          <option value="">Välj tid</option>
          <option
            v-for="timeSlot in availableTimeSlots"
            :key="timeSlot"
            :value="timeSlot"
            :disabled="!isTimeAvailable(timeSlot)"
          >
            {{ timeSlot }} {{ isTimeAvailable(timeSlot) ? '' : '(Upptagen)' }}
          </option>
        </select>
      </div>

      <div class="calendar-preview">
        <h3>Lediga tider för {{ formData.date || 'valt datum' }}</h3>
        <div class="time-slots">
          <button
            v-for="timeSlot in allTimeSlots"
            :key="timeSlot"
            type="button"
            @click="formData.time = timeSlot"
            :class="['time-slot', {
              'available': isTimeAvailable(timeSlot),
              'occupied': !isTimeAvailable(timeSlot),
              'selected': formData.time === timeSlot
            }]"
            :disabled="!isTimeAvailable(timeSlot) || !formData.date"
          >
            {{ timeSlot }}
          </button>
        </div>
      </div>

      <button type="submit" class="submit-button" :disabled="!isFormValid">
        Boka Service
      </button>
    </form>
  </div>
</template>

<script>
import { sendBookingConfirmation } from '../utils/emailService'
import { loadBookings as loadBookingsData, loadServices as loadServicesData, saveBooking as persistBooking } from '../utils/dataService'

export default {
  name: 'BookService',
  data() {
    return {
      formData: {
        customerName: '',
        email: '',
        phone: '',
        registrationNumber: '',
        serviceType: '',
        date: '',
        time: ''
      },
      bookings: [],
      services: [],
      showSuccessMessage: false,
      emailSending: false,
      lastBookingEmail: '',
      allTimeSlots: [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
      ]
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      today.setDate(today.getDate() + 1)
      return today.toISOString().split('T')[0]
    },
    availableTimeSlots() {
      return this.allTimeSlots
    },
    isFormValid() {
      return this.formData.customerName &&
             this.formData.email &&
             this.formData.phone &&
             this.formData.registrationNumber &&
             this.formData.serviceType &&
             this.formData.date &&
             this.formData.time
    }
  },
  async mounted() {
    await this.loadBookings()
    await this.loadServices()
  },
  methods: {
    async loadBookings() {
      this.bookings = loadBookingsData()
    },
    async loadServices() {
      this.services = loadServicesData()
    },
    updateAvailableTimes() {
      this.formData.time = ''
    },
    isTimeAvailable(timeSlot) {
      if (!this.formData.date) return false
      
      return !this.bookings.some(booking => 
        booking.date === this.formData.date &&
        booking.time === timeSlot &&
        booking.status !== 'cancelled'
      )
    },
    async submitBooking() {
      const newBooking = {
        id: Date.now(),
        ...this.formData,
        registrationNumber: this.formData.registrationNumber.toUpperCase(),
        status: 'pending',
        completedAction: null
      }

      // Save email before resetting form
      const customerEmail = this.formData.email

      this.bookings.push(newBooking)
      this.showSuccessMessage = true
      this.emailSending = true
      this.lastBookingEmail = customerEmail

      // Persist booking
      try {
        await persistBooking(newBooking)
      } catch (error) {
        console.error('Error persisting booking:', error)
      }

      // Send confirmation email
      try {
        await sendBookingConfirmation(newBooking)
      } catch (error) {
        console.error('Error sending confirmation email:', error)
      } finally {
        this.emailSending = false
      }

      // Reset form
      this.formData = {
        customerName: '',
        email: '',
        phone: '',
        registrationNumber: '',
        serviceType: '',
        date: '',
        time: ''
      }

      setTimeout(() => {
        this.showSuccessMessage = false
        this.lastBookingEmail = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
.book-service {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 2rem;
  border: 1px solid #c3e6cb;
  text-align: center;
}

.booking-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.calendar-preview {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.calendar-preview h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.time-slot {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.time-slot.available {
  border-color: #27ae60;
  color: #27ae60;
}

.time-slot.available:hover {
  background-color: #27ae60;
  color: white;
}

.time-slot.occupied {
  border-color: #e74c3c;
  color: #e74c3c;
  cursor: not-allowed;
  opacity: 0.6;
}

.time-slot.selected {
  background-color: #3498db;
  border-color: #3498db;
  color: white;
}

.time-slot:disabled {
  cursor: not-allowed;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.submit-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>

