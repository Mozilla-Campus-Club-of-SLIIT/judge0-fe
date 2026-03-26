export type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  private: boolean;
  createdAt: string;
  updatedAt: string;
  connections?: Array<{
    provider: string;
    providerUserId: string;
    providerUserName: string;
    providerAccountEmail: string;
    linkedAt: string;
  }>;
};

export type AuthContextType = {
  user: User | null;
  authToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export type LoginResponse = {
  data: {
    token: string;
  };
};

export type UserResponse = {
  data: User;
};
