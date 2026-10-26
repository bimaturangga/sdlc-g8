import { getUnitsWithStatus, UNIT_STATUS } from './unitAvailability.js';

export function getAvailableUnitCount(equipmentItem, requests = [], period) {
  if (!equipmentItem?.units) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const availablePeriod = period ?? { start: today, end: today };

  return getUnitsWithStatus(equipmentItem, requests, availablePeriod).filter(
    (unit) => unit.status === UNIT_STATUS.AVAILABLE,
  ).length;
}

export function getMaintenanceUnitCount(equipmentItem) {
  return equipmentItem?.units?.filter((unit) => unit.maintenance).length ?? 0;
}

export function canCreateDemoRequest(equipmentItem, requests = [], period) {
  return getAvailableUnitCount(equipmentItem, requests, period) > 0;
}

export function getEquipmentName(equipment, equipmentId) {
  return equipment.find((item) => item.id === equipmentId)?.name ?? 'Unknown equipment';
}

export function createDemoRequest(requests, requestInput) {
  const equipmentId =
    typeof requestInput === 'object' ? requestInput.equipmentId : requestInput;
  const unitId =
    typeof requestInput === 'object' && requestInput.unitId ? requestInput.unitId : '';
  const studentName =
    typeof requestInput === 'object' ? requestInput.studentName : '';
  const studentId =
    typeof requestInput === 'object' ? requestInput.studentId : '';
  const studentNim =
    typeof requestInput === 'object' ? requestInput.studentNim : '';
  const studentProdi =
    typeof requestInput === 'object' ? requestInput.studentProdi : '';
  const startDate =
    typeof requestInput === 'object' ? requestInput.startDate : '';
  const endDate =
    typeof requestInput === 'object' ? requestInput.endDate : '';
  const status =
    typeof requestInput === 'object' && requestInput.status
      ? requestInput.status
      : 'WAITING_APPROVAL';

  const nextNumber =
    requests.reduce((largest, request) => {
      const number = Number(request.id.split('-').at(-1));
      return Number.isFinite(number) ? Math.max(largest, number) : largest;
    }, 0) + 1;

  return {
    id: `REQ-${String(nextNumber).padStart(3, '0')}`,
    equipmentId,
    studentId,
    studentName: studentName || 'Mahasiswa Demo',
    studentNim: studentNim || '-',
    studentProdi: studentProdi || '-',
    status,
    unitId,
    startDate: startDate || '',
    endDate: endDate || '',
  };
}

export function getNextUnitId(equipmentItem) {
  const nextNumber =
    (equipmentItem?.units ?? []).reduce((largest, unit) => {
      const number = Number(unit.id.split('-U').at(-1));
      return Number.isFinite(number) ? Math.max(largest, number) : largest;
    }, 0) + 1;

  return `${equipmentItem.id}-U${String(nextNumber).padStart(2, '0')}`;
}
