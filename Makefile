SERVER_DIR	=	srcs
NAME		=	django
FORWARDPORT	=	3000

GREEN			=	\033[1;32m
BLUE			=	\033[1;34m
RED				=	\033[1;31m
YELLOW			=	\033[1;33m
DEFAULT			=	\033[0m

all: up

debug: all
	@docker logs $(NAME) -f

up:
	@printf "$(GREEN)Building and running the container...$(DEFAULT)\n"
	@docker compose up -d --build
	@printf "$(GREEN)The server is running on http://localhost:$(FORWARDPORT)\n"

down:
	@printf "$(RED)Stopping and removing the container...$(DEFAULT)\n"
	@docker compose down --rmi all
	@printf "$(BLUE)The container has been removed\n"

re: down up

status:
	@docker ps -a

clean: down
	@printf "$(RED)Cleaning docker...$(DEFAULT)\n"
	@docker system prune -af --volumes
	@docker builder prune -af
	@printf "$(BLUE)Docker has been cleaned\n"

fclean: clean
	@printf "$(RED)Cleaning data...$(DEFAULT)\n"
	@./clean.sh
	@printf "$(BLUE)Data has been cleaned\n"

rmdata: down
	@printf "$(RED)Cleaning data...$(DEFAULT)\n"
	@./clean.sh
	@printf "$(BLUE)Data has been cleaned\n"

.PHONY: all up re clean