# Environment Configuration

Deze folder bevat alle environment variabelen voor verschillende omgevingen.

## Bestanden

- **`env.dev`** - Development environment variabelen (veilig om te committen)
- **`env.prod.example`** - Template voor productie environment variabelen

## Gebruik

### Development
```bash
docker compose --env-file env/env.dev up -d
```

### Production
```bash
# 1. Kopieer template
cp env.prod.example .env.prod

# 2. Vul productie waarden in
nano .env.prod

# 3. Start productie
docker compose --env-file env/.env.prod up -d
```

## ⚠️ Belangrijk

- **NOOIT** commit `.env.prod` naar version control
- De `.env.prod` file wordt automatisch uitgesloten via `.gitignore`
- Gebruik sterke wachtwoorden en secrets voor productie
