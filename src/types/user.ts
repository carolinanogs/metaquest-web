import type { Achievement, Category, Goal } from "@/lib/metaquest/types";

export interface UserProfile {
  level: number;
  xp: number;
  completedGoals: number;
  streak: number;
  bestStreak: number;
  achievements: Achievement[];
  lastActiveDate?: string;
  completedByCategory: Record<Category, number>;
  completedLongTerm: number;
  bonusAwardedForDate?: string;
  streak7BonusAwarded?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  profile: UserProfile;
  goals: Goal[];
}

export interface AuthResult {
  success: boolean;
  message?: string;
}
