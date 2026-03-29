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
 * Get leaderboard - top users by streak
 */
export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newspanda/leaderboard?limit=${limit}`, {
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
