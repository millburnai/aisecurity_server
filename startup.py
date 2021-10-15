import os
os.system("redis-server &")
os.system("npm run serve")
#os.system("python3 manage.py runserver 0.0.0.0:8000") 
os.chdir("kioskserver")
#os.system("python3 load_data.py")
