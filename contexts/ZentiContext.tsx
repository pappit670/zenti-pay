import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Recipient = {
  id: string;
  name: string;
  tag: string;
  avatar?: string;
  color?: string;
};

export type IslandState =
  | { type: "idle" }
  | { type: "success"; amount: number; name?: string; recipient?: Recipient }
  | { type: "error"; message: string }
  | { type: "pending"; amount: number; recipient?: Recipient }
  | { type: "request"; amount: number; from: string }
  | { type: "blocked" }
  | { type: "insufficient_balance" };

interface PaymentSession {
  id: string;
  amount: number;
  status: 'pending' | 'locked' | 'completed' | 'failed';
  method?: 'qr' | 'nfc';
  recipient?: Recipient;
}

interface CardState {
  color: string;
  isBlocked: boolean;
  balance: number;
  isSetup: boolean;
  type: 'zenti' | 'bank';
}

interface ZentiContextType {
  islandState: IslandState;
  showIsland: (state: IslandState) => void;
  hideIsland: () => void;
  session: PaymentSession | null;
  createSession: (amount: number, recipient?: Recipient) => string;
  lockSession: (method: 'qr' | 'nfc') => boolean;
  completeSession: () => void;
  failSession: () => void;
  resetSession: () => void;
  cardState: CardState;
  updateCardState: (updates: Partial<CardState>) => void;
  selectedRecipient: Recipient | null;
  setRecipient: (recipient: Recipient | null) => void;
  balance: number;
}

const ZentiContext = createContext<ZentiContextType | undefined>(undefined);

export function ZentiProvider({ children }: { children: ReactNode }) {
  const [islandState, setIslandState] = useState<IslandState>({ type: "idle" });
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [balance, setBalance] = useState(7854.43);
  const [cardState, setCardState] = useState<CardState>({
    color: '#000000',
    isBlocked: false,
    balance: 7854.43,
    isSetup: true,
    type: 'zenti'
  });

  const showIsland = useCallback((state: IslandState) => {
    setIslandState(state);
    if (state.type !== 'idle' && state.type !== 'request' && state.type !== 'pending' && state.type !== 'blocked' && state.type !== 'insufficient_balance') {
      setTimeout(() => {
        setIslandState({ type: "idle" });
      }, 3000);
    }
  }, []);

  const hideIsland = useCallback(() => {
    setIslandState({ type: "idle" });
  }, []);

  const createSession = useCallback((amount: number, recipient?: Recipient) => {
    const id = Math.random().toString(36).substring(7);
    setSession({ id, amount, status: 'pending', recipient });
    return id;
  }, []);

  const lockSession = useCallback((method: 'qr' | 'nfc') => {
    if (!session || session.status !== 'pending') return false;
    setSession(prev => prev ? { ...prev, status: 'locked', method } : null);
    return true;
  }, [session]);

  const completeSession = useCallback(() => {
    if (session) {
      setBalance(prev => prev - session.amount);
      setCardState(prev => ({ ...prev, balance: prev.balance - session.amount }));
      setSession(prev => prev ? { ...prev, status: 'completed' } : null);
      showIsland({ type: "success", amount: session.amount, recipient: session.recipient });
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

  const setRecipient = useCallback((recipient: Recipient | null) => {
    setSelectedRecipient(recipient);
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
      selectedRecipient,
      setRecipient,
      balance,
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
