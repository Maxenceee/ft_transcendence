SERVER_DIR	=	srcs/website
NAME		=	docker_django
FORWARDPORT	=	8000

GREEN			=	\033[1;32m
BLUE			=	\033[1;34m
RED				=	\033[1;31m
YELLOW			=	\033[1;33m
DEFAULT			=	\033[0m

all: down up

debug: all
	@docker logs docker_django -f

up:
	@printf "$(GREEN)Building and running the container...$(DEFAULT)\n"
	@mkdir -p ./data
	@mkdir -p ./data/postgres
	@docker compose up -d
	@printf "$(GREEN)The server is running on http://localhost:$(FORWARDPORT)\n"

re: clean up

down:
	@printf "$(RED)Stopping and removing the container...$(DEFAULT)\n"
	@docker compose down --rmi all
	@printf "$(BLUE)The container has been removed\n"

clean: down
	@printf "$(RED)Cleaning docker...$(DEFAULT)\n"
	@docker system prune -af --volumes
	@docker builder prune -af
	@printf "$(BLUE)Docker has been cleaned\n"

fclean: clean
	@printf "$(RED)Cleaning data...$(DEFAULT)\n"
	@rm -rf data
	@-docker volume rm $(shell docker volume ls -q)
	@printf "$(BLUE)Data has been cleaned\n"

.PHONY: all up re clean