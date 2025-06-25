cms-help:
	@echo "CMS (Strapi) Commands:"
	@echo "  develop     - Start Strapi in watch mode (auto-restart on changes)"
	@echo "                npm run develop"
	@echo ""
	@echo "  start       - Start Strapi without watch mode"
	@echo "                npm run start"
	@echo ""
	@echo "  build       - Build Strapi admin panel"
	@echo "                npm run build"
	@echo ""
	@echo "  deploy      - Deploy Strapi project"
	@echo "                npm run deploy"
	@echo ""
	@echo "  seed        - Seed the database with sample data"
	@echo "                npm run seed:example"
	@echo ""
	@echo "  list        - Display all available Strapi commands"
	@echo "                npm run strapi"
	@echo ""
	@echo "To get started:"
	@echo "  cd services/server"
	@echo "  npm run develop"

#backend-help:
#
#frontend-help:

#DB
## Основные команды
up:
	docker-compose up -d --build

build-up-python:
	docker-compose build $(SERVICE)
	docker-compose up -d --no-deps $(SERVICE)

down:
	docker-compose down -v

restart: down up

## Команды мониторинга
ps:
	docker-compose ps

logs:
	docker-compose logs -f

logs-python:
	docker-compose logs -f $(SERVICE)

tg_logs:
	docker logs $(SERVICE)

## Очистка
clean:
	docker-compose down --rmi all --volumes --remove-orphans

## Доступ к оболочке
app-shell:
	docker-compose exec $(SERVICE_NAME) bash

postgres-shell:
	docker-compose exec postgres bash

shell:
	docker-compose exec $(SERVICE_NAME) bash

## Тестирование
test:
	docker-compose exec $(SERVICE_NAME) pytest

## Утилиты
work_result:
	find src -name '*.py' | xargs wc -l

docker-ip:
	docker inspect postgres | grep "IPAddress"