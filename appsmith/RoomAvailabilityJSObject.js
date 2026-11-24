export default {
  bookings: [
    { title: "Data Structures Lecture", start: 9 * 60, end: 10 * 60 },
    { title: "Algorithms Lab", start: 11 * 60, end: 12 * 60 },
    { title: "Faculty Meeting", start: 15 * 60, end: 16 * 60 }
  ],

  checkRoom() {
    const rawTime = (StartTimeInput.text || "").trim();
    const duration = Number(DurationInput.text);
    const isBlocked = BlockedCheckbox.isChecked;

    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(rawTime);
    if (!match) {
      return "Unavailable [INVALID_INPUT]: Use HH:MM format (e.g. 12:30).";
    }

    const startMin = Number(match[1]) * 60 + Number(match[2]);
    const currentMin = 8 * 60;

    if (startMin <= currentMin) {
      return "Unavailable [START_AFTER_NOW]: Start time must be after 08:00.";
    }

    if (!Number.isFinite(duration) || duration <= 0 || duration > 120) {
      return "Unavailable [INVALID_DURATION]: Duration must be 1 to 120 min.";
    }

    const endMin = startMin + duration;
    if (endMin > 1440) {
      return "Unavailable [OUT_OF_RANGE]: Must end before 24:00.";
    }

    if (isBlocked) {
      return "Unavailable [ROOM_BLOCKED]: Room A-101 is blocked.";
    }

    const conflict = this.bookings.find((b) => startMin < b.end && b.start < endMin);
    if (conflict) {
      return `Unavailable [OVERLAP]: Overlaps with ${conflict.title}.`;
    }

    return "Available [AVAILABLE]: Room A-101 is available.";
  }
};
