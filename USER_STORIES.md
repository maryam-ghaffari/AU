# User Stories - Bil- och Däckfirma

## Ytterligare User Stories

### User Story 1: E-postbekräftelse och påminnelser

**Som en** kund  
**Vill jag** få e-postbekräftelse när jag bokar en service och påminnelser innan min bokning  
**Så att** jag kan bekräfta att bokningen är registrerad och inte glömma min service

**Acceptanskriterier:**
- När en bokning skapas skickas automatiskt en bekräftelse via e-post till kunden
- E-postbekräftelsen innehåller:
  - Bokningsnummer
  - Datum och tid för service
  - Typ av service
  - Registreringsnummer
  - Kontaktinformation till firman
- En påminnelse skickas automatiskt 24 timmar innan den planerade servicen
- Påminnelsen innehåller:
  - Datum och tid för service
  - Typ av service
  - Möjlighet att ändra eller avboka bokningen
- Kunden kan välja att avaktivera påminnelser i sina inställningar

**Prioritet:** Hög  
**Estimerad tid:** 8 timmar

---

### User Story 2: Servicehistorik per fordon

**Som en** kund  
**Vill jag** kunna se alla tidigare service som utförts på mitt fordon  
**Så att** jag kan hålla koll på servicehistoriken och planera framtida service

**Acceptanskriterier:**
- Kunden kan söka efter servicehistorik genom att ange registreringsnummer
- Systemet visar alla tidigare service för det angivna registreringsnumret
- För varje service visas:
  - Datum och tid när servicen utfördes
  - Typ av service
  - Status (avslutad/pågående/avbokad)
  - Utförda åtgärder/anteckningar
  - Kostnad (om tillgänglig)
- Servicehistoriken sorteras kronologiskt (nyaste först)
- Kunden kan filtrera historiken efter:
  - Datumintervall
  - Typ av service
  - Status
- Historiken kan visas både i listvy och kalendervy

**Prioritet:** Medel  
**Estimerad tid:** 6 timmar

---

### User Story 3: Export av bokningar

**Som en** kund eller administratör  
**Vill jag** kunna exportera bokningar till PDF eller Excel  
**Så att** jag kan spara och administrera bokningar utanför systemet

**Acceptanskriterier:**
- Det finns en "Exportera"-knapp på sidan "Mina Bokningar"
- Användaren kan välja att exportera:
  - Alla bokningar
  - Filtrerade bokningar (baserat på aktuella filter)
  - Valda bokningar (checkbox-val)
- Exportformat:
  - PDF: Formaterad rapport med bokningsinformation
  - Excel/CSV: Strukturerad data som kan öppnas i Excel
- Exporterade filer innehåller:
  - Bokningsnummer
  - Kundinformation (namn, e-post, telefon)
  - Registreringsnummer
  - Serviceinformation (typ, datum, tid)
  - Status
  - Utförda åtgärder (om tillgängligt)
- PDF-exporten inkluderar:
  - Företagslogotyp och kontaktinformation
  - Professionell formatering
  - Datum och tidpunkt för export
- Excel/CSV-exporten inkluderar:
  - Kolumner för alla relevanta fält
  - Formaterade datum och tider
  - Möjlighet att sortera och filtrera i Excel

**Prioritet:** Låg  
**Estimerad tid:** 10 timmar

---

## Sammanfattning

Dessa tre user stories kompletterar de befintliga funktionerna genom att:
1. **Förbättra kommunikation** med kunder via e-postbekräftelser och påminnelser
2. **Ge kunder bättre översikt** över sin fordonsservicehistorik
3. **Erbjuda flexibilitet** genom möjlighet att exportera data för extern administration

Alla tre user stories är relevanta för en modern servicebokningsapplikation och skulle öka användarvärdet av systemet.

