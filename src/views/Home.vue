<template>
  <div class="home">
    <div class="hero">
      <h1>Välkommen till Bil- och Däckfirma</h1>
      <p class="subtitle">Din pålitliga partner för bilservice och däckbyte</p>
    </div>

    <div class="services-overview">
      <h2>Våra Tjänster</h2>
      <div class="services-grid">
        <div v-for="service in services" :key="service.id" class="service-card">
          <h3>{{ service.name }}</h3>
          <p>{{ service.description }}</p>
          <div class="service-info">
            <span>Pris: {{ service.price }} kr</span>
            <span>Varaktighet: {{ service.duration }} min</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Boka din service idag!</h2>
      <p>Välj ett datum och tid som passar dig</p>
      <router-link to="/boka-service" class="cta-button">Boka Service</router-link>
    </div>
  </div>
</template>

<script>
import { loadServices } from '../utils/dataService'

export default {
  name: 'Home',
  data() {
    return {
      services: []
    }
  },
  async mounted() {
    this.services = loadServices()
  }
}
</script>

<style scoped>
.home {
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

.hero {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.services-overview {
  margin-bottom: 3rem;
}

.services-overview h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.service-card h3 {
  color: #3498db;
  margin-bottom: 0.5rem;
}

.service-card p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.service-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #888;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.cta-section {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cta-section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.cta-section p {
  margin-bottom: 2rem;
  color: #666;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}
</style>


