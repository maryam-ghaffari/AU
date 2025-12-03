<template>
  <div class="service-history">
    <h1>Servicehistorik</h1>

    <div class="search-section">
      <div class="search-box">
        <label for="regNumber">Sök efter registreringsnummer:</label>
        <input
          type="text"
          id="regNumber"
          v-model="searchRegNumber"
          placeholder="Ange registreringsnummer (t.ex. ABC123)"
          class="search-input"
          style="text-transform: uppercase;"
          @input="searchHistory"
        />
        <button @click="clearSearch" class="clear-btn" v-if="searchRegNumber">
          Rensa
        </button>
      </div>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label for="dateFrom">Från datum:</label>
        <input type="date" id="dateFrom" v-model="dateFrom" @change="filterHistory" />
      </div>
      <div class="filter-group">
        <label for="dateTo">Till datum:</label>
        <input type="date" id="dateTo" v-model="dateTo" @change="filterHistory" />
      </div>
      <div class="filter-group">
        <label for="serviceFilter">Service:</label>
        <select id="serviceFilter" v-model="serviceFilter" @change="filterHistory">
          <option value="">Alla</option>
          <option v-for="service in services" :key="service.id" :value="service.name">
            {{ service.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="statusFilter">Status:</label>
        <select id="statusFilter" v-model="statusFilter" @change="filterHistory">
          <option value="">Alla</option>
          <option value="completed">Avslutade</option>
          <option value="in_progress">Pågående</option>
          <option value="pending">Väntande</option>
          <option value="cancelled">Avbokade</option>
        </select>
      </div>
    </div>

    <div v-if="!searchRegNumber" class="info-message">
      <p>Ange ett registreringsnummer för att se servicehistorik.</p>
    </div>

    <div v-else-if="filteredHistory.length === 0" class="no-results">
      <p>Ingen servicehistorik hittades för registreringsnummer {{ searchRegNumber }}.</p>
    </div>

    <div v-else class="history-list">
      <div class="summary">
        <h3>Sammanfattning för {{ searchRegNumber }}</h3>
        <p>Totalt antal service: {{ filteredHistory.length }}</p>
        <p>Avslutade: {{ completedCount }}</p>
        <p>Pågående: {{ inProgressCount }}</p>
        <p>Väntande: {{ pendingCount }}</p>
      </div>

      <div
        v-for="booking in sortedHistory"
        :key="booking.id"
        class="history-card"
        :class="booking.status"
      >
        <div class="history-header">
          <h3>Service #{{ booking.id }}</h3>
          <span class="status-badge" :class="booking.status">
            {{ getStatusText(booking.status) }}
          </span>
        </div>

        <div class="history-details">
          <div class="detail-row">
            <strong>Datum:</strong> {{ formatDate(booking.date) }}
          </div>
          <div class="detail-row">
            <strong>Tid:</strong> {{ booking.time }}
          </div>
          <div class="detail-row">
            <strong>Service:</strong> {{ booking.serviceType }}
          </div>
          <div class="detail-row">
            <strong>Kund:</strong> {{ booking.customerName }}
          </div>
          <div class="detail-row">
            <strong>E-post:</strong> {{ booking.email }}
          </div>
          <div v-if="booking.completedAction" class="detail-row completed-action">
            <strong>Utförd åtgärd:</strong> {{ booking.completedAction }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadBookings as loadBookingsData, loadServices as loadServicesData } from '../utils/dataService'

export default {
  name: 'ServiceHistory',
  data() {
    return {
      bookings: [],
      services: [],
      searchRegNumber: '',
      dateFrom: '',
      dateTo: '',
      serviceFilter: '',
      statusFilter: ''
    }
  },
  computed: {
    filteredHistory() {
      if (!this.searchRegNumber) return []

      let filtered = this.bookings.filter(booking =>
        booking.registrationNumber.toUpperCase() === this.searchRegNumber.toUpperCase()
      )

      // Date filter
      if (this.dateFrom) {
        filtered = filtered.filter(booking => booking.date >= this.dateFrom)
      }
      if (this.dateTo) {
        filtered = filtered.filter(booking => booking.date <= this.dateTo)
      }

      // Service filter
      if (this.serviceFilter) {
        filtered = filtered.filter(booking => booking.serviceType === this.serviceFilter)
      }

      // Status filter
      if (this.statusFilter) {
        filtered = filtered.filter(booking => booking.status === this.statusFilter)
      }

      return filtered
    },
    sortedHistory() {
      return [...this.filteredHistory].sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time)
        const dateB = new Date(b.date + ' ' + b.time)
        return dateB - dateA // Newest first
      })
    },
    completedCount() {
      return this.filteredHistory.filter(b => b.status === 'completed').length
    },
    inProgressCount() {
      return this.filteredHistory.filter(b => b.status === 'in_progress').length
    },
    pendingCount() {
      return this.filteredHistory.filter(b => b.status === 'pending').length
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
    searchHistory() {
      // Search is reactive through computed property
    },
    filterHistory() {
      // Filtering is reactive through computed property
    },
    clearSearch() {
      this.searchRegNumber = ''
      this.dateFrom = ''
      this.dateTo = ''
      this.serviceFilter = ''
      this.statusFilter = ''
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
    }
  }
}
</script>

<style scoped>
.service-history {
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

.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-box label {
  color: #2c3e50;
  font-weight: 500;
}

.search-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  align-self: flex-start;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #3498db;
}

.info-message,
.no-results {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  color: #666;
}

.summary {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.summary h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.summary p {
  margin: 0.5rem 0;
  color: #555;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 5px solid #3498db;
  transition: transform 0.3s, box-shadow 0.3s;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.history-card.pending {
  border-left-color: #f39c12;
}

.history-card.in_progress {
  border-left-color: #3498db;
}

.history-card.completed {
  border-left-color: #27ae60;
}

.history-card.cancelled {
  border-left-color: #e74c3c;
  opacity: 0.7;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.history-header h3 {
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

.history-details {
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

@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>




