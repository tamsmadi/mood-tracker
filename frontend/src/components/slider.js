"use client";
import React, { useState } from "react";
import { api } from "../lib/api";
import styles from './slider.module.css';  // Critical: Import here (case-sensitive)

export default function Slider({ onMoodAdded }) {
  const [moodRating, setMoodRating] = useState(1);

  const handleChange = (event) => {
    setMoodRating(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("=== BUTTON CLICKED ===");
    console.log("moodRating value:", moodRating);
    console.log("moodRating type:", typeof moodRating);

    try {
      console.log("About to call API...");
      await api.addMoods({ mood_rating: moodRating });
      onMoodAdded();  // Reload list
    } catch (error) {
      console.log("ERROR caught:", error);
      console.log("Error message:", error.message);
    }
  };

  return (
    <div className={styles.sliderContainer}>  {/* Root wrapper: This makes the box */}
      <input
        type="range"
        min="1"
        max="10"
        value={moodRating}
        onChange={handleChange}
        className={styles.rangeInput}  
      />
      <span className={styles.valueLabel}>Value: {moodRating}</span>  {/* Boxed value */}
      <button onClick={handleSubmit} className={styles.submitBtn}>Submit Mood</button>  {/* Gradient button */}
    </div>
  );
}