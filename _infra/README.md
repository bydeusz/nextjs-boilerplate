# Infrastructure Configuration

Deze folder bevat alle infrastructuur configuratie bestanden voor de applicatie.

## Environment Files

### Development
- `env/env.dev` - Development environment variabelen (veilig om te committen)
- Gebruik: `docker compose --env-file env/env.dev up -d`

### Production
- `env/env.prod.example` - Template voor productie environment variabelen
- **BELANGRIJK**: Kopieer dit bestand naar `env/.env.prod` en vul je productie waarden in
- **NOOIT** commit `env/.env.prod` naar version control!

## Gebruik

### Development
```bash
# Start development environment
docker compose --env-file env/env.dev up -d

# Stop development environment
docker compose down
```

### Production
```bash
# 1. Kopieer de template
cp env/env.prod.example env/.env.prod

# 2. Vul je productie waarden in
nano env/.env.prod

# 3. Start productie environment
docker compose --env-file env/.env.prod up -d
```

## Services

- **PostgreSQL**: Database server
- **MinIO**: Object storage voor bestanden

## Database URL
De database URL wordt automatisch gegenereerd op basis van de environment variabelen:
`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}`
