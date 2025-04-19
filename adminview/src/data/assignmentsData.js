export const assignments = [
  {
    id: 1,
    title: "Document Review",
    description: "Review and process land registration documents",
    assignedTo: "worker1",
    status: "pending",
    deadline: "2023-12-15",
    priority: "high",
    department: "Field Operations"
  },
  {
    id: 2,
    title: "Field Inspection",
    description: "Conduct on-site inspection of agricultural land",
    assignedTo: "worker1",
    status: "in-progress",
    deadline: "2023-12-20",
    priority: "medium",
    department: "Field Operations"
  },
  {
    id: 3,
    title: "Report Filing",
    description: "File quarterly reports for the agriculture department",
    assignedTo: "worker1",
    status: "pending",
    deadline: "2023-12-25",
    priority: "low",
    department: "Field Operations"
  },
  {
    id: 4,
    title: "Land Survey Verification",
    description: "Verify recent land survey reports from district offices",
    assignedTo: "worker2",
    status: "pending",
    deadline: "2023-12-18",
    priority: "high",
    department: "Document Processing"
  },
  {
    id: 5,
    title: "Process Tax Forms",
    description: "Process and file incoming property tax forms",
    assignedTo: "worker2",
    status: "in-progress",
    deadline: "2023-12-22",
    priority: "medium",
    department: "Document Processing"
  }
];

// Fix: Simplified export (remove object wrapper)
export default assignments;
