export const authCheck = async () => {
  const access_token = localStorage.getItem('access_token');
  if (!access_token) return false;
  return true;
};