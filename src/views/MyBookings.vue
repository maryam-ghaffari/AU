<template>
  <div class="my-bookings">
    <h1>Mina Bokningar</h1>

    <div class="controls">
      <div class="search-filter-section">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Sök efter regnr, e-post eller namn..."
            class="search-input"
          />
        </div>

        <div class="filter-box">
          <label for="dateFilter">Filtrera efter datum:</label>
          <input
            type="date"
            id="dateFilter"
            v-model="dateFilter"
            class="date-filter-input"
          />
          <button @click="clearDateFilter" class="clear-filter-btn" v-if="dateFilter">
            Rensa filter
          </button>
        </div>

        <div class="status-filter">
          <label>Filtrera efter status:</label>
          <select v-model="statusFilter" class="status-select">
            <option value="">Alla</option>
            <option value="pending">Väntande</option>
            <option value="in_progress">Pågående</option>
            <option value="completed">Avslutade</option>
            <option value="cancelled">Avbokade</option>
          </select>
        </div>
      </div>
      
      <div class="export-section">
        <label>Exportera bokningar:</label>
        <div class="export-buttons">
          <button @click="exportToPDF" class="export-btn pdf-btn" :disabled="filteredBookings.length === 0">
            📄 Exportera till PDF
          </button>
          <button @click="exportToCSV" class="export-btn csv-btn" :disabled="filteredBookings.length === 0">
            📊 Exportera till Excel
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredBookings.length === 0" class="no-bookings">
      <p>Inga bokningar hittades.</p>
    </div>

    <div v-else class="bookings-list">
      <div
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="booking-card"
        :class="booking.status"
      >
        <div class="booking-header">
          <h3>Bokning #{{ booking.id }}</h3>
          <span class="status-badge" :class="booking.status">
            {{ getStatusText(booking.status) }}
          </span>
        </div>

        <div class="booking-details">
          <div class="detail-row">
            <strong>Kund:</strong> {{ booking.customerName }}
          </div>
          <div class="detail-row">
            <strong>E-post:</strong> {{ booking.email }}
          </div>
          <div class="detail-row">
            <strong>Telefon:</strong> {{ booking.phone }}
          </div>
          <div class="detail-row">
            <strong>Registreringsnummer:</strong> {{ booking.registrationNumber }}
          </div>
          <div class="detail-row">
            <strong>Service:</strong> {{ booking.serviceType }}
          </div>
          <div class="detail-row">
            <strong>Datum:</strong> {{ formatDate(booking.date) }}
          </div>
          <div class="detail-row">
            <strong>Tid:</strong> {{ booking.time }}
          </div>
          <div v-if="booking.completedAction" class="detail-row completed-action">
            <strong>Utförd åtgärd:</strong> {{ booking.completedAction }}
          </div>
        </div>

        <div class="booking-actions">
          <button
            v-if="booking.status === 'pending' || booking.status === 'in_progress'"
            @click="editBooking(booking)"
            class="action-btn edit-btn"
          >
            Ändra
          </button>
          <button
            v-if="booking.status === 'pending' || booking.status === 'in_progress'"
            @click="markInProgress(booking)"
            class="action-btn progress-btn"
          >
            Markera som pågående
          </button>
          <button
            v-if="booking.status === 'pending' || booking.status === 'in_progress'"
            @click="completeBooking(booking)"
            class="action-btn complete-btn"
          >
            Markera som avslutad
          </button>
          <button
            v-if="booking.status !== 'cancelled'"
            @click="cancelBooking(booking)"
            class="action-btn cancel-btn"
          >
            Avboka
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingBooking" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>Ändra bokning</h2>
        <form @submit.prevent="saveEdit">
          <div class="form-group">
            <label>Namn:</label>
            <input v-model="editForm.customerName" required />
          </div>
          <div class="form-group">
            <label>E-post:</label>
            <input type="email" v-model="editForm.email" required />
          </div>
          <div class="form-group">
            <label>Telefon:</label>
            <input v-model="editForm.phone" required />
          </div>
          <div class="form-group">
            <label>Registreringsnummer:</label>
            <input v-model="editForm.registrationNumber" required style="text-transform: uppercase;" />
          </div>
          <div class="form-group">
            <label>Service:</label>
            <select v-model="editForm.serviceType" required>
              <option v-for="service in services" :key="service.id" :value="service.name">
                {{ service.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Datum:</label>
            <input type="date" v-model="editForm.date" required />
          </div>
          <div class="form-group">
            <label>Tid:</label>
            <input type="time" v-model="editForm.time" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Spara</button>
            <button type="button" @click="closeEditModal" class="cancel-btn">Avbryt</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Email Preferences -->
    <div class="email-preferences">
      <h3>E-postinställningar</h3>
      <div class="preference-item">
        <label>
          <input
            type="checkbox"
            v-model="remindersEnabled"
            @change="updateReminderPreference"
          />
          Ta emot påminnelser via e-post (24 timmar innan service)
        </label>
        <p class="preference-note">
          Du kommer att få en påminnelse via e-post 24 timmar innan din bokade service.
        </p>
      </div>
    </div>

    <!-- Complete Modal -->
    <div v-if="completingBooking" class="modal-overlay" @click="closeCompleteModal">
      <div class="modal-content" @click.stop>
        <h2>Markera bokning som avslutad</h2>
        <form @submit.prevent="saveCompletion">
          <div class="form-group">
            <label>Beskriv utförd åtgärd:</label>
            <textarea
              v-model="completedAction"
              rows="4"
              placeholder="Beskriv vad som har utförts..."
              required
            ></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Spara</button>
            <button type="button" @click="closeCompleteModal" class="cancel-btn">Avbryt</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { exportToPDF, exportToCSV } from '../utils/exportService'
import { getReminderPreference, setReminderPreference } from '../utils/emailService'
import { loadBookings as loadBookingsData, loadServices as loadServicesData, saveBookings as persistBookings } from '../utils/dataService'

export default {
  name: 'MyBookings',
  data() {
    return {
      bookings: [],
      services: [],
      searchQuery: '',
      dateFilter: '',
      statusFilter: '',
      editingBooking: null,
      editForm: {},
      completingBooking: null,
      completedAction: '',
      remindersEnabled: true,
      userEmail: ''
    }
  },
  computed: {
    filteredBookings() {
      let filtered = [...this.bookings]

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(booking =>
          booking.registrationNumber.toLowerCase().includes(query) ||
          booking.email.toLowerCase().includes(query) ||
          booking.customerName.toLowerCase().includes(query) ||
          booking.id.toString().includes(query)
        )
      }

      // Date filter
      if (this.dateFilter) {
        filtered = filtered.filter(booking => booking.date === this.dateFilter)
      }

      // Status filter
      if (this.statusFilter) {
        filtered = filtered.filter(booking => booking.status === this.statusFilter)
      }

      // Sort by date and time
      return filtered.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time)
        const dateB = new Date(b.date + ' ' + b.time)
        return dateA - dateB
      })
    }
  },
  async mounted() {
    await this.loadBookings()
    await this.loadServices()
    // Load reminder preference (use first booking's email if available, or prompt)
    if (this.bookings.length > 0) {
      this.userEmail = this.bookings[0].email
      this.remindersEnabled = getReminderPreference(this.userEmail)
    }
  },
  methods: {
    async loadBookings() {
      this.bookings = loadBookingsData()
    },
    async loadServices() {
      this.services = loadServicesData()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getStatusText(status) {
      const statusMap = {
        pending: 'Väntande',
        in_progress: 'Pågående',
        completed: 'Avslutad',
        cancelled: 'Avbokad'
      }
      return statusMap[status] || status
    },
    clearDateFilter() {
      this.dateFilter = ''
    },
    editBooking(booking) {
      this.editingBooking = booking
      this.editForm = { ...booking }
    },
    closeEditModal() {
      this.editingBooking = null
      this.editForm = {}
    },
    saveEdit() {
      const index = this.bookings.findIndex(b => b.id === this.editingBooking.id)
      if (index !== -1) {
        this.bookings[index] = {
          ...this.editForm,
          registrationNumber: this.editForm.registrationNumber.toUpperCase()
        }
      }
      persistBookings(this.bookings)
      this.closeEditModal()
    },
    cancelBooking(booking) {
      if (confirm('Är du säker på att du vill avboka denna bokning?')) {
        const index = this.bookings.findIndex(b => b.id === booking.id)
        if (index !== -1) {
          this.bookings[index].status = 'cancelled'
        }
        persistBookings(this.bookings)
      }
    },
    markInProgress(booking) {
      const index = this.bookings.findIndex(b => b.id === booking.id)
      if (index !== -1) {
        this.bookings[index].status = 'in_progress'
      }
      persistBookings(this.bookings)
    },
    completeBooking(booking) {
      this.completingBooking = booking
      this.completedAction = booking.completedAction || ''
    },
    closeCompleteModal() {
      this.completingBooking = null
      this.completedAction = ''
    },
    saveCompletion() {
      const index = this.bookings.findIndex(b => b.id === this.completingBooking.id)
      if (index !== -1) {
        this.bookings[index].status = 'completed'
        this.bookings[index].completedAction = this.completedAction
      }
      persistBookings(this.bookings)
      this.closeCompleteModal()
    },
    exportToPDF() {
      const bookingsToExport = this.filteredBookings
      if (bookingsToExport.length === 0) {
        alert('Inga bokningar att exportera')
        return
      }
      
      const options = {
        title: 'Bokningar',
        subtitle: `Totalt ${bookingsToExport.length} bokningar`
      }
      
      exportToPDF(bookingsToExport, options)
    },
    exportToCSV() {
      const bookingsToExport = this.filteredBookings
      if (bookingsToExport.length === 0) {
        alert('Inga bokningar att exportera')
        return
      }
      
      exportToCSV(bookingsToExport, 'bokningar')
    },
    updateReminderPreference() {
      if (this.userEmail) {
        setReminderPreference(this.userEmail, this.remindersEnabled)
        const message = this.remindersEnabled
          ? 'Påminnelser är nu aktiverade'
          : 'Påminnelser är nu avaktiverade'
        alert(message)
      }
    }
  }
}
</script>

