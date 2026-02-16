const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mood-tracker-frontend-kqew.onrender.com/";

const addMoods = async (moodData) => {
  const response = await fetch(`${API_BASE_URL}/moods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moodData),
  });
  return response.json();
};

const fetchMoods = async () => {
  const response = await fetch(`${API_BASE_URL}/moods`);
  return response.json();
};

const getMoodLabel = async (rating) => {
  const response = await fetch(`${API_BASE_URL}/moods/label?rating=${rating}`);
  return response.json();
}


const deleteMood = async (moodId) => {
  const response = await fetch(`${API_BASE_URL}/moods/${moodId}`, {
    method: "DELETE",
  });
  return response.json();
};

const fetchRecentMoods = async (days = 7) => {
  const response = await fetch(`${API_BASE_URL}/moods/recent?days=${days}`);
  return response.json();
};

export const api = {
  addMoods,
  fetchMoods,
  getMoodLabel,
  deleteMood,
  fetchRecentMoods,
};
