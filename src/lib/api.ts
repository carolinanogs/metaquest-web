import type { AuthUser, UserProfile } from "@/types/user";
import {
  DEFAULT_ACHIEVEMENTS,
  type Category,
  type Difficulty,
  type Goal,
  type GoalType,
} from "@/lib/metaquest/types";

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL ?? "http://localhost:3333");
const AUTH_TOKEN_KEY = "metaquest_auth_token";
const LEGACY_STORAGE_KEYS = ["metaquest_users", "metaquest_current_user_id", "metaquest_goals"];

type ApiOptions = RequestInit & {
  token?: string | null;
};

type BackendAuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type BackendProfile = BackendAuthUser & {
  level: number;
  xp: number;
  completedGoals: number;
  streak: number;
  bestStreak: number;
  lastActiveDate?: string | null;
  completedByCategory?: Record<string, number> | null;
  completedLongTerm: number;
  bonusAwardedForDate?: string | null;
  streak7BonusAwarded?: boolean;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt?: string | null;
  }>;
};

type BackendGoal = Omit<
  Goal,
  | "category"
  | "type"
  | "difficulty"
  | "startDate"
  | "endDate"
  | "lastCompletedDate"
  | "lastResetDate"
  | "completedAt"
> & {
  category: string;
  type: string;
  difficulty: string;
  startDate: string;
  endDate?: string | null;
  lastCompletedDate?: string | null;
  lastResetDate?: string | null;
  completedAt?: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

function normalizeApiBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function clearLegacyLocalState() {
  if (typeof window === "undefined") return;
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers);
  const token = options.token ?? getAuthToken();

  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao backend. Verifique se ele está rodando.");
  }

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(
        response.ok
          ? "O backend retornou uma resposta inválida."
          : "Endpoint da API não encontrado. Verifique a URL do backend.",
        response.status,
      );
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : "O backend retornou um erro.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

function dateOnly(value?: string | null) {
  return value ? value.slice(0, 10) : undefined;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeGoal(goal: BackendGoal): Goal {
  const normalized: Goal = {
    ...goal,
    category: goal.category as Category,
    type: goal.type as GoalType,
    difficulty: goal.difficulty as Difficulty,
    endDate: goal.endDate ?? undefined,
    lastCompletedDate: dateOnly(goal.lastCompletedDate),
    lastResetDate: dateOnly(goal.lastResetDate),
    completedAt: goal.completedAt ?? undefined,
  };

  if (normalized.type !== "diaria") return normalized;

  const today = todayStr();
  const completionDate = dateOnly(goal.completedAt) ?? dateOnly(goal.lastCompletedDate);
  const backendSaysIncomplete = goal.completed === false;
  const completedToday = goal.completed === true && completionDate === today;
  const hasStaleCompletion =
    goal.completed === undefined &&
    normalized.status === "concluida" &&
    normalized.lastCompletedDate !== today;

  if (backendSaysIncomplete || hasStaleCompletion) {
    return {
      ...normalized,
      completed: false,
      progress: 0,
      status: "nao_iniciada",
      lastCompletedDate: undefined,
      completedAt: undefined,
    };
  }

  if (goal.completed === true) {
    return {
      ...normalized,
      completed: completedToday,
      progress: completedToday ? normalized.progress : 0,
      status: completedToday ? "concluida" : "nao_iniciada",
      lastCompletedDate: completedToday ? completionDate : undefined,
      completedAt: completedToday ? normalized.completedAt : undefined,
    };
  }

  return normalized;
}

function normalizeProfile(profile: BackendProfile): UserProfile {
  const unlocked = new Map(
    (profile.achievements ?? []).map((achievement) => [achievement.id, achievement]),
  );

  return {
    level: profile.level,
    xp: profile.xp,
    completedGoals: profile.completedGoals,
    streak: profile.streak,
    bestStreak: profile.bestStreak,
    achievements: DEFAULT_ACHIEVEMENTS.map((achievement) => {
      const match = unlocked.get(achievement.id);
      return match
        ? {
            ...achievement,
            title: match.title,
            description: match.description,
            unlocked: true,
            unlockedAt: match.unlockedAt ?? undefined,
          }
        : { ...achievement };
    }),
    lastActiveDate: dateOnly(profile.lastActiveDate),
    completedByCategory: {
      pessoal: 0,
      profissional: 0,
      estudos: 0,
      saude: 0,
      financas: 0,
      habitos: 0,
      projetos: 0,
      ...(profile.completedByCategory ?? {}),
    },
    completedLongTerm: profile.completedLongTerm,
    bonusAwardedForDate: dateOnly(profile.bonusAwardedForDate),
    streak7BonusAwarded: profile.streak7BonusAwarded,
  };
}

function buildAuthUser(
  user: BackendAuthUser,
  profile: BackendProfile,
  goals: BackendGoal[],
): AuthUser {
  return {
    id: user.id,
    name: profile.name ?? user.name,
    email: profile.email ?? user.email,
    createdAt: user.createdAt,
    profile: normalizeProfile(profile),
    goals: goals.map(normalizeGoal),
  };
}

export async function loadSessionUser(token = getAuthToken()) {
  if (!token) return null;

  const user = await apiRequest<BackendAuthUser>("/auth/me", { token });
  const [profile, goals] = await Promise.all([
    apiRequest<BackendProfile>("/profile", { token }),
    apiRequest<BackendGoal[]>("/goals", { token }),
  ]);

  return buildAuthUser(user, profile, goals);
}

export async function loginRequest(input: { email: string; password: string }) {
  const result = await apiRequest<{ user: BackendAuthUser; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    token: null,
  });
  setAuthToken(result.token);
  return loadSessionUser(result.token);
}

