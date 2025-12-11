// Application routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;

// Helper type for route values
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
