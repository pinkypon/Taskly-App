#!/bin/bash
set -e

export PORT=${PORT:-10000}
echo "Starting Laravel on port $PORT..."

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --no-interaction
fi

# Cache Laravel configurations
echo "Caching Laravel configurations..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force --no-interaction || echo "Migration failed, continuing..."

echo "Starting PHP built-in server on 0.0.0.0:$PORT"
exec php artisan serve --host=0.0.0.0 --port=$PORT