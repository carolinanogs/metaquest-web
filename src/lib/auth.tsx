import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types/user";
import {
  ApiError,
  changePasswordRequest,
  clearAuthToken,
  clearLegacyLocalState,
  forgotPasswordRequest,
  loadSessionUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  updateProfileRequest,
} from "@/lib/api";

type AuthResult = { success: true; user: AuthUser } | { success: false; message: string };

type ForgotPasswordResult = {
  success: boolean;
  exists: boolean;
  message: string;
};

type AuthContextValue = {
  currentUser: AuthUser | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: { name: string; email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResult>;
  changePassword: (input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; message: string }>;
  updateCurrentUser: (input: { name: string; email: string }) => Promise<AuthUser | null>;
  refreshCurrentUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Não foi possível concluir a operação.";
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refreshCurrentUser = useCallback(async () => {
    const user = await loadSessionUser();
    setCurrentUser(user);
    return user;
  }, []);

  useEffect(() => {
    let active = true;

    clearLegacyLocalState();

    loadSessionUser()
      .then((user) => {
        if (!active) return;
        setCurrentUser(user);
      })
      .catch(() => {
        clearAuthToken();
        if (active) setCurrentUser(null);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !currentUser) return;

    const refresh = () => {
      refreshCurrentUser().catch(() => null);
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [currentUser, hydrated, refreshCurrentUser]);

  useEffect(() => {
    if (!hydrated || !currentUser) return;

    let lastSeenDate = todayStr();
    const interval = window.setInterval(() => {
      const currentDate = todayStr();
      if (currentDate === lastSeenDate) return;

      lastSeenDate = currentDate;
      refreshCurrentUser().catch(() => null);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [currentUser, hydrated, refreshCurrentUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      hydrated,
      login: async (email, password) => {
        try {
          const user = await loginRequest({ email, password });
          if (!user) return { success: false, message: "Não foi possível carregar sua sessão." };
          setCurrentUser(user);
          return { success: true, user };
        } catch (error) {
          return { success: false, message: errorMessage(error) };
        }
      },
      register: async ({ name, email, password }) => {
        try {
          const user = await registerRequest({ name, email, password });
          if (!user) return { success: false, message: "Não foi possível carregar sua sessão." };
          setCurrentUser(user);
          return { success: true, user };
        } catch (error) {
          return { success: false, message: errorMessage(error) };
        }
      },
      logout: async () => {
        await logoutRequest();
        setCurrentUser(null);
      },
      forgotPassword: async (email) => {
        try {
          const result = await forgotPasswordRequest(email);
          return { success: true, exists: result.exists, message: result.message };
        } catch (error) {
          return { success: false, exists: false, message: errorMessage(error) };
        }
      },
      changePassword: async (input) => {
        try {
          const result = await changePasswordRequest(input);
          return { success: true, message: result.message };
        } catch (error) {
          return { success: false, message: errorMessage(error) };
        }
      },
      updateCurrentUser: async (input) => {
        try {
          const user = await updateProfileRequest(input);
          const nextUser = currentUser ? { ...currentUser, ...user } : await loadSessionUser();
          setCurrentUser(nextUser);
          return nextUser;
        } catch (error) {
          throw new Error(errorMessage(error));
        }
      },
      refreshCurrentUser,
    }),
    [currentUser, hydrated, refreshCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
