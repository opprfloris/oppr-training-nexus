
export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('Removing localStorage key:', key);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if it exists
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log('Removing sessionStorage key:', key);
        sessionStorage.removeItem(key);
      }
    });
  }
  
  // Clear any other potential auth-related items
  localStorage.removeItem('authToken');
  localStorage.removeItem('userSession');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userSession');
  
  console.log('Auth state cleanup complete');
};

export const forceAuthReset = () => {
  cleanupAuthState();
  
  // Force page reload to ensure completely clean state
  console.log('Forcing page reload for clean auth state');
  window.location.href = '/desktop/login';
};
