export const getStatusColor = (status) => {
  return {
    OPEN: "bg-yellow-500",
    IN_PROGRESS: "bg-blue-500",
    RESOLVED: "bg-green-500",
    CLOSED: "bg-gray-500",
    REJECTED: "bg-red-500"
  }[status] || "bg-gray-500";
};

export const getPriorityBadgeColor = (priority) => {
  return {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
    URGENT: "bg-red-700"
  }[priority] || "bg-gray-500";
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
