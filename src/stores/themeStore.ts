import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

type ThemeStoreState = {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
  
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
};

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: getSystemTheme(),
      effectiveTheme: getEffectiveTheme('system'),

      setTheme: (theme) => {
        const systemTheme = getSystemTheme();
        const effectiveTheme = getEffectiveTheme(theme);
        
        set({ 
          theme, 
          systemTheme, 
          effectiveTheme 
        });
        
        applyTheme(effectiveTheme);
      },

      toggleTheme: () => {
        const { theme } = get();
        let newTheme: Theme;
        
        if (theme === 'light') {
          newTheme = 'dark';
        } else if (theme === 'dark') {
          newTheme = 'system';
        } else {
          newTheme = 'light';
        }
        
        get().setTheme(newTheme);
      },

      initializeTheme: () => {
        const { theme } = get();
        const systemTheme = getSystemTheme();
        const effectiveTheme = getEffectiveTheme(theme);
        
        set({ 
          systemTheme, 
          effectiveTheme 
        });
        
        applyTheme(effectiveTheme);
        
        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          
          const handleChange = () => {
            const { theme } = get();
            const newSystemTheme = getSystemTheme();
            const newEffectiveTheme = getEffectiveTheme(theme);
            
            set({ 
              systemTheme: newSystemTheme, 
              effectiveTheme: newEffectiveTheme 
            });
            
            applyTheme(newEffectiveTheme);
          };
          
          mediaQuery.addEventListener('change', handleChange);
          
          
          return () => {
            mediaQuery.removeEventListener('change', handleChange);
          };
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

if (typeof window !== 'undefined') {
  useThemeStore.getState().initializeTheme();
}
