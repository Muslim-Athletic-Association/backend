docker rm -vf $(docker ps -a -q)
docker rmi -f $(docker images -a -q)
sudo rm -rf pgdata/

# use this command to enter container: docker exec -it [container id]  bash