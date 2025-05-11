import { userTypeEnum } from "../_db/enum";

export type UserInfo = {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  companyName: string;
  role: string;
  isActive: boolean;
};

export type UserRole = "admin" | "expert" | "client";

export type UserDetailResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  companyName: string;
  joinDate: string;
  lastLogin: string;
  lastUpdated: string;
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: userTypeEnum.client | userTypeEnum.expert | userTypeEnum.admin;
  isActive: boolean;
  companyId: string;
  joinDate: Date;
  lastLogin: Date;
  updatedAt: Date;
}

export interface UserAnalyticsResponse {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface CreateUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    companyId: string;
    role: string;
  };
}
