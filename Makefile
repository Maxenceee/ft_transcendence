# NAME		=	express-tmp
# FORWARDPORT	=	3004

# all: up

# up:
# 	cd srcs && \
# 	docker build -t $(NAME) . && \
# 	docker run -it -d -p $(FORWARDPORT):3000 --name $(NAME) $(NAME)

# re: clean up

# clean:
# 	-docker stop $(NAME)
# 	-docker rm $(NAME)
# 	-docker rmi $(NAME)

# .PHONY: all up re clean

NAME		=	docker_django
FORWARDPORT	=	8000

GREEN			=	\033[1;32m
BLUE			=	\033[1;34m
RED				=	\033[1;31m
YELLOW			=	\033[1;33m
DEFAULT			=	\033[0m
UP				=	"\033[A"
CUT				=	"\033[K"

all: up

up:
	@printf "$(GREEN)Building and running the container...$(DEFAULT)\n"
	@cd django/django && \
	docker build -t $(NAME) . && \
	cd .. && \
	docker compose up -d && \
	cd ..

re: clean up

clean:
	@printf "$(RED)Stopping and removing the container...$(DEFAULT)\n"
	@cd django && \
	docker compose down --rmi all && \
	cd ..

.PHONY: all up re clean