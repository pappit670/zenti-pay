import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  session: any | null;
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (data: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const defaultUser = { 
  id: 'mock-user-id', 
  email: 'test@zenti.com',
  user_metadata: { full_name: 'Zenti User' }
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: defaultUser,
  loading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ 
      session: null, 
      user: defaultUser, 
      loading: false, 
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
