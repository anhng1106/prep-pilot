import { describe, it, expect } from "vitest";
import {
  formatTime,
  paginate,
  getTotalPages,
  updateSearchParams,
} from "@/helpers/helper";

describe("Helper Functions", () => {
  describe("formatTime", () => {
    it("should format seconds to MM:SS", () => {
      expect(formatTime(125)).toBe("02:05");
    });

    it("should handle zero seconds", () => {
      expect(formatTime(0)).toBe("00:00");
    });

    it("should handle single digit seconds", () => {
      expect(formatTime(5)).toBe("00:05");
    });

    it("should handle single digit minutes", () => {
      expect(formatTime(65)).toBe("01:05");
    });

    it("should handle large times", () => {
      expect(formatTime(3661)).toBe("61:01");
    });

    it("should pad zeros correctly", () => {
      expect(formatTime(600)).toBe("10:00");
      expect(formatTime(1)).toBe("00:01");
    });
  });

  describe("paginate", () => {
    const mockData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it("should return first page items", () => {
      const result = paginate(mockData, 1, 3);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should return second page items", () => {
      const result = paginate(mockData, 2, 3);
      expect(result).toEqual([4, 5, 6]);
    });

    it("should return last page with fewer items", () => {
      const result = paginate(mockData, 4, 3);
      expect(result).toEqual([10]);
    });

    it("should return empty array for page beyond data", () => {
      const result = paginate(mockData, 10, 3);
      expect(result).toEqual([]);
    });

    it("should handle items per page larger than data", () => {
      const result = paginate(mockData, 1, 20);
      expect(result).toEqual(mockData);
    });

    it("should work with page 1 and items per page 1", () => {
      const result = paginate(mockData, 1, 1);
      expect(result).toEqual([1]);
    });

    it("should work with generic types", () => {
      const stringData = ["a", "b", "c", "d"];
      const result = paginate(stringData, 1, 2);
      expect(result).toEqual(["a", "b"]);
    });
  });

  describe("getTotalPages", () => {
    it("should calculate total pages correctly", () => {
      expect(getTotalPages(10, 3)).toBe(4);
    });

    it("should return 1 when items fit in one page", () => {
      expect(getTotalPages(3, 10)).toBe(1);
    });

    it("should handle exact division", () => {
      expect(getTotalPages(9, 3)).toBe(3);
    });

    it("should handle zero items", () => {
      expect(getTotalPages(0, 3)).toBe(0);
    });

    it("should handle one item", () => {
      expect(getTotalPages(1, 1)).toBe(1);
    });

    it("should round up correctly", () => {
      expect(getTotalPages(11, 3)).toBe(4);
    });
  });

  describe("updateSearchParams", () => {
    it("should update existing parameter", () => {
      const params = new URLSearchParams("status=active");
      const result = updateSearchParams(params, "status", "inactive");
      expect(result.get("status")).toBe("inactive");
    });

    it("should append new parameter", () => {
      const params = new URLSearchParams("status=active");
      const result = updateSearchParams(params, "page", "2");
      expect(result.get("page")).toBe("2");
      expect(result.get("status")).toBe("active");
    });

    it("should handle empty params", () => {
      const params = new URLSearchParams();
      const result = updateSearchParams(params, "search", "test");
      expect(result.get("search")).toBe("test");
    });

    it("should return the same URLSearchParams instance", () => {
      const params = new URLSearchParams();
      const result = updateSearchParams(params, "key", "value");
      expect(result).toBe(params);
    });
  });
});
