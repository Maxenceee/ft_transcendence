message="\033[1;33mDo you want to remove all the volumes?\nThis will delete all persistent data such as database content. (y/N) \033[0m"

printf "$message"
read input
while [[ $input != "y" && $input != "n"  && $input != "Y" && $input != "N" && $input != "" ]]
do
	printf "\033[A\033[K$message"
	read input
done
if [[ $input == "y" || $input == "Y" ]]
then
	printf "\033[1;31mCleaning data...\033[0m\n"
	rm -rf data
	docker volume rm $(docker volume ls -q)
else
	echo "Abord"
	# exit 1
fi