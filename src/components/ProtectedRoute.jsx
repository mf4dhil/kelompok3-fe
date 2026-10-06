import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getMe } from '../services/authService';

/**
 * ProtectedRoute checks authentication and optionally a required role.
 * If the user is not authenticated, they are redirected to the login page.
 * If a `requiredRole` is provided and the user does not have that role,
 * they are also redirected to the login page.
 *
 * Usage:
 * <Route element={<ProtectedRoute requiredRole="admin" />}>...</Route>
 */
export default function ProtectedRoute({ requiredRole }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(null); // null = still checking, false = not logged in, true = authorized

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await getMe();
        if (user && user.role) {
          if (requiredRole) {
            setAuthorized(user.role === requiredRole);
          } else {
            setAuthorized(true);
          }
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        // Jika getMe gagal (biasanya cookie tidak kirim), cek localStorage token
        const token = localStorage.getItem('token');
        if (token && requiredRole) {
          // Jika ada token tapi requiredRole dicek, cek role dari token decode sederhana
          // atau fallback ke false
          setAuthorized(false);
        } else if (token && !requiredRole) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [requiredRole]);

  // Jika masih loading, tampilkan null (bisa dianti spinner jika ada)
  if (checking) {
    return null;
  }

  // Jika authorized adalah null (belum tentu), anggap tidak authorized
  if (authorized === null) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes via Outlet
  return <Outlet />;
}
