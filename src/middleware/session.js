import { auth } from "../config/auth.js";
import { User } from "../models/User.js";

export async function attachSession(request, response, next) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    request.session = session;

    if (session?.user?.email) {
      const profile = await User.findOne({ email: session.user.email.toLowerCase() });
      request.profile = profile;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(request, response, next) {
  if (!request.session?.user) {
    return response.status(401).json({ message: "Authentication required" });
  }

  next();
}

export function requireAdmin(request, response, next) {
  if (!request.profile || request.profile.role !== "admin") {
    return response.status(403).json({ message: "Admin access required" });
  }

  next();
}

export function syncRoleToSession(request, response, next) {
  if (request.session?.user && request.profile) {
    request.session.user.role = request.profile.role;
    request.session.user.image = request.profile.image || request.session.user.image;
  }

  next();
}
