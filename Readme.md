# Vue Live Matches

## 📖 Opis
Aplikacija prikazuje uživo sportske mečeve sa dinamičkim osvežavanjem podataka sa API-ja.

## ⚙️ Tehnologije
- Vue 3 (Composition API)
- Axios (za API pozive)
- CSS animacije za isticanje novih i uklonjenih mečeva

## 🚀 Instalacija i pokretanje

1. Klonirajte repozitorijum:
   ```bash
   git clone https://github.com/yourusername/vue-live-matches.git
   cd vue-live-matches
   ```

2. Instalirajte potrebne pakete:
   ```bash
   npm install
   ```

3. Pokrenite aplikaciju:
   ```bash
   npm run serve
   ```
4. Aplikacija će biti dostupna na http://localhost:8080

##API Endpoint
GET http://172.235.235.11/api/matches
Header: username: nikposao@gmail.com

📚 Korišćene biblioteke

Axios – za jednostavno rukovanje HTTP zahtevima

Vue CLI – za brzu konfiguraciju Vue okruženja

CSS Animations – za vizuelno isticanje promena

✨ Funkcionalnosti

Automatsko osvežavanje svakih 10 sekundi

Isticanje novih mečeva i uklanjanje nestalih

Prikaz osnovnih informacija o meču

## 📝 Korisničko interfejs

- Aplikacija prikazuje listu trenutno održavanih sportskih mečeva.
- Svaki meč ima naziv, vreme početka, timove i rezultat.