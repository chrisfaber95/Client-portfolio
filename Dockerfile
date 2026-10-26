FROM node:18.20.8-bookworm AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Leeg = zelfde adres als de app (nginx stuurt /api/ door naar de server). VUE_APP_* komt in de gebouwde JavaScript.
ARG VUE_APP_API=/
ARG VUE_APP_PUBLIC_API_KEY=
ARG VUE_APP_BAGEAN=
ARG VUE_APP_BAGAMOUNT=
RUN VUE_APP_API=$VUE_APP_API VUE_APP_PUBLIC_API_KEY=$VUE_APP_PUBLIC_API_KEY \
    VUE_APP_BAGEAN=$VUE_APP_BAGEAN VUE_APP_BAGAMOUNT=$VUE_APP_BAGAMOUNT npm run build

FROM nginx:1.27.3-alpine
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
