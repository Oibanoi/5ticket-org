import clientAxios, { clearSessionCache } from "./client";
import serverAxios from "./server";

export const api = typeof window !== "undefined" ? clientAxios : serverAxios;

export { clientAxios, serverAxios, clearSessionCache };

export { api as default };
