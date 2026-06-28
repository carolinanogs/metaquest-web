export type Category =
  | "pessoal"
  | "profissional"
  | "estudos"
  | "saude"
  | "financas"
  | "habitos"
  | "projetos";

export type Difficulty = "facil" | "media" | "dificil";
export type GoalType = "diaria" | "longo_prazo";
export type Status = "nao_iniciada" | "em_andamento" | "concluida" | "atrasada";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: Category;
  type: GoalType;
  difficulty: Difficulty;
  xp: number;
  endDate?: string; // ISO
  startDate: string; // ISO
  progress: number; // 0-100
  status: Status;
  completed?: boolean;
  // for daily: track last completion date (YYYY-MM-DD)
  lastCompletedDate?: string;
  lastResetDate?: string; // YYYY-MM-DD
  completedDates?: string[]; // list of YYYY-MM-DD for daily
  completedAt?: string; // long-term completion
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_goal",
    title: "Primeira Meta",
    description: "Concluiu sua primeira meta",
    unlocked: false,
  },
  {
    id: "streak_7",
    title: "7 dias seguidos",
    description: "Manteve uma streak de 7 dias",
    unlocked: false,
  },
  {
    id: "streak_30",
    title: "30 dias seguidos",
    description: "Manteve uma streak de 30 dias",
    unlocked: false,
  },
  {
    id: "pro_10",
    title: "10 Profissionais",
    description: "Concluiu 10 metas profissionais",
    unlocked: false,
  },
  {
    id: "personal_10",
    title: "10 Pessoais",
    description: "Concluiu 10 metas pessoais",
    unlocked: false,
  },
  {
    id: "first_long_term",
    title: "Conquistador",
    description: "Finalizou sua primeira meta de longo prazo",
    unlocked: false,
  },
];

export interface UserState {
  name: string;
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  achievements: Achievement[];
  totalCompleted: number;
  completedByCategory: Record<Category, number>;
  completedLongTerm: number;
  bonusAwardedForDate?: string; // daily-all-done bonus
  streak7BonusAwarded?: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  pessoal: "Pessoal",
  profissional: "Profissional",
  estudos: "Estudos",
  saude: "Saúde",
  financas: "Finanças",
  habitos: "Hábitos",
  projetos: "Projetos",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  pessoal: "bg-pink-100 text-pink-700 border-pink-200",
  profissional: "bg-blue-100 text-blue-700 border-blue-200",
  estudos: "bg-indigo-100 text-indigo-700 border-indigo-200",
  saude: "bg-emerald-100 text-emerald-700 border-emerald-200",
  financas: "bg-amber-100 text-amber-700 border-amber-200",
  habitos: "bg-teal-100 text-teal-700 border-teal-200",
  projetos: "bg-rose-100 text-rose-700 border-rose-200",
};

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  facil: 10,
  media: 25,
  dificil: 50,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: "Fácil",
  media: "Média",
  dificil: "Difícil",
};
