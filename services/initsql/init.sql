SELECT 'CREATE DATABASE strapi'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'strapi')\gexec

GRANT ALL PRIVILEGES ON DATABASE strapi TO wg_forge;