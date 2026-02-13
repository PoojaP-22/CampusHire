export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatCurrency = (amount) => {
  if (!amount) return '—';
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

export const getStatusColor = (status) => {
  const map = {
    'Applied': 'accent', 'Under Review': 'warning', 'Shortlisted': 'accent',
    'Interview Scheduled': 'warning', 'Interview Completed': 'accent',
    'Selected': 'success', 'Rejected': 'danger', 'Withdrawn': 'muted',
    'Published': 'success', 'Draft': 'warning', 'Closed': 'danger',
    'Active': 'success', 'Inactive': 'danger', 'Pending': 'warning',
    'Verified': 'success', 'Approved': 'success',
  };
  return map[status] || 'accent';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const truncate = (str, len = 80) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
};
