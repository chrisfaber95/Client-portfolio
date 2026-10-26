# Coop Lubbers Online

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Draaien met Docker

```
docker compose up -d --build
```

De app wordt gebouwd en door nginx geserveerd op poort 8107. nginx stuurt `/api/` door naar de server
(`Visualshopping-Server`, variabele `API_UPSTREAM` in `docker-compose.yml`). Zo staan app en API op één adres, en
werken de productfoto's (`/api/back-images/...`) zonder ander domein. De poort is aan het Tailscale-adres van de
homelab gebonden; lokaal kun je die veranderen in `"127.0.0.1:8107:80"`, met `API_UPSTREAM` naar je eigen server.
