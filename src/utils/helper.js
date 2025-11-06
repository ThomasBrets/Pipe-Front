export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "";

  const firstInitial = firstName ? firstName[0] : "";
  const lastInitial = lastName ? lastName[0] : "";

  return (firstInitial + lastInitial).toUpperCase();
};
