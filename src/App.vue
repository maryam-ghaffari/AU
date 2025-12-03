<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">Bil- och Däckfirma</h1>
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link">Hem</router-link>
          </li>
          <li>
            <router-link to="/boka-service" class="nav-link">Boka Service</router-link>
          </li>
          <li>
            <router-link to="/mina-bokningar" class="nav-link">Mina Bokningar</router-link>
          </li>
          <li>
            <router-link to="/servicehistorik" class="nav-link">Servicehistorik</router-link>
          </li>
          <li>
            <router-link to="/om-oss" class="nav-link">Om Oss</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { checkAndSendReminders, getReminderPreference } from './utils/emailService'
import { loadBookings } from './utils/dataService'

export default {
  name: 'App',
  async mounted() {
    // Check and send reminders when app loads
    await this.checkReminders()
    
    // Check reminders every hour
    setInterval(() => {
      this.checkReminders()
    }, 60 * 60 * 1000) // 1 hour
  },
  methods: {
    async checkReminders() {
      try {
        const bookings = loadBookings()
        
        // Filter bookings where reminders are enabled
        const bookingsWithReminders = bookings.filter(booking => {
          if (booking.status !== 'pending') return false
          return getReminderPreference(booking.email)
        })
        
        if (bookingsWithReminders.length > 0) {
          await checkAndSendReminders(bookingsWithReminders)
        }
      } catch (error) {
        console.error('Error checking reminders:', error)
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.router-link-active {
  background-color: #3498db;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>


