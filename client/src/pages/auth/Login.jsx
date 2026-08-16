import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard      from '../../components/auth/AuthCard';
import RoleSelector  from '../../components/auth/RoleSelector';
import LoginForm     from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [role, setRole] = useState('buyer');
  const navigate = useNavigate();
  const { login: signIn, loading, error, setError } = useAuth();

  const headings  = { buyer: 'Welcome Back', seller: 'Welcome Back' };
  const subtitles = {
    buyer:  'Sign in to your buyer account to start bidding.',
    seller: 'Sign in to your seller account to manage your listings.',
  };

  return (
    <AuthCard title={headings[role]} subtitle={subtitles[role]}>
      <RoleSelector selected={role} onChange={setRole} allowedRoles={['buyer', 'seller']} />
      <LoginForm role={role} onSubmit={async ({ email, password }) => {
        try {
          const result = await signIn({ email, password });
          const dest = result.user.role === 'admin' ? '/admin/dashboard'
            : result.user.role === 'seller' ? '/seller/dashboard' : '/dashboard';
          navigate(dest, { replace: true });
        } catch (err) {
          const data = err?.response?.data;
          setError(data?.message || err.message || 'Login failed. Check your email and password.');
        }
      }} loading={loading} error={error} />
    </AuthCard>
  );
}

export default Login;
