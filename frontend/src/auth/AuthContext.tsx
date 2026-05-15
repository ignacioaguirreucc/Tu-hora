import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Href } from 'expo-router';

export type Role = 'client' | 'pro' | 'owner';
export type RoleStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type AuthUser = {
  name: string;
  email: string;
  tone: 'ink';
  points: number;
  level: string;
  roles: Role[];
  activeRole: Role;
  proStatus: RoleStatus;
  ownerStatus: RoleStatus;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string) => void;
  loginSocial: (provider: 'Google' | 'Apple') => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  requestRole: (role: 'pro' | 'owner') => void;
  approveRoleForDemo: (role: 'pro' | 'owner') => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const BASE_USER: Omit<AuthUser, 'email'> = {
  name: 'Leo Messi',
  tone: 'ink',
  points: 340,
  level: 'Star',
  roles: ['client'],
  activeRole: 'client',
  proStatus: 'none',
  ownerStatus: 'none',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string) => {
    setUser({ ...BASE_USER, email: email || 'leo@gmail.com' });
  };

  const loginSocial = () => {
    setUser({ ...BASE_USER, email: 'leo@gmail.com' });
  };

  const logout = () => setUser(null);

  const switchRole = (role: Role) => {
    setUser((u) => (u && u.roles.includes(role) ? { ...u, activeRole: role } : u));
  };

  const requestRole = (role: 'pro' | 'owner') => {
    setUser((u) => {
      if (!u) return u;
      if (role === 'pro') return { ...u, proStatus: 'pending' };
      return { ...u, ownerStatus: 'pending' };
    });
  };

  const approveRoleForDemo = (role: 'pro' | 'owner') => {
    setUser((u) => {
      if (!u) return u;
      const roles = u.roles.includes(role) ? u.roles : [...u.roles, role];
      if (role === 'pro') {
        return { ...u, roles, proStatus: 'approved', activeRole: 'pro' };
      }
      return { ...u, roles, ownerStatus: 'approved', activeRole: 'owner' };
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginSocial, logout, switchRole, requestRole, approveRoleForDemo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function routeForRole(role: Role): Href {
  if (role === 'pro') return '/(pro)/dashboard';
  if (role === 'owner') return '/(owner)/dashboard';
  return '/(client)/home';
}
