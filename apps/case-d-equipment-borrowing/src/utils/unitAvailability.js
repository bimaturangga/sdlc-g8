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
