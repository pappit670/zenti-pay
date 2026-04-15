import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type IslandState =
  | { type: "idle" }
  | { type: "success"; amount: number; name?: string }
  | { type: "error"; message: string }
  | { type: "pending"; amount: number }
  | { type: "request"; amount: number; from: string }
  | { type: "blocked" }
  | { type: "insufficient_balance" };

interface PaymentSession {
  id: string;
  amount: number;
  status: 'pending' | 'locked' | 'completed' | 'failed';
  method?: 'qr' | 'nfc';
}

interface CardState {
  color: string;
  isBlocked: boolean;
  balance: number;
  isSetup: boolean;
}

interface ZentiContextType {
  islandState: IslandState;
  showIsland: (state: IslandState) => void;
  hideIsland: () => void;
  session: PaymentSession | null;
  createSession: (amount: number) => string;
  lockSession: (method: 'qr' | 'nfc') => boolean;
  completeSession: () => void;
  failSession: () => void;
  resetSession: () => void;
  cardState: CardState;
  updateCardState: (updates: Partial<CardState>) => void;
}

const ZentiContext = createContext<ZentiContextType | undefined>(undefined);

export function ZentiProvider({ children }: { children: ReactNode }) {
  const [islandState, setIslandState] = useState<IslandState>({ type: "idle" });
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [cardState, setCardState] = useState<CardState>({
    color: '#FF6B6B',
    isBlocked: false,
    balance: 0.007265,
    isSetup: false,
  });

  const showIsland = useCallback((state: IslandState) => {
    setIslandState(state);
    // Auto-dismiss for non-request states
    if (state.type !== 'idle' && state.type !== 'request' && state.type !== 'pending' && state.type !== 'blocked' && state.type !== 'insufficient_balance') {
      setTimeout(() => {
        setIslandState({ type: "idle" });
      }, 3000);
    }
  }, []);

  const hideIsland = useCallback(() => {
    setIslandState({ type: "idle" });
  }, []);

  const createSession = useCallback((amount: number) => {
    const id = Math.random().toString(36).substring(7);
    setSession({ id, amount, status: 'pending' });
    return id;
  }, []);

  const lockSession = useCallback((method: 'qr' | 'nfc') => {
    if (!session || session.status !== 'pending') return false;
    setSession(prev => prev ? { ...prev, status: 'locked', method } : null);
    return true;
  }, [session]);

  const completeSession = useCallback(() => {
    setSession(prev => prev ? { ...prev, status: 'completed' } : null);
    if (session) {
      showIsland({ type: "success", amount: session.amount });
    }
  }, [session, showIsland]);

  const failSession = useCallback(() => {
    setSession(prev => prev ? { ...prev, status: 'failed' } : null);
    showIsland({ type: "error", message: "Payment failed" });
  }, [showIsland]);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  const updateCardState = useCallback((updates: Partial<CardState>) => {
    setCardState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <ZentiContext.Provider value={{
      islandState,
      showIsland,
      hideIsland,
      session,
      createSession,
      lockSession,
      completeSession,
      failSession,
      resetSession,
      cardState,
      updateCardState,
    }}>
      {children}
    </ZentiContext.Provider>
  );
}

export function useZenti() {
  const context = useContext(ZentiContext);
  if (context === undefined) {
    throw new Error('useZenti must be used within a ZentiProvider');
  }
  return context;
}
