/**
 * API service for NewsPanda backend
 * Handles user data sync and streak tracking
 */

const API_BASE_URL = 'https://witeso.com'; // Change to your production URL

export interface UserData {
  email: string;
  name: string;
  topics: string[];
}

export interface UserResponse {
  success: boolean;
  message?: string;
  streak?: number;
  user?: {
    email: string;
    name: string;
    topics: string[];
    streak: number;
  };
  error?: string;
}

/**
 * Sync user data to backend
 * Creates new user or updates existing user (name, email, topics)
 */
export const syncUserData = async (userData: UserData): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
};

/**
 * Get user data from backend
 */
export const getUserData = async (email: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Update daily streak
 * Call this when user opens the app or completes daily reading
 */
export const updateStreak = async (email: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/streak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

export interface LeaderboardUser {
  rank: number;
  name: string;
  email: string;
  streak: number;
}

export interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardUser[];
  total_users: number;
  error?: string;
}

/**
 * Get leaderboard - top users by streak or XP
 * @param limit - Number of users to return (default: 10)
 * @param sortBy - Sort by 'streak' or 'xp' (default: 'streak')
 */
export const getLeaderboard = async (limit: number = 10, sortBy: 'streak' | 'xp' = 'streak'): Promise<LeaderboardResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/leaderboard?limit=${limit}&sort_by=${sortBy}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export interface XPResponse {
  success: boolean;
  xp: number;
  message?: string;
  error?: string;
}

/**
 * Add XP to user
 * Call this when user swipes a news card
 */
export const addXP = async (email: string, xp: number = 1): Promise<XPResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/xp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, xp }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding XP:', error);
    throw error;
  }
};

export interface InteractionData {
  email: string;
  news_link: string;
  news_provider: string;
  news_category?: string;
}

export interface InteractionResponse {
  success: boolean;
  message?: string;
  liked?: boolean;
  bookmarked?: boolean;
  error?: string;
}

/**
 * Like an article
 */
export const likeArticle = async (data: InteractionData): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error liking article:', error);
    throw error;
  }
};

/**
 * Unlike an article
 */
export const unlikeArticle = async (email: string, news_link: string): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, news_link }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error unliking article:', error);
    throw error;
  }
};

/**
 * Check if article is liked
 */
export const checkLiked = async (email: string, news_link: string): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/like?email=${encodeURIComponent(email)}&news_link=${encodeURIComponent(news_link)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking liked status:', error);
    throw error;
  }
};

/**
 * Bookmark an article
 */
export const bookmarkArticle = async (data: InteractionData): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error bookmarking article:', error);
    throw error;
  }
};

/**
 * Remove bookmark from an article
 */
export const removeBookmark = async (email: string, news_link: string): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/bookmark`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, news_link }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

/**
 * Check if article is bookmarked
 */
export const checkBookmarked = async (email: string, news_link: string): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/bookmark?email=${encodeURIComponent(email)}&news_link=${encodeURIComponent(news_link)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking bookmarked status:', error);
    throw error;
  }
};

export interface ShareData extends InteractionData {
  share_platform?: string;
}

/**
 * Track article share
 */
export const trackShare = async (data: ShareData): Promise<InteractionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error tracking share:', error);
    throw error;
  }
};
