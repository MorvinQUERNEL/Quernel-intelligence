# Backend Dockerfile - Symfony
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install \
    intl \
    opcache \
    zip \
    pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

WORKDIR /app

# Install dependencies first (better caching)
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copy source code
COPY . .

# Generate autoloader
RUN composer dump-autoload --optimize

# Expose Symfony server port
EXPOSE 8000

# Default command for development
CMD ["symfony", "server:start", "--port=8000", "--no-tls"]
