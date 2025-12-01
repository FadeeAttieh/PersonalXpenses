# 💾 Backup & Restore Guide

Complete guide for backing up and restoring your Personal Finance application.

---

## 📋 Table of Contents

1. [Quick Backup](#quick-backup)
2. [Full System Backup](#full-system-backup)
3. [Database-Only Backup](#database-only-backup)
4. [Restore Operations](#restore-operations)
5. [Automated Backup Scripts](#automated-backup-scripts)
6. [Best Practices](#best-practices)

---

## 🚀 Quick Backup

### Create a Complete Backup (Recommended)

```bash
# Create timestamped backup of all files
cd /workspaces/personal_finance
mkdir -p backups/backup_$(date +%Y%m%d_%H%M%S)
cp -r Public/ controllers/ models/ routes/ middleware/ migrations/ seeders/ validation/ config/ *.js *.json *.html *.md *.txt docker-compose.yml backups/backup_$(date +%Y%m%d_%H%M%S)/

# Verify backup was created
ls -lh backups/
```

### List All Backups

```bash
# Show all available backups with timestamps
ls -lh /workspaces/personal_finance/backups/

# Show backup sizes
du -sh /workspaces/personal_finance/backups/*
```

---

## 📦 Full System Backup

### 1. Complete Application Backup

```bash
cd /workspaces/personal_finance

# Create backup directory with timestamp
BACKUP_DIR="backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Copy all application files
cp -r Public/ "$BACKUP_DIR/"
cp -r controllers/ "$BACKUP_DIR/"
cp -r models/ "$BACKUP_DIR/"
cp -r routes/ "$BACKUP_DIR/"
cp -r middleware/ "$BACKUP_DIR/"
cp -r migrations/ "$BACKUP_DIR/"
cp -r seeders/ "$BACKUP_DIR/"
cp -r validation/ "$BACKUP_DIR/"
cp -r config/ "$BACKUP_DIR/"
cp *.js "$BACKUP_DIR/" 2>/dev/null || true
cp *.json "$BACKUP_DIR/" 2>/dev/null || true
cp *.html "$BACKUP_DIR/" 2>/dev/null || true
cp *.md "$BACKUP_DIR/" 2>/dev/null || true
cp *.txt "$BACKUP_DIR/" 2>/dev/null || true
cp docker-compose.yml "$BACKUP_DIR/"

echo "✅ Backup created at: $BACKUP_DIR"
```

### 2. Backup with Database Export

```bash
# Stop the application
docker compose stop app

# Create backup directory
BACKUP_DIR="backups/full_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Copy all application files
cp -r Public/ controllers/ models/ routes/ middleware/ migrations/ seeders/ validation/ config/ *.js *.json *.html *.md *.txt docker-compose.yml "$BACKUP_DIR/"

# Export database
docker compose exec -T db pg_dump -U codespace personal_finance_db > "$BACKUP_DIR/database_backup.sql"

# Create backup info file
echo "Backup created: $(date)" > "$BACKUP_DIR/backup_info.txt"
echo "Database: personal_finance_db" >> "$BACKUP_DIR/backup_info.txt"
echo "User: codespace" >> "$BACKUP_DIR/backup_info.txt"

# Restart application
docker compose start app

echo "✅ Full backup with database created at: $BACKUP_DIR"
```

### 3. Compressed Backup (Save Space)

```bash
cd /workspaces/personal_finance

# Create backup and compress it
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "backups/$BACKUP_NAME"
cp -r Public/ controllers/ models/ routes/ middleware/ migrations/ seeders/ validation/ config/ *.js *.json *.html *.md *.txt docker-compose.yml "backups/$BACKUP_NAME/"

# Compress the backup
tar -czf "backups/${BACKUP_NAME}.tar.gz" -C backups "$BACKUP_NAME"

# Remove uncompressed backup
rm -rf "backups/$BACKUP_NAME"

echo "✅ Compressed backup created: backups/${BACKUP_NAME}.tar.gz"
ls -lh "backups/${BACKUP_NAME}.tar.gz"
```

---

## 🗄️ Database-Only Backup

### Export Database to SQL File

```bash
# Create database backup directory
mkdir -p /workspaces/personal_finance/backups/db_backups

# Export entire database
docker compose exec -T db pg_dump -U codespace personal_finance_db > backups/db_backups/db_backup_$(date +%Y%m%d_%H%M%S).sql

echo "✅ Database backup created"
```

### Export Specific Tables

```bash
# Backup only Entries table
docker compose exec -T db pg_dump -U codespace -t Entries personal_finance_db > backups/db_backups/entries_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup only Balances table
docker compose exec -T db pg_dump -U codespace -t Balances personal_finance_db > backups/db_backups/balances_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Export Database Schema Only (No Data)

```bash
# Export schema without data
docker compose exec -T db pg_dump -U codespace --schema-only personal_finance_db > backups/db_backups/schema_$(date +%Y%m%d_%H%M%S).sql
```

### Export Data Only (No Schema)

```bash
# Export data without schema
docker compose exec -T db pg_dump -U codespace --data-only personal_finance_db > backups/db_backups/data_$(date +%Y%m%d_%H%M%S).sql
```

---

## 🔄 Restore Operations

### 1. Restore Complete Application Files

```bash
# List available backups
ls -lh /workspaces/personal_finance/backups/

# Restore from specific backup (replace YYYYMMDD_HHMMSS with your backup timestamp)
cd /workspaces/personal_finance
BACKUP_TO_RESTORE="backup_20251129_054110"  # Change this to your backup name

# Stop the application
docker compose down

# Restore all files
cp -r backups/$BACKUP_TO_RESTORE/* .

# Restart application
docker compose up -d

echo "✅ Application restored from: $BACKUP_TO_RESTORE"
```

### 2. Restore Specific Folders Only

```bash
# Restore only Public folder (frontend)
cp -r backups/backup_20251129_054110/Public /workspaces/personal_finance/

# Restore only controllers
cp -r backups/backup_20251129_054110/controllers /workspaces/personal_finance/

# Restore only models
cp -r backups/backup_20251129_054110/models /workspaces/personal_finance/

# Restart after restore
docker compose restart app
```

### 3. Restore Database from SQL Backup

```bash
# Stop application
docker compose stop app

# Drop and recreate database (⚠️ WARNING: This deletes all current data!)
docker compose exec db psql -U codespace -c 'DROP DATABASE IF EXISTS personal_finance_db;'
docker compose exec db psql -U codespace -c 'CREATE DATABASE personal_finance_db;'

# Restore database from backup file
docker compose exec -T db psql -U codespace personal_finance_db < backups/db_backups/db_backup_20251129_054110.sql

# Restart application
docker compose start app

echo "✅ Database restored"
```

### 4. Restore from Compressed Backup

```bash
cd /workspaces/personal_finance

# List compressed backups
ls -lh backups/*.tar.gz

# Extract compressed backup
tar -xzf backups/backup_20251129_054110.tar.gz -C backups/

# Restore from extracted backup
docker compose down
cp -r backups/backup_20251129_054110/* .
docker compose up -d

echo "✅ Restored from compressed backup"
```

### 5. Restore Specific Database Table

```bash
# Restore only Entries table from backup
docker compose exec -T db psql -U codespace personal_finance_db < backups/db_backups/entries_backup_20251129_054110.sql

echo "✅ Entries table restored"
```

---

## 🤖 Automated Backup Scripts

### Create Backup Script

```bash
# Create backup script file
cat > /workspaces/personal_finance/scripts/backup.sh << 'EOF'
#!/bin/bash
# Automated Backup Script for Personal Finance App

# Set variables
PROJECT_DIR="/workspaces/personal_finance"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$TIMESTAMP"

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

# Copy application files
echo "📦 Backing up application files..."
cp -r "$PROJECT_DIR/Public" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/controllers" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/models" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/routes" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/middleware" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/migrations" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/seeders" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/validation" "$BACKUP_DIR/$BACKUP_NAME/"
cp -r "$PROJECT_DIR/config" "$BACKUP_DIR/$BACKUP_NAME/"
cp "$PROJECT_DIR"/*.js "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
cp "$PROJECT_DIR"/*.json "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
cp "$PROJECT_DIR"/*.md "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
cp "$PROJECT_DIR/docker-compose.yml" "$BACKUP_DIR/$BACKUP_NAME/"

# Export database
echo "🗄️  Backing up database..."
cd "$PROJECT_DIR"
docker compose exec -T db pg_dump -U codespace personal_finance_db > "$BACKUP_DIR/$BACKUP_NAME/database_backup.sql"

# Create backup info
echo "Backup created: $(date)" > "$BACKUP_DIR/$BACKUP_NAME/backup_info.txt"
echo "Database: personal_finance_db" >> "$BACKUP_DIR/$BACKUP_NAME/backup_info.txt"

# Compress backup
echo "🗜️  Compressing backup..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

# Clean old backups (keep last 10)
echo "🧹 Cleaning old backups..."
cd "$BACKUP_DIR"
ls -t backup_*.tar.gz | tail -n +11 | xargs -r rm

echo "✅ Backup completed: ${BACKUP_NAME}.tar.gz"
ls -lh "$BACKUP_DIR/${BACKUP_NAME}.tar.gz"
EOF

# Make script executable
chmod +x /workspaces/personal_finance/scripts/backup.sh

echo "✅ Backup script created at: /workspaces/personal_finance/scripts/backup.sh"
```

### Run Backup Script

```bash
# Create scripts directory if it doesn't exist
mkdir -p /workspaces/personal_finance/scripts

# Run the backup script
/workspaces/personal_finance/scripts/backup.sh
```

### Create Restore Script

```bash
# Create restore script
cat > /workspaces/personal_finance/scripts/restore.sh << 'EOF'
#!/bin/bash
# Automated Restore Script for Personal Finance App

# Check if backup name provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide backup name"
    echo "Usage: ./restore.sh backup_20251129_054110"
    echo ""
    echo "Available backups:"
    ls -1 /workspaces/personal_finance/backups/*.tar.gz | xargs -n 1 basename
    exit 1
fi

PROJECT_DIR="/workspaces/personal_finance"
BACKUP_DIR="$PROJECT_DIR/backups"
BACKUP_NAME="$1"
BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.tar.gz"

# Check if backup exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Confirm restore
echo "⚠️  WARNING: This will replace all current files and database!"
echo "Restoring from: $BACKUP_NAME"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 0
fi

# Stop application
echo "🛑 Stopping application..."
cd "$PROJECT_DIR"
docker compose down

# Extract backup
echo "📦 Extracting backup..."
tar -xzf "$BACKUP_FILE" -C "$BACKUP_DIR"

# Restore files
echo "📁 Restoring application files..."
cp -r "$BACKUP_DIR/$BACKUP_NAME"/* "$PROJECT_DIR/"

# Restore database if backup exists
if [ -f "$BACKUP_DIR/$BACKUP_NAME/database_backup.sql" ]; then
    echo "🗄️  Restoring database..."
    docker compose up -d db
    sleep 3
    docker compose exec db psql -U codespace -c 'DROP DATABASE IF EXISTS personal_finance_db;'
    docker compose exec db psql -U codespace -c 'CREATE DATABASE personal_finance_db;'
    docker compose exec -T db psql -U codespace personal_finance_db < "$BACKUP_DIR/$BACKUP_NAME/database_backup.sql"
fi

# Restart application
echo "🚀 Starting application..."
docker compose up -d

# Cleanup extracted backup
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

echo "✅ Restore completed successfully!"
EOF

# Make script executable
chmod +x /workspaces/personal_finance/scripts/restore.sh

echo "✅ Restore script created at: /workspaces/personal_finance/scripts/restore.sh"
```

### Run Restore Script

```bash
# List available backups
ls -1 /workspaces/personal_finance/backups/*.tar.gz | xargs -n 1 basename

# Restore from specific backup (without .tar.gz extension)
/workspaces/personal_finance/scripts/restore.sh backup_20251129_054110
```

---

## 📝 Best Practices

### 1. Regular Backup Schedule

```bash
# Daily backup (add to cron or run manually)
/workspaces/personal_finance/scripts/backup.sh

# Weekly backup with different naming
BACKUP_DIR="backups/weekly_backup_$(date +%Y%m%d)"
```

### 2. Verify Backup Integrity

```bash
# Check backup file exists and is not empty
BACKUP_FILE="backups/backup_20251129_054110.tar.gz"
if [ -s "$BACKUP_FILE" ]; then
    echo "✅ Backup file is valid"
    ls -lh "$BACKUP_FILE"
else
    echo "❌ Backup file is empty or missing"
fi

# Test compressed backup can be extracted
tar -tzf "$BACKUP_FILE" > /dev/null && echo "✅ Backup archive is valid" || echo "❌ Backup archive is corrupted"
```

### 3. Clean Old Backups

```bash
# Keep only last 10 backups
cd /workspaces/personal_finance/backups
ls -t backup_*.tar.gz | tail -n +11 | xargs -r rm
echo "✅ Old backups cleaned, kept last 10"

# Keep only last 30 days of backups
find /workspaces/personal_finance/backups -name "backup_*.tar.gz" -mtime +30 -delete
echo "✅ Backups older than 30 days deleted"
```

### 4. Backup Before Major Changes

```bash
# Create backup before updating code
echo "Creating safety backup before changes..."
/workspaces/personal_finance/scripts/backup.sh
echo "✅ Safe to proceed with changes"
```

### 5. Export Backup to External Location

```bash
# Copy backup to external drive or cloud
BACKUP_FILE="backups/backup_20251129_054110.tar.gz"

# Example: Copy to home directory
cp "$BACKUP_FILE" ~/personal_finance_backup_$(date +%Y%m%d).tar.gz

# Example: Copy to mounted drive
# cp "$BACKUP_FILE" /mnt/external/backups/

echo "✅ Backup copied to external location"
```

---

## 🆘 Emergency Recovery

### Complete System Recovery

```bash
# 1. Stop everything
docker compose down

# 2. List available backups
ls -lh /workspaces/personal_finance/backups/

# 3. Extract latest backup
cd /workspaces/personal_finance
LATEST_BACKUP=$(ls -t backups/backup_*.tar.gz | head -1)
echo "Restoring from: $LATEST_BACKUP"
tar -xzf "$LATEST_BACKUP" -C backups/

# 4. Get backup folder name
BACKUP_FOLDER=$(tar -tzf "$LATEST_BACKUP" | head -1 | cut -f1 -d"/")

# 5. Restore everything
cp -r "backups/$BACKUP_FOLDER"/* .

# 6. Restore database if exists
if [ -f "backups/$BACKUP_FOLDER/database_backup.sql" ]; then
    docker compose up -d db
    sleep 3
    docker compose exec db psql -U codespace -c 'DROP DATABASE IF EXISTS personal_finance_db;'
    docker compose exec db psql -U codespace -c 'CREATE DATABASE personal_finance_db;'
    docker compose exec -T db psql -U codespace personal_finance_db < "backups/$BACKUP_FOLDER/database_backup.sql"
fi

# 7. Restart everything
docker compose up -d

echo "✅ Emergency recovery completed!"
```

---

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| Quick backup | `mkdir -p backups/backup_$(date +%Y%m%d_%H%M%S) && cp -r Public/ controllers/ models/ routes/ middleware/ migrations/ seeders/ validation/ config/ *.js *.json *.html *.md *.txt docker-compose.yml backups/backup_$(date +%Y%m%d_%H%M%S)/` |
| List backups | `ls -lh backups/` |
| Restore files | `cp -r backups/backup_YYYYMMDD_HHMMSS/* .` |
| Export DB | `docker compose exec -T db pg_dump -U codespace personal_finance_db > backup.sql` |
| Restore DB | `docker compose exec -T db psql -U codespace personal_finance_db < backup.sql` |
| Clean old backups | `ls -t backups/backup_*.tar.gz \| tail -n +11 \| xargs -r rm` |

---

## 🎯 Tips

- ✅ Always test restoring from backups periodically
- ✅ Keep backups in multiple locations (local + cloud)
- ✅ Document what's included in each backup
- ✅ Automate backups before deployments
- ✅ Verify backup integrity after creation
- ⚠️ Never delete backups without testing newer ones first
- ⚠️ Keep at least 3 recent backups at all times

---

**Last Updated:** November 29, 2025
