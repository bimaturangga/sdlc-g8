export function getAvailableUnitCount(equipmentItem) {
  return equipmentItem?.units?.filter((unit) => !unit.maintenance).length ?? 0;
}

export function getMaintenanceUnitCount(equipmentItem) {
  return equipmentItem?.units?.filter((unit) => unit.maintenance).length ?? 0;
}

export function canCreateDemoRequest(equipmentItem) {
  return getAvailableUnitCount(equipmentItem) > 0;
}

export function getEquipmentName(equipment, equipmentId) {
  return equipment.find((item) => item.id === equipmentId)?.name ?? 'Unknown equipment';
}

export function createDemoRequest(requests, requestInput) {
  const equipmentId =
    typeof requestInput === 'object' ? requestInput.equipmentId : requestInput;
  const studentName =
    typeof requestInput === 'object' ? requestInput.studentName : '';
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
    studentName: studentName || 'Mahasiswa Demo',
    studentNim: studentNim || '-',
    studentProdi: studentProdi || '-',
    status,
    unitId: '',
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
