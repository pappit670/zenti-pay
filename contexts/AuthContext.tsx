import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  nationalId?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  businessId?: string;
  mode: 'personal' | 'business';
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;

        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          // Mock session for development
          setUser({ id: 'mock-user-id', email: 'test@zenti.com' } as any);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setUser({ id: 'mock-user-id', email: 'test@zenti.com' } as any);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (signUpData: SignUpData) => {
    const { email, password, mode, fullName, nationalId, phone, businessName, businessType, businessId } = signUpData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const displayName = mode === 'personal' ? fullName : businessName;

      const businessCategory = businessType ? businessType.toLowerCase() : null;

      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: displayName,
        email: email,
        account_number: accountNumber,
        phone_number: phone,
        national_id: nationalId,
        business_name: businessName,
        business_category: businessCategory,
        business_type: businessType,
        business_id: businessId,
        verification_status: mode === 'business' ? 'verified' : null,
      });

      await supabase.from('accounts').insert({
        user_id: data.user.id,
        account_type: 'wallet',
        currency: 'KSH',
        balance: 0,
        account_number: accountNumber,
        is_primary: true,
      });

      await supabase.from('user_modes').insert({
        user_id: data.user.id,
        current_mode: mode,
        is_admin: false,
        is_business_verified: mode === 'business',
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
