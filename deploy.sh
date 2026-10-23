#!/usr/bin/env bash
# ==============================================================================
# SALVI FRONTEND - Production Deployment Script
# ==============================================================================
set -e

PROJECT_DIR="/var/www/salvi/www"
BACKUP_DIR="/var/www/salvi/auto-deployment-backup"
BRANCH="${DEPLOY_BRANCH:-main}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "=== Начинаем деплой SALVI Frontend ==="

cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log "ОШИБКА: Деплой фронтенда завершился со сбоем (код $exit_code)."
        # Если была подготовлена dist_old, возвращаем ее на случай сломанного билда
        if [ -d "$PROJECT_DIR/dist_old" ] && [ ! -d "$PROJECT_DIR/dist" ]; then
            log "Восстанавливаем предыдущую сборку dist_old..."
            mv "$PROJECT_DIR/dist_old" "$PROJECT_DIR/dist" 2>/dev/null || true
        fi
        rm -rf "$PROJECT_DIR/dist_new" 2>/dev/null || true
    fi

    # Гарантированно выставляем корректного владельца
    log "Восстанавливаем права доступа salvi:salvi..."
    chown -R salvi:salvi "$PROJECT_DIR" 2>/dev/null || true

    if [ $exit_code -eq 0 ]; then
        log "=== Деплой SALVI Frontend успешно завершен! ==="
    else
        log "=== Деплой фронтенда завершился с ошибкой! ==="
    fi
}
trap cleanup EXIT

cd "$PROJECT_DIR"

# 1. Создаем резервную копию текущей версии
log "1. Создаем резервную копию..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/salvi_front_$(date +%F_%H-%M-%S).tar.gz"

# Используем многопоточный pigz (2 ядра), если установлен, иначе обычный gzip
if command -v pigz >/dev/null 2>&1; then
    COMPRESSOR="pigz -p 2"
    tar -cpf - --exclude='node_modules' --exclude='.git' "$PROJECT_DIR" 2>/dev/null | pigz -p 2 > "$BACKUP_FILE"
else
    COMPRESSOR="gzip"
    tar -cpf - --exclude='node_modules' --exclude='.git' "$PROJECT_DIR" 2>/dev/null | gzip > "$BACKUP_FILE"
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" 2>/dev/null | cut -f1)
log "Бэкап сохранен ($COMPRESSOR, размер: ${BACKUP_SIZE:-0}): $BACKUP_FILE"

# Удаляем старые бэкапы фронтенда, оставляя только свежесозданный
if [ -s "$BACKUP_FILE" ]; then
    log "Удаляем старые бэкапы salvi_front, оставляя только текущий..."
    find "$BACKUP_DIR" -maxdepth 1 -type f -name "salvi_front_*.tar.gz" ! -name "$(basename "$BACKUP_FILE")" -exec rm -f {} + 2>/dev/null || true
fi

# 2. Подтягиваем свежий код из Git
log "2. Обновляем кодовую базу Git (ветка: $BRANCH)..."
git fetch --all
git reset --hard "origin/$BRANCH"
git pull origin "$BRANCH"

# Очистка мусорных файлов IDE
find . -type d \( -name '.idea' -o -name '.vscode' \) -exec rm -rf {} + 2>/dev/null || true
git remote set-url origin git@github.com:salvillc/salvi-backend.git  salvillc
# 3. Устанавливаем зависимости npm
log "3. Устанавливаем зависимости (npm ci)..."
npm ci

# 4. Собираем SPA-приложение во временную папку dist_new
log "4. Собираем проект (npm run build)..."
rm -rf dist_new
npm run build -- --dest dist_new

# 5. Атомарно подменяем dist на свежую сборку без простоя сайта
log "5. Атомарно переключаем dist..."
rm -rf dist_old
if [ -d dist ]; then
    mv dist dist_old
fi
mv dist_new dist
rm -rf dist_old

log "Сборка успешно переключена!"
