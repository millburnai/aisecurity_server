pip3 install django_auditlog
pip3 install djangorestframework
pip3 install channels
pip3 install django==2.2
pip3 install pymysql
pip3 install websocket-client
pip3 install channels-redis

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make

make test

sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/

if [ $1 ] ; then
	redis-server
fi