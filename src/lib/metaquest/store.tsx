import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { AuthUser, UserProfile } from "@/types/user";
import {
  completeLongTermGoalRequest,
  createGoalRequest,
  deleteGoalRequest,
  setGoalProgressRequest,
  toggleDailyGoalRequest,
  updateGoalRequest,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  DEFAULT_ACHIEVEMENTS,
  type Category,
  type Difficulty,
  type Goal,
  type UserState,
} from "./types";
import { levelFromXp } from "./leveling";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface State {
  user: UserState;
  goals: Goal[];
}

interface StoreCtx extends State {
  addGoal: (
    g: Omit<Goal, "id" | "startDate" | "progress" | "status" | "xp"> & { xp?: number },
  ) => Promise<boolean>;
  updateGoal: (id: string, patch: Partial<Goal>) => Promise<boolean>;
  removeGoal: (id: string) => Promise<boolean>;
  toggleDaily: (id: string) => Promise<boolean>;
  completeLongTerm: (id: string) => Promise<boolean>;
  setProgress: (id: string, pct: number) => Promise<boolean>;
  setName: (n: string) => Promise<boolean>;
}

const Ctx = createContext<StoreCtx | null>(null);

function emptyByCategory(): Record<Category, number> {
  return {
    pessoal: 0,
    profissional: 0,
    estudos: 0,
    saude: 0,
    financas: 0,
    habitos: 0,
    projetos: 0,
  };
}

function defaultUserState(): UserState {
  return {
    name: "Aventureiro",
    xp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    achievements: DEFAULT_ACHIEVEMENTS.map((achievement) => ({ ...achievement })),
    totalCompleted: 0,
    completedByCategory: emptyByCategory(),
    completedLongTerm: 0,
  };
}

function defaultState(): State {
  return {
    user: defaultUserState(),
    goals: [],
  };
}

function userStateFromProfile(authUser: Pick<AuthUser, "name">, profile: UserProfile): UserState {
  return {
    name: authUser.name,
    xp: profile.xp ?? 0,
    level: profile.level ?? levelFromXp(profile.xp ?? 0),
    streak: profile.streak ?? 0,
    bestStreak: profile.bestStreak ?? 0,
    lastActiveDate: profile.lastActiveDate,
    achievements:
      profile.achievements ?? DEFAULT_ACHIEVEMENTS.map((achievement) => ({ ...achievement })),
    totalCompleted: profile.completedGoals ?? 0,
    completedByCategory: { ...emptyByCategory(), ...profile.completedByCategory },
    completedLongTerm: profile.completedLongTerm ?? 0,
    bonusAwardedForDate: profile.bonusAwardedForDate,
    streak7BonusAwarded: profile.streak7BonusAwarded,
  };
}

function stateFromAuthUser(authUser: AuthUser): State {
  return {
    user: userStateFromProfile(authUser, authUser.profile),
    goals: authUser.goals ?? [],
  };
}

function replaceGoal(goals: Goal[], nextGoal: Goal) {
  return goals.map((goal) => (goal.id === nextGoal.id ? nextGoal : goal));
}

function reportError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Não foi possível sincronizar com o backend.";
  toast.error(message);
}

export function MetaQuestProvider({ children }: { children: ReactNode }) {
  const { currentUser, hydrated, updateCurrentUser } = useAuth();
  const [state, setState] = useState<State>(() => defaultState());

  const authUserKey = currentUser ? JSON.stringify(currentUser) : "guest";

  useEffect(() => {
    if (!hydrated) return;
    setState(currentUser ? stateFromAuthUser(currentUser) : defaultState());
  }, [hydrated, authUserKey, currentUser]);

  const ctx: StoreCtx = useMemo(
    () => ({
      ...state,
      addGoal: async (goalInput) => {
        try {
          const goal = await createGoalRequest({
            title: goalInput.title,
            description: goalInput.description,
            category: goalInput.category,
            type: goalInput.type,
            difficulty: goalInput.difficulty,
            endDate: goalInput.endDate,
          });
          setState((current) => ({ ...current, goals: [goal, ...current.goals] }));
          toast.success("Meta criada!");
          return true;
        } catch (error) {
          reportError(error);
          return false;
        }
      },
      updateGoal: async (id, patch) => {
        try {
          const goal = await updateGoalRequest(id, patch);
          setState((current) => ({ ...current, goals: replaceGoal(current.goals, goal) }));
          toast.success("Meta atualizada!");
          return true;
        } catch (error) {
          reportError(error);
          return false;
        }
      },
      removeGoal: async (id) => {
        try {
          await deleteGoalRequest(id);
          setState((current) => ({
            ...current,
            goals: current.goals.filter((goal) => goal.id !== id),
          }));
          toast.success("Meta excluída.");
          return true;
        } catch (error) {
          reportError(error);
          return false;
        }
      },
      toggleDaily: async (id) => {
        try {
          const result = await toggleDailyGoalRequest(id);
          setState((current) => ({
            user: userStateFromProfile(current.user, result.profile),
            goals: replaceGoal(current.goals, result.goal),
          }));
          toast.success(
            result.goal.lastCompletedDate === todayStr()
              ? "Meta diária concluída!"
              : "Conclusão removida.",
          );
          return true;
        } catch (error) {
          reportError(error);
          return false;
        }
      },
      completeLongTerm: async (id) => {
        try {
          const result = await completeLongTermGoalRequest(id);
          setState((current) => ({
            user: userStateFromProfile(current.user, result.profile),
            goals: replaceGoal(current.goals, result.goal),
          }));
          toast.success("Meta concluída!");
          return true;
        } catch (error) {
          reportError(error);
          return false;
        }
      },
      setProgress: async (id, pct) => {
        const progress = Math.max(0, Math.min(100, Math.round(pct)));
        setState((current) => ({
          ...current,
          goals: current.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  progress,
                  status:
                    progress === 0
                      ? "nao_iniciada"
                      : progress >= 100
                        ? goal.status
                        : "em_andamento",
                }
              : goal,
          ),
        }));

        try {
          const goal = await setGoalProgressRequest(id, progress);
          setState((current) => ({ ...current, goals: replaceGoal(current.goals, goal) }));
          return true;
        } catch (error) {
          reportError(error);
          return false;
        }
      },
      setName: async (name) => {
        if (!currentUser) return false;
        try {
          const nextUser = await updateCurrentUser({ name: name.trim(), email: currentUser.email });
          if (nextUser) {
            setState((current) => ({ ...current, user: { ...current.user, name: nextUser.name } }));
          }
          return Boolean(nextUser);
        } catch (error) {
          reportError(error);
          return false;
        }
      },
    }),
    [state, currentUser, updateCurrentUser],
  );

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useMetaQuest() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMetaQuest must be used within MetaQuestProvider");
  return c;
}

export function isDailyDoneToday(g: Goal) {
  return g.type === "diaria" && g.lastCompletedDate === todayStr();
}
