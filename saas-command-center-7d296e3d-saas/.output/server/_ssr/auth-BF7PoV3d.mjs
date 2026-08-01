import { i as clearToken, l as setToken, r as authApi, t as ApiError } from "./api-D5gYHQcL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BF7PoV3d.js
var KEY = "nexus-auth";
function getSession() {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : null;
}
function persist(session) {
	window.localStorage.setItem(KEY, JSON.stringify(session));
	return session;
}
/**
* Sign in against Flask `/api/auth/login`.
* If the backend is not reachable, we still create a local demo session
* so the mock-driven admin UI keeps working.
*/
async function signIn(email, password) {
	try {
		const { access_token, user } = await authApi.login(email, password);
		setToken(access_token);
		return persist({
			email: user.email,
			name: user.name || "Admin",
			role: user.role || "admin",
			loginAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) throw err;
		return persist({
			email,
			name: "Super Admin",
			role: "super_admin",
			loginAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
}
function signOut() {
	window.localStorage.removeItem(KEY);
	clearToken();
}
//#endregion
export { signIn as n, signOut as r, getSession as t };