export async function registerRequest(input: { name: string; email: string; password: string }) {
  const result = await apiRequest<{ user: BackendAuthUser; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
    token: null,
  });
  setAuthToken(result.token);
  return loadSessionUser(result.token);
}

export async function logoutRequest() {
  await apiRequest<{ message: string }>("/auth/logout", { method: "POST" }).catch(() => null);
  clearAuthToken();
}

export async function forgotPasswordRequest(email: string) {
  return apiRequest<{ exists: boolean; message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    token: null,
  });
}

export async function changePasswordRequest(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return apiRequest<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProfileRequest(input: { name: string; email: string }) {
  return apiRequest<BackendAuthUser>("/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function createGoalRequest(input: {
  title: string;
  description?: string;
  category: Category;
  type: GoalType;
  difficulty: Difficulty;
  endDate?: string;
}) {
  const goal = await apiRequest<BackendGoal>("/goals", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return normalizeGoal(goal);
}

export async function updateGoalRequest(id: string, patch: Partial<Goal>) {
  const goal = await apiRequest<BackendGoal>(`/goals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return normalizeGoal(goal);
}

export async function deleteGoalRequest(id: string) {
  return apiRequest<{ message: string }>(`/goals/${id}`, { method: "DELETE" });
}

export async function toggleDailyGoalRequest(id: string) {
  const result = await apiRequest<{ goal: BackendGoal; profile: BackendProfile }>(
    `/goals/${id}/complete-daily`,
    {
      method: "POST",
    },
  );
  return { goal: normalizeGoal(result.goal), profile: normalizeProfile(result.profile) };
}

export async function completeLongTermGoalRequest(id: string) {
  const result = await apiRequest<{ goal: BackendGoal; profile: BackendProfile }>(
    `/goals/${id}/complete-long-term`,
    {
      method: "POST",
    },
  );
  return { goal: normalizeGoal(result.goal), profile: normalizeProfile(result.profile) };
}

export async function setGoalProgressRequest(id: string, progress: number) {
  const goal = await apiRequest<BackendGoal>(`/goals/${id}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  });
  return normalizeGoal(goal);
}
