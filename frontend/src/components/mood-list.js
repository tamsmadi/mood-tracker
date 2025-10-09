"use client";
import { api } from "../lib/api";
import { format } from "date-fns";
import styles from "./mood-list.module.css";
export default function MoodList({ moods, onMoodDelete }) {
  async function handleDelete(mood_id) {
    await api.deleteMood(mood_id);
    onMoodDelete();
  }
  const getMoodEmoji = (label) => {
    const emojis = {
      terrible: "😢",
      bad: "🙁",
      okay: "😐",
      good: "🙂",
      excellent: "😊",
    };
    return emojis[label] || "";
  };
  return (
    <ul className={styles.moodList}>
      {moods.map((mood) => (
        <li key={mood.id} className={styles.moodCard}>
          <div className={styles.cardContent}>
            <div className={styles.moodInfo}>
              <span className={styles.idRating}>
                ID: {mood.id} | Rating: {mood.mood_rating}
              </span>
              <span
                className={styles.moodLabel} 
              >
                {getMoodEmoji(mood.mood_label)} {mood.mood_label}
              </span>
              <span className={styles.timestamp}>
                {format(new Date(mood.date), "MMM dd, yyyy h:mm a")}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(mood.id)}
            className={styles.deleteBtn}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
