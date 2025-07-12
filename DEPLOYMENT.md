# Deployment Guide

## Environment Setup

This project supports both development and production environments with different configurations.

### Development Setup

For local development with Docker database:

```bash
# Quick setup
npm run setup:dev

# Manual setup
cp .env.development .env
./start-db.sh
npm install
npm run migration up
npm run dev
```

### Production Deployment

For production with remote Neon database:

```bash
# Quick deployment
npm run deploy:prod

# Manual deployment
cp .env.production .env
npm ci --only=production
npm run build
npm run migration up
npm start
```

## Environment Files

- `.env.development` - Local development with Docker PostgreSQL
- `.env.production` - Production with Neon cloud database
- `.env.example` - Template for new environments
- `.env` - Active environment (auto-generated, not in git)

## Database Configuration

### Development

- **Database**: Local Docker PostgreSQL container
- **Host**: localhost:5432
- **Data**: Includes seed data for testing

### Production

- **Database**: Neon cloud PostgreSQL
- **Host**: Remote Neon endpoint
- **SSL**: Required for security
- **Data**: Production data only

## Security Checklist for Production

- [ ] Update `SESSION_SECRET` in `.env.production`
- [ ] Set correct `CORS_ORIGIN` domain
- [ ] Verify `DATABASE_URL` with SSL enabled
- [ ] Enable `TRUST_PROXY` for load balancers
- [ ] Set `LOG_LEVEL` to 'info' or 'warn'
- [ ] Remove debug/development dependencies
