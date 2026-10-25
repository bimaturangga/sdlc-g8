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

export function createDemoRequest(requests, equipmentId) {
  const nextNumber =
    requests.reduce((largest, request) => {
      const number = Number(request.id.split('-').at(-1));
      return Number.isFinite(number) ? Math.max(largest, number) : largest;
    }, 0) + 1;

  return {
    id: `REQ-${String(nextNumber).padStart(3, '0')}`,
    equipmentId,
    status: 'REQUESTED',
    unitId: '',
    startDate: '',
    endDate: '',
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
