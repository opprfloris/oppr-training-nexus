
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
};
