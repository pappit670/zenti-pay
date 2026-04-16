// Completely mocked Supabase client for pure UI testing
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ error: null }),
    signUp: async () => ({ data: { user: { id: 'mock' } }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    insert: async () => ({ error: null }),
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null }),
      }),
    }),
    update: () => ({ eq: async () => ({ error: null }) }),
  }),
} as any;
