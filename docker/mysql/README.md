$ docker run --platform linux/amd64 --name some-mysql -e MYSQL_ROOT_PASSWORD=toor -p 3306:3306 -d mysql:8.0.25 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

docker exec -it some-mysql /bin/sh

mysql -u root -p
password:toor

CREATE USER 'root'@'%' IDENTIFIED BY 'toor'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;


connecting with dbeaver
https://stackoverflow.com/questions/61749304/connexion-between-dbeaver-mysql