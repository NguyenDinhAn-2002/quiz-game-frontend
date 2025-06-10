import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenAndLoadUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Lưu token, load user và redirect
      setTokenAndLoadUser(token)
        .then(() => {
          navigate('/'); // về trang home hoặc dashboard sau khi login thành công
        })
        .catch(() => {
          navigate('/login'); // nếu lỗi thì về login lại
        });
    } else {
      navigate('/login'); // nếu không có token thì về login
    }
  }, [searchParams, setTokenAndLoadUser, navigate]);

  return (
    <div>
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default AuthSuccess;
