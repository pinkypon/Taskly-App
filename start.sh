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

# Function to start processes
start_processes() {
    # Start web server in background
    php artisan serve --host=0.0.0.0 --port=$PORT &
    WEB_PID=$!

    # Start queue worker in foreground
    php artisan queue:work --verbose --tries=3 --timeout=90
    QUEUE_EXIT=$?

    # If queue worker stops, kill the web server and restart both
    echo "Queue worker exited with code $QUEUE_EXIT. Restarting both processes..."
    kill $WEB_PID
}

# Loop to restart processes if they crash
while true; do
    start_processes
    sleep 1
done
