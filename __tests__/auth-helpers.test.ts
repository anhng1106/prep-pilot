import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import {
  getAuthCookieName,
  getAuthHeader,
  isAdminPath,
  isUserAdmin,
  isUserSubscribed,
} from "@/helpers/auth";

describe("Auth Helpers", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
  });

  describe("getAuthCookieName", () => {
    it("should return secure cookie name in production", () => {
      process.env.NODE_ENV = "production";

      expect(getAuthCookieName()).toBe("__Secure-next-auth.session-token");
    });

    it("should return default cookie name outside production", () => {
      process.env.NODE_ENV = "development";

      expect(getAuthCookieName()).toBe("next-auth.session-token");
    });
  });

  describe("getAuthHeader", () => {
    it("should return empty object when no cookie exists", () => {
      const cookies = {
        get: vi.fn().mockReturnValue(undefined),
      } as any;

      expect(getAuthHeader(cookies)).toEqual({});
    });

    it("should return Cookie header when session token exists", () => {
      process.env.NODE_ENV = "development";

      const cookies = {
        get: vi.fn().mockReturnValue({
          name: "next-auth.session-token",
          value: "token-value",
        }),
      } as any;

      expect(getAuthHeader(cookies)).toEqual({
        headers: {
          Cookie: "next-auth.session-token=token-value",
        },
      });
    });
  });

  describe("isUserAdmin", () => {
    it("should return true when user has admin role", () => {
      const user = { roles: ["user", "admin"] } as any;

      expect(isUserAdmin(user)).toBe(true);
    });

    it("should return false when user has no admin role", () => {
      const user = { roles: ["user"] } as any;

      expect(isUserAdmin(user)).toBe(false);
    });

    it("should return false when user roles are missing", () => {
      const user = {} as any;

      expect(isUserAdmin(user)).toBe(false);
    });
  });

  describe("isUserSubscribed", () => {
    it("should return true for active subscription", () => {
      const user = { subscription: { status: "active" } } as any;

      expect(isUserSubscribed(user)).toBe(true);
    });

    it("should return true for past-due subscription", () => {
      const user = { subscription: { status: "past-due" } } as any;

      expect(isUserSubscribed(user)).toBe(true);
    });

    it("should return false for canceled subscription", () => {
      const user = { subscription: { status: "canceled" } } as any;

      expect(isUserSubscribed(user)).toBe(false);
    });

    it("should return false when subscription is missing", () => {
      const user = {} as any;

      expect(isUserSubscribed(user)).toBe(false);
    });
  });

  describe("isAdminPath", () => {
    it("should return true for /admin routes", () => {
      expect(isAdminPath("/admin/users")).toBe(true);
    });

    it("should return true for /app/admin routes", () => {
      expect(isAdminPath("/app/admin/dashboard")).toBe(true);
    });

    it("should return false for non-admin routes", () => {
      expect(isAdminPath("/app/dashboard")).toBe(false);
    });
  });
});
