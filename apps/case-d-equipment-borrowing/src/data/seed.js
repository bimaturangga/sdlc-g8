const equipment = [
  {
    id: 'EQ-001',
    name: 'Digital Camera',
    category: 'Media Equipment',
    units: 2,
  },
  {
    id: 'EQ-002',
    name: 'Tripod',
    category: 'Media Equipment',
    units: 3,
  },
  {
    id: 'EQ-003',
    name: 'Wireless Microphone',
    category: 'Audio Equipment',
    units: 0,
  },
  {
    id: 'EQ-004',
    name: 'Portable Projector',
    category: 'Presentation Equipment',
    units: 1,
  },
  {
    id: 'EQ-005',
    name: 'Drawing Tablet',
    category: 'Computer Equipment',
    units: 2,
  },
  {
    id: 'EQ-006',
    name: 'Extension Cable',
    category: 'General Equipment',
    units: 0,
  },
];

const requests = [
  {
    id: 'REQ-001',
    equipmentId: 'EQ-002',
    status: 'REQUESTED',
    unitId: 'EQ-002-U01',
    startDate: '2026-10-26',
    endDate: '2026-10-28',
  },
  {
    id: 'REQ-002',
    equipmentId: 'EQ-004',
    status: 'REQUESTED',
    unitId: 'EQ-004-U01',
    startDate: '2026-10-27',
    endDate: '2026-10-29',
  },
];

export function createSeedData() {
  return {
    equipment: equipment.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      units: Array.from({ length: item.units }, (_, index) => ({
        id: `${item.id}-U${String(index + 1).padStart(2, '0')}`,
        maintenance: false,
      })),
    })),
    requests: requests.map((request) => ({ ...request })),
  };
}

export function migrateStoredData(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    !Array.isArray(value.equipment) ||
    !Array.isArray(value.requests)
  ) {
    return null;
  }

  const migratedEquipment = value.equipment.map((item) => {
    if (!item || typeof item !== 'object') return item;
    if (Array.isArray(item.units)) return item;
    if (!Number.isInteger(item.availableUnits) || item.availableUnits < 0) return item;

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      units: Array.from({ length: item.availableUnits }, (_, index) => ({
        id: `${item.id}-U${String(index + 1).padStart(2, '0')}`,
        maintenance: Boolean(item.maintenance),
      })),
    };
  });

  const migratedRequests = value.requests.map((request) =>
    request && typeof request === 'object'
      ? { unitId: '', startDate: '', endDate: '', ...request }
      : request,
  );

  return { equipment: migratedEquipment, requests: migratedRequests };
}
