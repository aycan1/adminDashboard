import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: User['role'][];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}; 