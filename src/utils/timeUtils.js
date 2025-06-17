// utils/timeUtils.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTimeWithWIB = (timeString) => {
  if (!timeString) return "-";
  const [hours, minutes] = timeString.split(".").map(Number);
  const jakartaTime = dayjs
    .utc()
    .set("hour", hours)
    .set("minute", minutes)
    .tz("Asia/Jakarta");
  return jakartaTime.format("HH:mm") + " WIB";
};

export const parseTime = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(".").map(Number);
  const jakartaTime = dayjs.tz(
    { hour: hours, minute: minutes, second: 0 },
    "Asia/Jakarta"
  );
  return jakartaTime.toDate();
};

export const formatDate = (date) => {
  return dayjs.tz(date, "Asia/Jakarta").format("D MMMM YYYY");
};

export const formatDateTimeWithWIB = (dateString) => {
  if (!dateString) return "Invalid Date WIB";

  try {
    console.log("Input date string:", dateString);
    // Parse timestamp as UTC, then convert to Jakarta (WIB) timezone
    const dateInJakarta = dayjs.utc(dateString).tz("Asia/Jakarta");
    console.log("Parsed date (UTC then Jakarta):", dateInJakarta.format());

    if (!dateInJakarta.isValid()) {
      console.log("Invalid date detected");
      return "Invalid Date WIB";
    }

    // Format: 11 Juni 2025 pukul 17:00 WIB
    const formatted = `${dateInJakarta.format(
      "D MMMM YYYY"
    )} pukul ${dateInJakarta.format("HH:mm")} WIB`;
    console.log("Formatted result:", formatted);
    return formatted;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date WIB";
  }
};

export const extractTimeOnly = (timeString) => {
  if (!timeString) return "-";

  // Ganti titik jadi titik dua agar bisa diproses
  const correctedTime = timeString.replace(/\./g, ":");

  // Pisahkan jam dan menit
  const [hours, minutes] = correctedTime.split(":");

  // Return format jam:menit
  return `${hours}:${minutes}`;
};
