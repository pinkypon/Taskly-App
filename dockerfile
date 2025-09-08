FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
  libpq-dev \
  libzip-dev \
  zip \
  nodejs \
  npm \
  && docker-php-ext-install pdo_pgsql zip \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy dependency files first for better caching
COPY composer.json composer.lock package*.json ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts
RUN npm install

# Copy the rest of the application
COPY . .

# Complete Composer install and build frontend
RUN composer dump-autoload --optimize
RUN npm run build

# Create necessary directories and set permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Copy and make start script executable
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose port
EXPOSE ${PORT:-10000}

# Start the application
CMD ["/usr/local/bin/start.sh"]