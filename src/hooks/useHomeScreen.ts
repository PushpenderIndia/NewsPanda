/**
 * useHomeScreen Hook
 * Custom hook for managing HomeScreen state and logic
 */
import { useState, useEffect } from 'react';
import { NewsArticle } from '../types/news.types';
import { fetchNewsArticles } from '../utils/newsUtils';
import {
  getStreak,
  saveStreak,
  getUserInfo,
  getXP,
  saveXP,
} from '../services/storage';
import { updateStreak as updateStreakAPI, addXP } from '../services/api';

export const useHomeScreen = (topics: string[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Fetch news
  const loadNews = async () => {
    try {
      setLoading(true);
      const articles = await fetchNewsArticles(topics);
      setCards(articles);
      setCurrentIndex(0);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load and update streak and XP
  const loadUserStats = async () => {
    try {
      const localStreak = await getStreak();
      const localXp = await getXP();
      setStreak(localStreak);
      setXp(localXp);

      const userInfo = await getUserInfo();
      if (userInfo?.email) {
        const response = await updateStreakAPI(userInfo.email);
        if (response.streak !== undefined) {
          setStreak(response.streak);
          await saveStreak(response.streak);
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Handle page change (swipe)
  const handlePageChange = async (newIndex: number) => {
    setCurrentIndex(newIndex);

    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);

    // Award 1 XP for every 10 swipes
    if (newSwipeCount % 10 === 0) {
      try {
        const userInfo = await getUserInfo();
        if (userInfo?.email) {
          const response = await addXP(userInfo.email, 1);
          if (response.success && response.xp !== undefined) {
            setXp(response.xp);
            await saveXP(response.xp);
          }
        }
      } catch (error) {
        console.error('Error adding XP:', error);
      }
    }
  };

  // Load news when topics change
  useEffect(() => {
    setCurrentIndex(0);
    loadNews();
  }, [topics]);

  // Load user stats on mount
  useEffect(() => {
    loadUserStats();
  }, []);

  return {
    currentIndex,
    cards,
    loading,
    streak,
    xp,
    showStatsModal,
    setShowStatsModal,
    handlePageChange,
  };
};
