import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import RoleSelector from '../../components/auth/RoleSelector';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [role, setRole] = useState('buyer');
  const navigate = useNavigate();
  const { register: signUp, loading, error, setError } = useAuth();

  const subtitles = {
    buyer:  'Create your buyer account and start bidding today.',
    seller: 'Create your seller account and list your first item.',
  };

  return (
    <AuthCard title="Create an Account" subtitle={subtitles[role]} className="max-w-lg">
      <RoleSelector selected={role} onChange={setRole} allowedRoles={['buyer', 'seller']} />
      <RegisterForm role={role} onSubmit={async ({ name, username, email, phone, password, confirmPassword }) => {
        try {
          const result = await signUp({ name, username, email, phone, password, confirmPassword, role });
          navigate(result.user.role === 'seller' ? '/seller/dashboard' : '/dashboard', { replace: true });
        } catch (err) {
          const data = err?.response?.data;
          if (data?.errors?.length) {
            setError(data.errors.map((e) => e.message).join('. '));
          } else {
            setError(data?.message || err.message || 'Registration failed');
          }
        }
      }} loading={loading} error={error} />
    </AuthCard>
  );
}

export default Register;
