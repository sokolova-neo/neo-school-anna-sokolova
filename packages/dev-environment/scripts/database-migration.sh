#!/bin/bash
set -e

echo "Updating the MongoDB image version in docker-compose.yml..."
sed -i.bak 's/mongo:6.0/bitnami\/mongodb:4.4/g' docker-compose.yml
rm docker-compose.yml.bak

echo "Creating a backup directory in the local filesystem..."
mkdir -p ./mongo_backup

echo "Starting the dev-environment..."
docker-compose up -d

# # Backup current MongoDB data
echo "Backing up the current MongoDB data..."
docker run --rm --name temp_mongodb -v "$(pwd)/mongo_backup:/backup" --network container:mongodb bitnami/mongodb:4.4 bash -c 'mongodump --host mongodb --out /backup'

echo "Stopping the dev-environment..."
docker-compose down

echo "Updating the MongoDB image version in docker-compose.yml"
sed -i.bak 's/bitnami\/mongodb:4.4/mongo:6.0/g' docker-compose.yml
rm docker-compose.yml.bak

echo "Starting the dev-environment with new MongoDB version..."
docker-compose up -d

# Allow MongoDB service to start
sleep 15

echo "Restoring the data to the new MongoDB version..."
docker run --rm --name temp_mongodb -v "$(pwd)/mongo_backup:/backup" --network container:mongodb mongo:6.0 bash -c 'mongorestore --host mongodb /backup'

echo "Migration completed."
