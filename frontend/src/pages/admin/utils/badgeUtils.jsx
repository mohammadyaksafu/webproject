export const getStatusBadge = (status) => {
  const statusColors = {
    PENDING: 'bg-yellow-500 text-white',
    APPROVED: 'bg-green-500 text-white',
    REJECTED: 'bg-red-500 text-white',
    SUSPENDED: 'bg-gray-500 text-white'
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export const getRoleBadge = (role) => {
  const roleColors = {
    STUDENT: 'bg-blue-500 text-white',
    STAFF: 'bg-purple-500 text-white',
    TEACHER: 'bg-indigo-500 text-white',
    ADMIN: 'bg-red-500 text-white',
    CANTEEN_MANAGER: 'bg-orange-500 text-white'
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[role]}`}>
      {role}
    </span>
  );
};