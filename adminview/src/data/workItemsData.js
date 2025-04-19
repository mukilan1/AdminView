export const workItems = [
  {
    id: "WRK001",
    title: "Land Survey for Agricultural Development",
    description: "Complete land survey for new agricultural development project in northern district.",
    department: "Agriculture",
    region: "North",
    assignedOfficer: "worker1",
    assignedOfficerName: "Michael Smith",
    startDate: "2023-11-10",
    dueDate: "2023-12-20",
    status: "in-progress",
    progress: 65,
    priority: "high",
    notes: [
      { date: "2023-11-12", author: "Michael Smith", content: "Initial survey completed for 40% of the area." },
      { date: "2023-11-25", author: "Michael Smith", content: "Encountered issues with property boundaries in sector B4." }
    ],
    documents: [
      { name: "Initial Survey Report", type: "pdf", uploadDate: "2023-11-15" },
      { name: "Property Maps", type: "image", uploadDate: "2023-11-20" }
    ]
  },
  {
    id: "WRK002",
    title: "Tax Collection Drive for Commercial Properties",
    description: "Execute tax collection campaign for all commercial properties in the central business district.",
    department: "Revenue",
    region: "Central",
    assignedOfficer: "worker2",
    assignedOfficerName: "Lisa Wong",
    startDate: "2023-11-15",
    dueDate: "2023-12-15",
    status: "in-progress",
    progress: 40,
    priority: "high",
    notes: [
      { date: "2023-11-18", author: "Lisa Wong", content: "Notifications sent to all property owners." },
      { date: "2023-11-28", author: "Lisa Wong", content: "40% of dues collected, following up with remaining owners." }
    ],
    documents: [
      { name: "Notification Template", type: "docx", uploadDate: "2023-11-15" },
      { name: "Collection Report - Week 1", type: "pdf", uploadDate: "2023-11-22" }
    ]
  },
  {
    id: "WRK003",
    title: "Rural Road Infrastructure Assessment",
    description: "Assess condition of rural roads and identify maintenance priorities for upcoming budget allocation.",
    department: "Infrastructure",
    region: "South",
    assignedOfficer: "worker1",
    assignedOfficerName: "Michael Smith",
    startDate: "2023-11-05",
    dueDate: "2023-12-05",
    status: "pending",
    progress: 10,
    priority: "medium",
    notes: [
      { date: "2023-11-08", author: "Michael Smith", content: "Initial planning completed, preparing for field visits." }
    ],
    documents: [
      { name: "Assessment Framework", type: "pdf", uploadDate: "2023-11-07" }
    ]
  },
  {
    id: "WRK004",
    title: "Public Health Facility Audit",
    description: "Conduct comprehensive audit of all public health facilities in the eastern region.",
    department: "Health",
    region: "East",
    assignedOfficer: "worker2",
    assignedOfficerName: "Lisa Wong",
    startDate: "2023-10-25",
    dueDate: "2023-12-10",
    status: "in-progress",
    progress: 75,
    priority: "high",
    notes: [
      { date: "2023-10-30", author: "Lisa Wong", content: "Completed audit of 3 major hospitals." },
      { date: "2023-11-15", author: "Lisa Wong", content: "Completed audit of 12 primary health centers." },
      { date: "2023-11-25", author: "Lisa Wong", content: "Draft report being prepared with findings and recommendations." }
    ],
    documents: [
      { name: "Audit Checklist", type: "pdf", uploadDate: "2023-10-26" },
      { name: "Hospital Reports", type: "pdf", uploadDate: "2023-11-02" },
      { name: "Primary Centers Report", type: "pdf", uploadDate: "2023-11-18" }
    ]
  },
  {
    id: "WRK005",
    title: "Agricultural Subsidy Distribution",
    description: "Distribute approved agricultural subsidies to eligible farmers in the western region.",
    department: "Agriculture",
    region: "West",
    assignedOfficer: "worker1",
    assignedOfficerName: "Michael Smith",
    startDate: "2023-11-20",
    dueDate: "2023-12-25",
    status: "pending",
    progress: 5,
    priority: "medium",
    notes: [
      { date: "2023-11-22", author: "Michael Smith", content: "Finalizing eligible farmer list based on submitted applications." }
    ],
    documents: [
      { name: "Subsidy Guidelines", type: "pdf", uploadDate: "2023-11-20" },
      { name: "Application Form Template", type: "docx", uploadDate: "2023-11-21" }
    ]
  },
  {
    id: "WRK006",
    title: "Urban Development Planning Review",
    description: "Review and provide feedback on the proposed urban development plans for the central district.",
    department: "Urban Planning",
    region: "Central",
    assignedOfficer: "worker2",
    assignedOfficerName: "Lisa Wong",
    startDate: "2023-11-12",
    dueDate: "2023-12-12",
    status: "in-progress",
    progress: 50,
    priority: "high",
    notes: [
      { date: "2023-11-15", author: "Lisa Wong", content: "Initial review of zoning proposals completed." },
      { date: "2023-11-25", author: "Lisa Wong", content: "Meeting with planning committee to discuss infrastructure requirements." }
    ],
    documents: [
      { name: "Zoning Proposal", type: "pdf", uploadDate: "2023-11-13" },
      { name: "Infrastructure Assessment", type: "pdf", uploadDate: "2023-11-26" }
    ]
  }
];

// Get unique departments, regions, and statuses for filters
export const getDepartments = () => [...new Set(workItems.map(item => item.department))];
export const getRegions = () => [...new Set(workItems.map(item => item.region))];
export const getStatuses = () => [...new Set(workItems.map(item => item.status))];

export default workItems;
