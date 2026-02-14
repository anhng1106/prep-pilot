import { describe, it, expect } from "vitest";

import { getPageTitle } from "@/helpers/pageTitles";

describe("Get Page Title Helpers", () => {
  it("should return app page title and breadcrumb for known app route", () => {
    const result = getPageTitle("/app/dashboard");

    expect(result).toEqual({
      title: "App Dashboard",
      breadcrumb: [{ name: "Dashboard", path: "/app/dashboard" }],
    });
  });

  it("should return nested page title and breadcrumb for dynamic app route", () => {
    const result = getPageTitle("/app/interviews/abc123");

    expect(result).toEqual({
      title: "Interview Details",
      breadcrumb: [
        { name: "Interviews", path: "/app/interviews" },
        { name: "Details", path: "/app/interviews/:id" },
      ],
    });
  });

  it("should return admin page title and breadcrumb for admin route", () => {
    const result = getPageTitle("/admin/users");

    expect(result).toEqual({
      title: "Users Manage",
      breadcrumb: [{ name: "Users", path: "/admin/users" }],
    });
  });

  it("should return not found for unknown app route", () => {
    const result = getPageTitle("/app/unknown");

    expect(result).toEqual({
      title: "Page Not Found",
      breadcrumb: [{ name: "Not Found", path: "/" }],
    });
  });

  it("should return not found for unknown admin route", () => {
    const result = getPageTitle("/admin/unknown");

    expect(result).toEqual({
      title: "Page Not Found",
      breadcrumb: [{ name: "Not Found", path: "/" }],
    });
  });
});
