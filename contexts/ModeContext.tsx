import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

type Mode = 'personal' | 'business' | 'admin';

interface ModeContextType {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
  isAdmin: boolean;
  isBusinessVerified: boolean;
  loading: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<Mode>('personal');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      loadUserMode();
    } else {
      setLoading(false);
    }
  }, [session]);

  const loadUserMode = async () => {
    try {
      const { data, error } = await supabase
        .from('user_modes')
        .select('*')
        .eq('user_id', session?.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCurrentMode(data.current_mode as Mode);
        setIsAdmin(data.is_admin || false);
        setIsBusinessVerified(data.is_business_verified || false);
      } else {
        await supabase
          .from('user_modes')
          .insert({
            user_id: session?.user.id,
            current_mode: 'personal',
            is_admin: false,
            is_business_verified: false
          });
      }
    } catch (error) {
      console.error('Error loading user mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const setMode = async (mode: Mode) => {
    try {
      const { error } = await supabase
        .from('user_modes')
        .update({ current_mode: mode, updated_at: new Date().toISOString() })
        .eq('user_id', session?.user.id);

      if (error) throw error;
      setCurrentMode(mode);
    } catch (error) {
      console.error('Error updating mode:', error);
    }
  };

  return (
    <ModeContext.Provider value={{ currentMode, setMode, isAdmin, isBusinessVerified, loading }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
