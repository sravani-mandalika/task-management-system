const styles = {
  TODO: { bg: 'var(--neutral-soft)', color: 'var(--neutral)' },
  IN_PROGRESS: { bg: 'var(--warning-soft)', color: 'var(--warning)' },
  DONE: { bg: 'var(--success-soft)', color: 'var(--success)' },
  LOW: { bg: 'var(--neutral-soft)', color: 'var(--neutral)' },
  MEDIUM: { bg: 'var(--warning-soft)', color: 'var(--warning)' },
  HIGH: { bg: 'var(--danger-soft)', color: 'var(--danger)' }
};

function StatusBadge({ value }) {
  const style = styles[value] || styles.TODO;
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.02em'
      }}
    >
      {value.replace('_', ' ')}
    </span>
  );
}

export default StatusBadge;