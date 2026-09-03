export type Role = 'admin' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarInitials: string
}

export interface AuthState {
  user: User | null
  token: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}
