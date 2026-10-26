const successStatuses = new Set(['STORED', 'AVAILABLE', 'DONE', 'READY', 'CONFIRMED', 'APPROVED']);
const infoStatuses = new Set(['FOUND', 'NEW', 'IN_PROGRESS', 'REQUESTED']);
const warningStatuses = new Set(['PREPARING', 'WAITING_APPROVAL', 'PENDING_APPROVAL']);
const dangerStatuses = new Set(['REJECTED']);

function getTone(status) {
  if (successStatuses.has(status)) return 'success';
  if (infoStatuses.has(status)) return 'info';
  if (warningStatuses.has(status)) return 'warning';
  if (dangerStatuses.has(status)) return 'danger';
  return 'neutral';
}

export default function StatusBadge({ status }) {
  const label = status === 'WAITING_APPROVAL'
    ? 'WAITING APPROVAL'
    : status.replaceAll('_', ' ');
  return <span className={`status-badge ${getTone(status)}`}>{label}</span>;
}
