// Admin Authentication Types

export interface AdminStore {
  id: string;
  name: string;
  city: string;
  province: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isSuper: boolean;
  store: AdminStore | null;
}

export interface AdminAuthResponse {
  status: string;
  message: string;
  data: {
    admin: AdminUser;
    token: string;
  };
}

export interface AdminAuthState {
  id: string;
  name: string;
  email: string;
  isSuper: boolean;
  store: AdminStore | null;
  accessToken: string;
}

export interface AdminAuthStore {
  admin: AdminAuthState | null;
  setAuth: (auth: AdminAuthState) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isSuperAdmin: () => boolean;
}

export interface AdminApiError {
  response: {
    status: number;
    data: {
      status: string;
      message: string;
    };
  };
}
