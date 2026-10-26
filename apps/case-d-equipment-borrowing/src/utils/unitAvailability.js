export const UNIT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  MAINTENANCE: 'MAINTENANCE',
};

const INACTIVE_REQUEST_STATUSES = new Set(['REJECTED', 'CANCELLED', 'RETURNED']);

export function isValidPeriod(period) {
  return Boolean(period?.start) && Boolean(period?.end) && period.start <= period.end;
}

function overlapsPeriod(request, period) {
  if (!request.startDate || !request.endDate) return false;
  return request.startDate <= period.end && request.endDate >= period.start;
}

export function getUnitStatus(unit, requests, period) {
  if (unit.maintenance) return { status: UNIT_STATUS.MAINTENANCE, request: null };

  const request = requests.find(
    (item) =>
      item.unitId === unit.id &&
      !INACTIVE_REQUEST_STATUSES.has(item.status) &&
      overlapsPeriod(item, period),
  );

  return request
    ? { status: UNIT_STATUS.RESERVED, request }
    : { status: UNIT_STATUS.AVAILABLE, request: null };
}

export function getUnitsWithStatus(equipmentItem, requests, period) {
  return equipmentItem.units.map((unit) => ({
    unit,
    ...getUnitStatus(unit, requests, period),
  }));
}

// ==========================================
// ST-05: Deteksi Request Beririsan (Hasbi)
// ==========================================

export function isDateRangeOverlapping(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false;
  return startA <= endB && endA >= startB;
}

export function detectUnitConflicts(requests = []) {
  // Filter hanya request aktif yang sudah memiliki unitId
  const activeRequests = requests.filter(
    (req) => req.unitId && !INACTIVE_REQUEST_STATUSES.has(req.status)
  );

  const conflictingRequestIds = new Set();
  const conflictsByUnit = {};

  // Membandingkan setiap pasangan request
  for (let i = 0; i < activeRequests.length; i++) {
    for (let j = i + 1; j < activeRequests.length; j++) {
      const reqA = activeRequests[i];
      const reqB = activeRequests[j];

      if (
        reqA.unitId === reqB.unitId &&
        isDateRangeOverlapping(reqA.startDate, reqA.endDate, reqB.startDate, reqB.endDate)
      ) {
        conflictingRequestIds.add(reqA.id);
        conflictingRequestIds.add(reqB.id);

        if (!conflictsByUnit[reqA.unitId]) {
          conflictsByUnit[reqA.unitId] = [];
        }
        conflictsByUnit[reqA.unitId].push([reqA.id, reqB.id]);
      }
    }
  }

  return {
    hasConflict: conflictingRequestIds.size > 0,
    conflictingRequestIds: Array.from(conflictingRequestIds),
    conflictsByUnit,
  };
}