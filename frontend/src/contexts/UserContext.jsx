import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../api/users';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // version key used to force-refresh profile images when they change
  const [imageKey, setImageKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getUserProfile();
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newUser) => {
    // If profileImage changed, bump the imageKey to bust cache in img src
    setUser(prev => {
      const prevImage = prev?.profileImage || null;
      const newImage = newUser?.profileImage || null;
      if (prevImage && newImage && prevImage !== newImage) {
        setImageKey(Date.now());
      } else if (!prevImage && newImage) {
        setImageKey(Date.now());
      }
      return newUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, refetchUser: fetchUser, imageKey }}>
      {children}
    </UserContext.Provider>
  );
};