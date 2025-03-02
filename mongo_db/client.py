from pymongo import MongoClient
from dotenv import load_dotenv
import os


mongo_uri = os.getenv('MONGO_URI')
db_name = os.getenv('MONGO_DATABASE')
collection = os.getenv('COLLECTION')

client = MongoClient(mongo_uri)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)