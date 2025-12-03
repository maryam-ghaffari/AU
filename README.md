# Bil- och Däckfirma - Service Booking System

En Vue.js-applikation för att hantera servicebokningar för en bil- och däckfirma.

## Funktioner

- **Startsida och navigation**: Meny med Hem, Boka Service, Mina Bokningar och Om Oss
- **Boka Service**: 
  - Välj datum och tid från kalender
  - Ange kundinformation (namn, e-post, telefon, registreringsnummer)
  - Välj typ av service (Oljebyte, Bromsjustering, Full service, Däckbyte)
  - Visa lediga tider i kalendern
- **Mina Bokningar**:
  - Visa alla bokningar
  - Sök efter bokningar (regnr, e-post, namn, boknings-ID)
  - Filtrera efter datum och status
  - Ändra bokningar
  - Avboka bokningar
  - Markera bokningar som pågående eller avslutade
  - Spara utförda åtgärder för historik
- **Om Oss**: Information om företaget och kontaktuppgifter

## Installation

1. Installera beroenden:
```bash
npm install
```

## Kör applikationen

För utveckling:
```bash
npm run dev
```

Applikationen kommer att öppnas på `http://localhost:3000`

För produktion:
```bash
npm run build
npm run preview
```

## Projektstruktur

```
├── data/
│   ├── bookings.json      # Bokningsdata
│   └── services.json      # Serviceinformation
├── src/
│   ├── views/
│   │   ├── Home.vue       # Startsida
│   │   ├── BookService.vue # Boka service-sida
│   │   ├── MyBookings.vue # Mina bokningar-sida
│   │   └── AboutUs.vue    # Om oss-sida
│   ├── router/
│   │   └── index.js       # Vue Router konfiguration
│   ├── App.vue            # Huvudkomponent
│   └── main.js            # Applikationsentry
├── index.html
├── package.json
└── vite.config.js
```

## Teknologier

- Vue 3
- Vue Router 4
- Vite
- JavaScript (ES6+)

## Datahantering

Bokningar laddas från `data/bookings.json`. När en ny bokning skapas, visas ett meddelande till användaren att bokningen har sparats. I en riktig applikation skulle detta sparas till en backend-server eller databas.

## Användning

1. **Boka en service**: Gå till "Boka Service", fyll i formuläret och välj ett ledigt datum och tid.
2. **Visa bokningar**: Gå till "Mina Bokningar" för att se alla bokningar.
3. **Sök och filtrera**: Använd sökfältet för att söka efter specifika bokningar eller använd filter för att filtrera efter datum eller status.
4. **Hantera bokningar**: Klicka på "Ändra", "Avboka", "Markera som pågående" eller "Markera som avslutad" för att hantera bokningar.


