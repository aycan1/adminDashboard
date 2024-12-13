import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import { CircularProgress, Box } from '@mui/material';

export const ProtectedRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateAuth = async () => {
      const hasToken = AuthService.isAuthenticated();
      if (!hasToken) {
        setIsValidating(false);
        return;
      }

      try {
        const isValidToken = await AuthService.validateToken();
        setIsValid(isValidToken);
      } catch {
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, []);

  if (isValidating) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}; 