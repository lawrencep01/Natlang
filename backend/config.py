import os
from dotenv import load_dotenv

# Loads configurations for OpenAI API key and database URL from .env file
load_dotenv()


class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    DATABASE_URL = os.getenv(
        "DATABASE_URL", "postgresql://lawrencephan@localhost:5432/nfl_management"
    )
