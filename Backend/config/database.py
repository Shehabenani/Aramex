import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Use environment variable with fallback to local MongoDB container
MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongodb:27017")
client = MongoClient(MONGO_URL)

db = client.user_db

collection_name = db["user_collection"]
collection_name_2 = db["order_collection"]