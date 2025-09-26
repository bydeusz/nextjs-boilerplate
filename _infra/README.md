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

#### Alle services (geïntegreerd)
```bash
# Start alle services (storage + CMS)
docker compose --env-file env/env.dev up -d

# Stop alle services
docker compose --env-file env/env.dev down
```

#### Alleen specifieke services
```bash
# Alleen storage
docker compose --env-file env/env.dev -f services/docker-storage.yml up -d

# Alleen CMS
docker compose --env-file env/env.dev -f services/docker-cms.yml up -d

# Alleen databases
docker compose --env-file env/env.dev -f services/docker-db.yml up -d

# Specifieke combinaties
docker compose --env-file env/env.dev -f services/docker-storage.yml -f services/docker-cms.yml up -d
docker compose --env-file env/env.dev -f services/docker-storage.yml -f services/docker-db.yml up -d
docker compose --env-file env/env.dev -f services/docker-cms.yml -f services/docker-db.yml up -d
```

### Production
```bash
# 1. Kopieer de template
cp env/env.prod.example env/.env.prod

# 2. Vul je productie waarden in
nano env/.env.prod

# 3. Start productie environment (alle services)
docker compose --env-file env/.env.prod up -d

# 4. Start alleen specifieke services (optioneel)
docker compose --env-file env/.env.prod -f services/docker-storage.yml up -d
docker compose --env-file env/.env.prod -f services/docker-cms.yml up -d
docker compose --env-file env/.env.prod -f services/docker-db.yml up -d
```

## Services

### Geïntegreerde Setup (docker-compose.yml)
- **Network**: Basis network configuratie
- **Include**: Alle services worden automatisch geladen

### Storage Service (services/docker-storage.yml)
- **MinIO**: Object storage voor bestanden

### CMS Service (services/docker-cms.yml)
- **MySQL**: Database server
- **WordPress**: Headless CMS
- **phpMyAdmin**: Database admin interface
- **wp-cli**: WordPress CLI tool
- **wp_setup**: WordPress setup automation

### Database Service (services/docker-db.yml)
- **PostgreSQL**: Relational database server
- **Qdrant**: Vector database for AI/ML applications

## Database URLs
De database URLs worden automatisch gegenereerd op basis van de environment variabelen:

### PostgreSQL
`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}`

### Qdrant
- **HTTP API**: `http://localhost:${QDRANT_PORT}`
- **gRPC API**: `localhost:${QDRANT_GRPC_PORT}`
- **API Key**: `${QDRANT_API_KEY}`
