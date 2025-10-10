"use client";
import React, { useState, useEffect } from "react";
import Slider from "../components/slider";
import MoodList from "../components/mood-list";
import { api } from "../lib/api";
import styles from "./page.module.css"; // Ensure import for pageContainer/noMoods

export default function Home() {
  const [moods, setMoods] = useState([]); // Default empty array, no undefined

  async function loadMoods() {
    try {
      const fetchedMoods = await api.fetchRecentMoods(7); // Recent for no dump
      console.log("Fetched recent:", fetchedMoods); // Debug: What shape?
      setMoods(fetchedMoods?.recent_moods || []); // Extract + safe
    } catch (error) {
      console.error("Load failed:", error);
      // Fallback to all for test if recent bugs
      try {
        const all = await api.fetchMoods();
        console.log("Fallback all:", all);
        setMoods(all?.moods || []);
      } catch (fallbackError) {
        console.error("Fallback failed:", fallbackError);
        setMoods([]); // Ultimate safe
      }
    }
  }
  function onMoodAdded(newMood) {
    if (newMood) {
      setMoods((prev) => [newMood, ...prev]); // Optimistic add
    } else {
      loadMoods(); // Full reload
    }
  }
  useEffect(() => {
    loadMoods();
  }, []);

  console.log("Render moods:", moods); // Debug: Array or empty?

  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.title}>Mood Tracker</h1>
      <Slider onMoodAdded={loadMoods} />
      {moods?.length === 0 && (
        <p className={styles.noMoods}>No moods recorded yet.</p>
      )}
      {moods?.length > 0 && <MoodList moods={moods} onMoodDelete={loadMoods} />}
    </main>
  );
}
