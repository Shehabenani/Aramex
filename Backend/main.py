from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv

app = FastAPI()

from routes.route import router
app.include_router(router)

# CORS configuration
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB configuration
load_dotenv()

# Use environment variable with fallback for local MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongodb:27017")
client = MongoClient(MONGO_URL)

# Test connection
try:
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
