import { describe, it, expect } from "vitest";
import { checkAvailability } from "../src/lib/checkAvailability";

const NOW_0800 = 8 * 60; // 480 minutes

function createRoomA101() {
  return {
    id: "A-101",
    name: "Room A-101",
    isBlocked: false,
    bookings: [
      { id: "b1", title: "09:00–10:00", startMinutes: 9 * 60, endMinutes: 10 * 60 },
      { id: "b2", title: "11:00–12:00", startMinutes: 11 * 60, endMinutes: 12 * 60 },
      { id: "b3", title: "15:00–16:00", startMinutes: 15 * 60, endMinutes: 16 * 60 }
    ]
  };
}

describe("Room A-101 Acceptance Tests (T1–T8)", () => {
  it("T1: valid free interval (12:30, 60 min, unblocked) -> Available", () => {
    const room = createRoomA101();
    const res = checkAvailability(room, 12 * 60 + 30, 60, NOW_0800);
    expect(res.available).toBe(true);
  });

  it("T2: overlap with existing booking (11:30, 45 min, unblocked) -> Unavailable", () => {
    const room = createRoomA101();
    const res = checkAvailability(room, 11 * 60 + 30, 45, NOW_0800);
    expect(res.available).toBe(false);
  });

  it("T3: blocked room -> Unavailable", () => {
    const room = { ...createRoomA101(), isBlocked: true };
    const res = checkAvailability(room, 12 * 60 + 30, 60, NOW_0800);
    expect(res.available).toBe(false);
  });

  it("T4: duration = 0 -> validation error", () => {
    const room = createRoomA101();
    const res = checkAvailability(room, 12 * 60 + 30, 0, NOW_0800);
    expect(res.available).toBe(false);
  });

  it("T5: duration = 121 minutes -> validation error", () => {
    const room = createRoomA101();
    const res = checkAvailability(room, 12 * 60 + 30, 121, NOW_0800);
    expect(res.available).toBe(false);
  });

  it("T6: past start time (07:30, 30 min) -> validation error", () => {
    const room = createRoomA101();
    const res = checkAvailability(room, 7 * 60 + 30, 30, NOW_0800);
    expect(res.available).toBe(false);
  });

  it("T7: adjacent non-overlapping interval (10:00, 60 min) -> Available", () => {
    const room = createRoomA101();
    const res = checkAvailability(room, 10 * 60, 60, NOW_0800);
    expect(res.available).toBe(true);
  });

  it("T8: booking data remains unchanged after checks", () => {
    const room = createRoomA101();
    const snapshot = structuredClone(room.bookings);

    checkAvailability(room, 12 * 60 + 30, 60, NOW_0800);
    checkAvailability(room, 11 * 60 + 30, 45, NOW_0800);
    checkAvailability(room, 10 * 60, 60, NOW_0800);

    expect(room.bookings).toEqual(snapshot);
  });
});
