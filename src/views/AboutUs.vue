<template>
  <div class="about-us">
    <h1>Om Oss</h1>
    
    <div class="about-content">
      <section class="intro-section">
        <h2>Välkommen till Bil- och Däckfirma</h2>
        <p>
          Vi är en pålitlig bilservicefirma med många års erfarenhet av att ta hand om 
          ditt fordon. Vårt team av certifierade mekaniker är dedikerade till att ge dig 
          den bästa servicen möjlig.
        </p>
      </section>

      <section class="services-section">
        <h2>Våra Tjänster</h2>
        <div class="services-list">
          <div v-for="service in services" :key="service.id" class="service-item">
            <h3>{{ service.name }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </section>

      <section class="contact-section">
        <h2>Kontakta Oss</h2>
        <div class="contact-info">
          <div class="contact-item">
            <strong>Telefon:</strong>
            <p>08-123 45 67</p>
          </div>
          <div class="contact-item">
            <strong>E-post:</strong>
            <p>info@bildackfirma.se</p>
          </div>
          <div class="contact-item">
            <strong>Adress:</strong>
            <p>Servicegatan 123<br>123 45 Stockholm</p>
          </div>
          <div class="contact-item">
            <strong>Öppettider:</strong>
            <p>Måndag - Fredag: 08:00 - 17:00<br>Lördag: 09:00 - 14:00<br>Söndag: Stängt</p>
          </div>
        </div>
      </section>

      <section class="why-us-section">
        <h2>Varför Välja Oss?</h2>
        <ul class="benefits-list">
          <li>✓ Certifierade mekaniker</li>
          <li>✓ Snabb och pålitlig service</li>
          <li>✓ Konkurrenskraftiga priser</li>
          <li>✓ Modern utrustning</li>
          <li>✓ Kundservice på högsta nivå</li>
          <li>✓ Flexibla bokningstider</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { loadServices } from '../utils/dataService'

export default {
  name: 'AboutUs',
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
.about-us {
  max-width: 900px;
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.intro-section p {
  line-height: 1.8;
  color: #555;
  font-size: 1.1rem;
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.service-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.service-item h3 {
  color: #3498db;
  margin-bottom: 0.5rem;
}

.service-item p {
  color: #666;
  line-height: 1.6;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.contact-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.contact-item strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.contact-item p {
  color: #555;
  margin: 0;
  line-height: 1.6;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.benefits-list li {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 5px;
  color: #2c3e50;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .services-list,
  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>


