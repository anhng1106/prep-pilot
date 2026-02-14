import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Dashboard from "@/components/dashboard/Dashboard";

const mockUseSession = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

vi.mock("@/components/dashboard/DashboardStats", () => ({
  default: ({ totalInterviews, completionRate, subscriptionStatus }: any) => (
    <div>
      <span>{`total:${totalInterviews}`}</span>
      <span>{`rate:${completionRate}`}</span>
      <span>{`sub:${subscriptionStatus}`}</span>
    </div>
  ),
}));

vi.mock("@/components/dashboard/DashboardStatsChart", () => ({
  default: ({ stats }: any) => <div>{`chart:${stats.length}`}</div>,
}));

vi.mock("@/components/date-picker/StatsDatePicker", () => ({
  default: () => <div>date-picker</div>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
  });

  it("should render stats chart and subscription status from session", () => {
    mockUseSession.mockReturnValue({
      data: { user: { subscription: { status: "active" } } },
    });

    render(
      <Dashboard
        data={{
          totalInterviews: 3,
          completionRate: 75,
          subscriptionStatus: "ignored",
          stats: [
            {
              date: "2024-01-01",
              totalInterviews: 1,
              completedQuestions: 2,
              unansweredQuestions: 1,
              completionRate: 66,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("chart:1")).toBeTruthy();
    expect(screen.getByText("sub:active")).toBeTruthy();
    expect(screen.getByText("date-picker")).toBeTruthy();
  });

  it("should render empty state and default subscription status when no stats", () => {
    mockUseSession.mockReturnValue({ data: null });

    render(
      <Dashboard
        data={{
          totalInterviews: 0,
          completionRate: 0,
          subscriptionStatus: "ignored",
          stats: [],
        }}
      />,
    );

    expect(
      screen.getByText(
        "No interview stats available for the selected date range.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("sub:free")).toBeTruthy();
  });
});
