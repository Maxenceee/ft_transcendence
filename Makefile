NAME		=	express-tmp
FORWARDPORT	=	3004

all: up

up:
	cd srcs && \
	docker build -t $(NAME) . && \
	docker run -it -d -p $(FORWARDPORT):3000 --name $(NAME) $(NAME)

re: clean up

clean:
	-docker stop $(NAME)
	-docker rm $(NAME)
	-docker rmi $(NAME)

.PHONY: all up re clean