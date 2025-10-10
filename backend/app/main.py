from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .data_manager import init_db, add_mood, get_all_moods, get_recent_moods, delete_mood

app = FastAPI()

origins = [
    "https://mood-tracker-frontend.onrender.com",  # your deployed frontend
    "http://localhost:3000"  # for local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.onrender.com", "http://localhost:3000"],  # Your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()


class MoodCreate(BaseModel):
    mood_rating: int

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mood Tracker API!"}

@app.get("/moods")
def get_moods():
    return {"moods": get_all_moods()}

@app.get("/moods/recent")
def read_recent_moods(days: int = 7):
    recent = get_recent_moods(days)
    return {"recent_moods": recent}

@app.post("/moods")
def mood_addition(mood: MoodCreate):
    add_mood(mood.mood_rating)
    return {"message": "Mood added successfully."}

@app.delete("/moods/{mood_id}")
def mood_deletion(mood_id: int):
    delete_mood(mood_id)
    return {"message": "Mood deleted successfully.", "remaining_moods": get_all_moods()}