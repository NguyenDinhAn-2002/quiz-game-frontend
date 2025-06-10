import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/auth';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Giải mã JWT và trả về payload:
 * Ví dụ payload = { sub: "...", name: "...", exp: 1681234567, ... }
 */
function decodeToken(token: string): { [key: string]: any } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Khi mount, lấy token từ localStorage (nếu có) rồi kiểm tra expiry
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const payload = decodeToken(storedToken);
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp <= now) {
          // Token đã hết hạn ngay lập tức
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return;
        }
        // Token còn hiệu lực → setToken, rồi tải user
        setToken(storedToken);
        loadUser();
        // Thiết lập timeout tự logout khi token hết hạn
        const ttl = payload.exp - now; // time to live (giây)
        // Nếu còn dưới 1 phút, logout luôn để tránh race condition
        if (ttl < 60) {
          // Hết hạn trong dưới 1 phút → logout luôn
          logout();
        } else {
          // Hẹn giờ logout chính xác khi token exp
          setTimeout(() => {
            logout();
            toast({
              title: 'Phiên đã hết hạn',
              description: 'Vui lòng đăng nhập lại.',
              variant: 'destructive',
            });
          }, ttl * 1000);
        }
      } else {
        // Token không có exp hoặc decode fail → xóa luôn
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);

      // Sau khi login, decode token để tính thời gian logout tự động
      const payload = decodeToken(response.token);
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = payload.exp - now;
        // Nếu còn dưới 1 phút → logout luôn
        if (ttl < 60) {
          logout();
        } else {
          setTimeout(() => {
            logout();
            toast({
              title: 'Phiên đã hết hạn',
              description: 'Vui lòng đăng nhập lại.',
              variant: 'destructive',
            });
          }, ttl * 1000);
        }
      }

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${response.user.name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Lỗi đăng nhập';
      toast({
        title: "Lỗi đăng nhập",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);

      // Tương tự login, thiết lập timeout tự logout
      const payload = decodeToken(response.token);
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = payload.exp - now;
        if (ttl < 60) {
          logout();
        } else {
          setTimeout(() => {
            logout();
            toast({
              title: 'Phiên đã hết hạn',
              description: 'Vui lòng đăng nhập lại.',
              variant: 'destructive',
            });
          }, ttl * 1000);
        }
      }

      toast({
        title: "Đăng ký thành công",
        description: `Chào mừng ${response.user.name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Lỗi đăng ký';
      toast({
        title: "Lỗi đăng ký",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại!",
    });
  };

  // Hàm dùng cho OAuth callback: set token rồi gọi loadUser
  const setTokenAndLoadUser = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setIsLoading(true);

    // Giống login/register: thiết lập timeout auto logout
    const payload = decodeToken(newToken);
    if (payload && payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const ttl = payload.exp - now;
      if (ttl < 60) {
        logout();
      } else {
        setTimeout(() => {
          logout();
          toast({
            title: 'Phiên đã hết hạn',
            description: 'Vui lòng đăng nhập lại.',
            variant: 'destructive',
          });
        }, ttl * 1000);
      }
    }

    try {
      await loadUser();
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    setTokenAndLoadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
