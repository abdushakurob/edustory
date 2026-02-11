# Deployment Guide - StoryMind AI

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Prisma client generated
- [ ] Build passes without errors
- [ ] All API keys valid

## Environment Variables Checklist

Copy and configure these in your deployment platform:

```
DATABASE_URL=postgresql://user:password@host:port/storymind
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<min-32-char-random-string>
SESSION_SECRET=<min-32-char-random-string>
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=<your-gemini-api-key>
NODE_ENV=production
```

## Vercel Deployment

### 1. Connect Repository
```bash
git push origin main
# Then connect via Vercel dashboard
```

### 2. Configure Environment
In Vercel Dashboard > Settings > Environment Variables:
- Add all variables from .env.local

### 3. Database Setup
```bash
# Connect PostgreSQL (use Vercel Postgres or external)
# Update DATABASE_URL in environment variables

# Run migrations
npm run prisma:migrate
```

### 4. Deploy
- Vercel auto-deploys on push
- Verify health at your-domain.com

## Render.com Deployment

### 1. Create PostgreSQL Database
- Go to Render Dashboard
- Create new PostgreSQL database
- Copy connection string

### 2. Create Web Service
- Connect GitHub repository
- Select Node environment
- Set environment variables
- Build command: `npm run build`
- Start command: `npm run start`

### 3. Deploy
```bash
git push origin main
```

## Railway.app Deployment

### 1. Link Project
```bash
railway init
railway link <project-id>
```

### 2. Configure Database
```bash
railway add postgres
```

### 3. Set Environment Variables
```bash
railway variables set NEXTAUTH_URL=https://your-domain.railway.app
railway variables set NEXTAUTH_SECRET=<min-32-char-string>
railway variables set NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=<api-key>
```

### 4. Deploy
```bash
railway up
```

## AWS EC2 Deployment

### 1. Launch EC2 Instance
- Ubuntu 22.04 LTS
- Minimum: t3.micro
- Security group: Allow 80, 443, 22

### 2. Install Dependencies
```bash
sudo apt update && sudo apt upgrade -y
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs postgresql-client -y
```

### 3. Clone & Setup
```bash
git clone <your-repo>
cd edustory
npm install
```

### 4. Configure Database
```bash
# Use RDS for PostgreSQL or install locally
# Update DATABASE_URL
```

### 5. Environment Setup
```bash
cp .env.example .env.local
# Edit with production values
```

### 6. Build & Run
```bash
npm run build
npm run start
```

### 7. Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Database Backup Strategy

### Automated Backups
- Enable automated backups in PostgreSQL provider
- Retention: Minimum 7 days

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Monitoring & Logs

### Vercel
- Dashboard > Deployments > Logs
- Real-time logs visible

### AWS CloudWatch
```bash
# View application logs
aws logs tail /aws/ec2/storymind --follow
```

### Railway
- Dashboard > Logs tab
- Real-time streaming

## Performance Optimization

### 1. Database
- Enable connection pooling
- Add indexes on frequently queried columns
- Archive old quiz attempts

### 2. Caching
- Cache story generation results
- Use CDN for uploads (CloudFront, Cloudflare)
- Browser caching for static assets

### 3. Scaling
- **Horizontal**: Add load balancer, multiple instances
- **Vertical**: Upgrade to larger instance type
- **Database**: Use read replicas for heavy queries

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Error
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Prisma Client Missing
```bash
npx prisma generate
```

### 500 Errors on API
1. Check server logs
2. Verify environment variables
3. Check database is accessible
4. Verify Gemini API key is valid

## Post-Deployment

### Health Check
```bash
curl https://your-domain.com/api/auth/login
# Should return 404 or redirect (not 500)
```

### Database Verification
```bash
npx prisma studio
# Should connect and load data
```

### Test User Flow
1. Register account
2. Create subject
3. Upload document
4. Generate story
5. Generate questions

## Rollback Plan

### Quick Rollback (Vercel)
- Go to Deployments
- Click previous deployment
- Click "Promote to Production"

### Database Rollback
```bash
# Revert last migration
npx prisma migrate resolve --rolled-back <migration-name>
```

## Monitoring Checklist

- [ ] Set up error tracking (Sentry)
- [ ] Enable database monitoring
- [ ] Set up uptime monitoring
- [ ] Configure email alerts
- [ ] Track API performance
- [ ] Monitor file upload volumes

---

**Production Ready! ✨**