<style scoped>
.my-bookings {
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

.controls {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.search-filter-section {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.5rem;
}

.export-section {
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.export-section label {
  color: #2c3e50;
  font-weight: 500;
}

.export-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.export-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pdf-btn {
  background-color: #e74c3c;
  color: white;
}

.pdf-btn:hover:not(:disabled) {
  background-color: #c0392b;
}

.csv-btn {
  background-color: #27ae60;
  color: white;
}

.csv-btn:hover:not(:disabled) {
  background-color: #229954;
}

.search-box,
.filter-box,
.status-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-input,
.date-filter-input,
.status-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-input:focus,
.date-filter-input:focus,
.status-select:focus {
  outline: none;
  border-color: #3498db;
}

.clear-filter-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-filter-btn:hover {
  background-color: #c0392b;
}

.no-bookings {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  color: #666;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 5px solid #3498db;
  transition: transform 0.3s, box-shadow 0.3s;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.booking-card.pending {
  border-left-color: #f39c12;
}

.booking-card.in_progress {
  border-left-color: #3498db;
}

.booking-card.completed {
  border-left-color: #27ae60;
}

.booking-card.cancelled {
  border-left-color: #e74c3c;
  opacity: 0.7;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.booking-header h3 {
  color: #2c3e50;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.in_progress {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.booking-details {
  margin-bottom: 1rem;
}

.detail-row {
  margin-bottom: 0.5rem;
  color: #555;
}

.detail-row strong {
  color: #2c3e50;
  margin-right: 0.5rem;
}

.completed-action {
  background-color: #f0f9ff;
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 0.5rem;
}

.booking-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.progress-btn {
  background-color: #9b59b6;
  color: white;
}

.progress-btn:hover {
  background-color: #8e44ad;
}

.complete-btn {
  background-color: #27ae60;
  color: white;
}

.complete-btn:hover {
  background-color: #229954;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.modal-content .form-group {
  margin-bottom: 1rem;
}

.modal-content .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.modal-content .form-group input,
.modal-content .form-group select,
.modal-content .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.modal-content .form-group textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions .save-btn {
  flex: 1;
  padding: 0.75rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.modal-actions .save-btn:hover {
  background-color: #229954;
}

.modal-actions .cancel-btn {
  flex: 1;
  padding: 0.75rem;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.modal-actions .cancel-btn:hover {
  background-color: #7f8c8d;
}

.email-preferences {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.email-preferences h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preference-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
}

.preference-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.preference-note {
  color: #666;
  font-size: 0.9rem;
  margin-left: 2rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .search-filter-section {
    grid-template-columns: 1fr;
  }

  .booking-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .export-buttons {
    flex-direction: column;
  }

  .export-btn {
    width: 100%;
  }
}
</style>

