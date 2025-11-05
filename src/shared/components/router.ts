const baseURL = "/events";
export const Routers = {
  HOME: "/",

  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT: "/auth/forgot",
  RESET: "/auth/reset",

  // Events/races
  EVENTS: baseURL,
  EVENTS_CREATE: baseURL + "/create",
  EVENT_DETAIL_OVERVIEW: baseURL + "/[id]",

  // Orders
  ORDERS: "/admin/orders",
  EMPLOYEES: "/admin/employees",
  TOOLS: "/admin/tools",
  VOLUNTEER: "/admin/tools/volunteer",
  RECONCILIATION: "/admin/reconciliation",
  CHALLENGE: "/admin/challenge",

  // Documents
  DOCUMENTS: "/admin/documentation",

  // Configs
  CONFIGS: "/admin/configs",
};
export const EventRouters = {
  EDIT: baseURL + "/[id]/edit",
  OVERVIEW: baseURL + "/[id]",
  DETAIL: baseURL + "/[id]/detail",
  ORDER: baseURL + "/[id]/order",
  // ATHLETE: baseURL + "/[id]/athlete",
  // VOUCHER: baseURL + "/[id]/voucher",
  // STAFF: baseURL + "/[id]/staff",
  TICKET: baseURL + "/[id]/ticket",
  // REPORT: baseURL + "/[id]/report",
  // GROUP: baseURL + "/[id]/group",
};
export const ChallengeRouters = {
  EDIT: "/admin/challenge/edit/[id]",
  CREATE: "/admin/challenge/create",
};
