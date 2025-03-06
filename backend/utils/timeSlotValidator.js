// utils/timeSlotValidator.js

/**
 * Validates a time slot string format
 * @param {string} timeSlot - Time slot in format "HH:MM AM/PM - HH:MM AM/PM"
 * @returns {boolean} True if valid, false otherwise
*/

exports.validateTimeSlotFormat = (timeSlot) => {
    // Regex for time slot format: "HH:MM AM/PM - HH:MM AM/PM"
    const timeSlotRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)\s?-\s?(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;

    return timeSlotRegex.test(timeSlot);
};

/**
 * Checks if a time slot is valid (start time before end time)
 * @param {string} timeSlot - Time slot in format "HH:MM AM/PM - HH:MM AM/PM"
 * @returns {boolean} True if valid, false otherwise
 */
exports.validateTimeSlot = (timeSlot) => {
    if (!exports.validateTimeSlotFormat(timeSlot)) {
        return false;
    }

    // Split the time slot into start and end times
    const [startTime, endTime] = timeSlot.split('-').map(time => time.trim());

    // Convert times to Date objects for comparison
    const today = new Date();
    const startDate = convertTimeStringToDate(startTime, today);
    const endDate = convertTimeStringToDate(endTime, today);

    // Check if start time is before end time
    return startDate < endDate;
};

/**
 * Checks if two time slots overlap
 * @param {string} slot1 - First time slot in format "HH:MM AM/PM - HH:MM AM/PM"
 * @param {string} slot2 - Second time slot in format "HH:MM AM/PM - HH:MM AM/PM"
 * @returns {boolean} True if slots overlap, false otherwise
 */
exports.doTimeSlotsOverlap = (slot1, slot2) => {
    if (!exports.validateTimeSlotFormat(slot1) || !exports.validateTimeSlotFormat(slot2)) {
        return false;
    }

    const [startTime1, endTime1] = slot1.split('-').map(time => time.trim());
    const [startTime2, endTime2] = slot2.split('-').map(time => time.trim());

    // Convert times to Date objects for comparison
    const today = new Date();
    const startDate1 = convertTimeStringToDate(startTime1, today);
    const endDate1 = convertTimeStringToDate(endTime1, today);
    const startDate2 = convertTimeStringToDate(startTime2, today);
    const endDate2 = convertTimeStringToDate(endTime2, today);

    // Check for overlap
    // Slots overlap if one starts before the other ends
    return (startDate1 < endDate2 && startDate2 < endDate1);
};

/**
 * Calculates the duration of a time slot in minutes
 * @param {string} timeSlot - Time slot in format "HH:MM AM/PM - HH:MM AM/PM"
 * @returns {number} Duration in minutes, or -1 if format is invalid
 */
exports.calculateTimeSlotDuration = (timeSlot) => {
    if (!exports.validateTimeSlotFormat(timeSlot)) {
        return -1;
    }

    const [startTime, endTime] = timeSlot.split('-').map(time => time.trim());

    // Convert times to Date objects for calculation
    const today = new Date();
    const startDate = convertTimeStringToDate(startTime, today);
    const endDate = convertTimeStringToDate(endTime, today);

    // Calculate duration in minutes
    const durationMs = endDate - startDate;
    return Math.floor(durationMs / (1000 * 60));
};

/**
 * Checks if a time slot falls within working hours
 * @param {string} timeSlot - Time slot in format "HH:MM AM/PM - HH:MM AM/PM"
 * @param {string} workingHoursStart - Working hours start time in format "HH:MM AM/PM"
 * @param {string} workingHoursEnd - Working hours end time in format "HH:MM AM/PM"
 * @returns {boolean} True if time slot is within working hours, false otherwise
 */
exports.isTimeSlotWithinWorkingHours = (timeSlot, workingHoursStart, workingHoursEnd) => {
    if (!exports.validateTimeSlotFormat(timeSlot)) {
        return false;
    }

    const [startTime, endTime] = timeSlot.split('-').map(time => time.trim());

    // Convert times to Date objects for comparison
    const today = new Date();
    const slotStartDate = convertTimeStringToDate(startTime, today);
    const slotEndDate = convertTimeStringToDate(endTime, today);
    const workingStartDate = convertTimeStringToDate(workingHoursStart, today);
    const workingEndDate = convertTimeStringToDate(workingHoursEnd, today);

    // Check if slot is within working hours
    return (slotStartDate >= workingStartDate && slotEndDate <= workingEndDate);
};

/**
 * Generates time slots of specified duration within a time range
 * @param {string} startTime - Range start time in format "HH:MM AM/PM"
 * @param {string} endTime - Range end time in format "HH:MM AM/PM"
 * @param {number} durationMinutes - Duration of each slot in minutes
 * @returns {Array<string>} Array of time slots in format "HH:MM AM/PM - HH:MM AM/PM"
 */
exports.generateTimeSlots = (startTime, endTime, durationMinutes) => {
    const today = new Date();
    const startDate = convertTimeStringToDate(startTime, today);
    const endDate = convertTimeStringToDate(endTime, today);

    const slots = [];
    let currentStartTime = new Date(startDate);

    while (currentStartTime < endDate) {
        // Calculate end time for this slot
        const currentEndTime = new Date(currentStartTime.getTime() + durationMinutes * 60000);

        // If this slot goes beyond the end time, break
        if (currentEndTime > endDate) {
            break;
        }

        // Format times
        const formattedStartTime = formatTimeString(currentStartTime);
        const formattedEndTime = formatTimeString(currentEndTime);

        // Add slot to array
        slots.push(`${formattedStartTime} - ${formattedEndTime}`);

        // Move to next slot
        currentStartTime = currentEndTime;
    }

    return slots;
};

/**
 * Helper function to convert a time string to a Date object
 * @param {string} timeString - Time in format "HH:MM AM/PM"
 * @param {Date} baseDate - Base date to use
 * @returns {Date} Date object representing the time
 */
function convertTimeStringToDate(timeString, baseDate) {
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
    const match = timeString.match(timeRegex);

    if (!match) {
        throw new Error(`Invalid time format: ${timeString}`);
    }

    let [, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }

    const result = new Date(baseDate);
    result.setHours(hours, minutes, 0, 0);

    return result;
}

/**
 * Helper function to format a Date object as a time string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string in "HH:MM AM/PM" format
 */
function formatTimeString(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
}