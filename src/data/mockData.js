// Mock data for the project management system

export const mockProjects = [
    {
        id: 1,
        name: "Redesign E-commerce",
        client: "Acme Corp",
        progress: 75,
        status: "Em Andamento",
        dueDate: "2023-10-24",
        priority: "high",
        type: "Web App",
        icon: "shopping_cart",
        color: "blue",
        team: [
            { id: 1, name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?img=1" },
            { id: 2, name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=2" },
            { id: 3, name: "Jessica Lee", avatar: "https://i.pravatar.cc/150?img=3" }
        ]
    },
    {
        id: 2,
        name: "App Mobile Delivery",
        client: "Foodies Inc",
        progress: 30,
        status: "Atrasado",
        dueDate: "2023-11-15",
        priority: "high",
        type: "Mobile App",
        icon: "smartphone",
        color: "purple",
        team: [
            { id: 4, name: "Tom Harris", avatar: "https://i.pravatar.cc/150?img=4" },
            { id: 5, name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=5" }
        ]
    },
    {
        id: 3,
        name: "Landing Page Q4",
        client: "TechStart",
        progress: 100,
        status: "Concluído",
        dueDate: "2023-10-01",
        priority: "medium",
        type: "Web App",
        icon: "web",
        color: "green",
        team: [
            { id: 6, name: "Alex Morgan", avatar: "https://i.pravatar.cc/150?img=6" }
        ]
    },
    {
        id: 4,
        name: "Sistema ERP",
        client: "Logistics Pro",
        progress: 15,
        status: "Planejamento",
        dueDate: "2024-01-10",
        priority: "low",
        type: "Web App",
        icon: "dns",
        color: "orange",
        team: [
            { id: 7, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=7" },
            { id: 8, name: "Lisa Brown", avatar: "https://i.pravatar.cc/150?img=8" }
        ]
    },
    {
        id: 5,
        name: "Consultoria SEO",
        client: "Fashion Brand",
        progress: 50,
        status: "Em Andamento",
        dueDate: "2023-11-30",
        priority: "medium",
        type: "Marketing",
        icon: "search_insights",
        color: "pink",
        team: [
            { id: 9, name: "Rachel Green", avatar: "https://i.pravatar.cc/150?img=9" }
        ]
    },
    {
        id: 6,
        name: "Dashboard Analytics",
        client: "DataViz Corp",
        progress: 85,
        status: "Em Andamento",
        dueDate: "2024-02-15",
        priority: "high",
        type: "Web App",
        icon: "analytics",
        color: "blue",
        team: [
            { id: 10, name: "Mark Stevens", avatar: "https://i.pravatar.cc/150?img=10" }
        ]
    },
    {
        id: 7,
        name: "CRM Integration",
        client: "SalesForce Pro",
        progress: 45,
        status: "Em Andamento",
        dueDate: "2024-03-01",
        priority: "medium",
        type: "Integration",
        icon: "sync",
        color: "purple",
        team: [
            { id: 11, name: "Anna White", avatar: "https://i.pravatar.cc/150?img=11" },
            { id: 12, name: "John Black", avatar: "https://i.pravatar.cc/150?img=12" }
        ]
    },
    {
        id: 8,
        name: "API Gateway",
        client: "CloudNet",
        progress: 60,
        status: "Em Andamento",
        dueDate: "2024-02-28",
        priority: "high",
        type: "Backend",
        icon: "api",
        color: "green",
        team: [
            { id: 13, name: "Steve Ross", avatar: "https://i.pravatar.cc/150?img=13" }
        ]
    },
    {
        id: 9,
        name: "Mobile Banking",
        client: "FinTech Bank",
        progress: 20,
        status: "Planejamento",
        dueDate: "2024-05-01",
        priority: "high",
        type: "Mobile App",
        icon: "account_balance",
        color: "orange",
        team: [
            { id: 14, name: "Diana Cruz", avatar: "https://i.pravatar.cc/150?img=14" },
            { id: 15, name: "Paul Martin", avatar: "https://i.pravatar.cc/150?img=15" }
        ]
    },
    {
        id: 10,
        name: "IoT Dashboard",
        client: "SmartHome Inc",
        progress: 90,
        status: "Em Andamento",
        dueDate: "2024-01-30",
        priority: "medium",
        type: "Web App",
        icon: "devices",
        color: "blue",
        team: [
            { id: 16, name: "Kevin Lee", avatar: "https://i.pravatar.cc/150?img=16" }
        ]
    },
    {
        id: 11,
        name: "E-learning Platform",
        client: "EduTech",
        progress: 100,
        status: "Concluído",
        dueDate: "2023-12-15",
        priority: "medium",
        type: "Web App",
        icon: "school",
        color: "green",
        team: [
            { id: 17, name: "Laura Smith", avatar: "https://i.pravatar.cc/150?img=17" },
            { id: 18, name: "Robert Brown", avatar: "https://i.pravatar.cc/150?img=18" }
        ]
    },
    {
        id: 12,
        name: "Inventory System",
        client: "Warehouse Plus",
        progress: 35,
        status: "Atrasado",
        dueDate: "2023-12-01",
        priority: "high",
        type: "Web App",
        icon: "inventory_2",
        color: "pink",
        team: [
            { id: 19, name: "Chris Walker", avatar: "https://i.pravatar.cc/150?img=19" }
        ]
    }
];

export const mockTasks = {
    backlog: [
        {
            id: "task-1",
            title: "Update landing page hero section graphics",
            tag: "DESIGN",
            tagColor: "blue",
            assignee: { name: "Sarah J.", avatar: "https://i.pravatar.cc/150?img=1" },
            comments: 2,
            attachments: 1
        },
        {
            id: "task-2",
            title: "Refactor user authentication API middleware",
            tag: "BACKEND",
            tagColor: "gray",
            assignee: null,
            subtasks: { completed: 0, total: 3 }
        },
        {
            id: "task-3",
            title: "Competitor analysis for Q3 features",
            tag: "RESEARCH",
            tagColor: "purple",
            assignee: { name: "Mike C.", avatar: "https://i.pravatar.cc/150?img=2" },
            dueDate: "Tomorrow",
            dueDateColor: "orange"
        }
    ],
    inProgress: [
        {
            id: "task-4",
            title: "Integrate Stripe payments for subscription model",
            tag: "HIGH PRIORITY",
            tagColor: "red",
            assignee: { name: "Tom H.", avatar: "https://i.pravatar.cc/150?img=4" },
            progress: 45,
            dueDate: "Today",
            dueDateColor: "red"
        },
        {
            id: "task-5",
            title: "Fix mobile menu collapse issue on iOS",
            tag: "FRONTEND",
            tagColor: "gray",
            assignee: { name: "Emma W.", avatar: "https://i.pravatar.cc/150?img=5" },
            progress: 75,
            dueDate: "Oct 24"
        }
    ],
    testing: [
        {
            id: "task-6",
            title: "Dark mode toggle switch animation",
            tag: "UI/UX",
            tagColor: "blue",
            assignee: { name: "Alex M.", avatar: "https://i.pravatar.cc/150?img=6" },
            status: "Ready",
            statusColor: "green"
        },
        {
            id: "task-7",
            title: "User profile image upload validation",
            tag: "SETTINGS",
            tagColor: "gray",
            assignee: { name: "Lisa B.", avatar: "https://i.pravatar.cc/150?img=8" },
            hasImage: true,
            comments: 4
        }
    ],
    done: [
        {
            id: "task-8",
            title: "Initial project repo setup",
            tag: "SETUP",
            tagColor: "green",
            assignee: { name: "David K.", avatar: "https://i.pravatar.cc/150?img=7" },
            completed: true
        },
        {
            id: "task-9",
            title: "Database schema definition v1",
            tag: "DB",
            tagColor: "green",
            assignee: { name: "Rachel G.", avatar: "https://i.pravatar.cc/150?img=9" },
            completed: true
        },
        {
            id: "task-10",
            title: "User personas documentation",
            tag: "RESEARCH",
            tagColor: "green",
            assignee: { name: "Sarah J.", avatar: "https://i.pravatar.cc/150?img=1" },
            completed: true
        }
    ]
};

export const mockActivities = [
    {
        id: 1,
        type: "comment",
        user: { name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?img=1" },
        action: "commented on",
        target: "#PROJ-12",
        message: "Uploaded the latest assets for the landing page.",
        time: "10m ago"
    },
    {
        id: 2,
        type: "status",
        icon: "check",
        iconColor: "green",
        title: "Task #402",
        action: "marked as complete",
        user: "Mike Chen",
        time: "1h ago"
    },
    {
        id: 3,
        type: "update",
        user: { name: "Jessica Lee", avatar: "https://i.pravatar.cc/150?img=3" },
        action: "updated status",
        message: "Moved 'Database Migration' to In Review",
        time: "2h ago"
    }
];

export const mockKPIs = {
    activeProjects: { value: 12, change: +2, trend: "up" },
    pendingTasks: { value: 45, change: -5, trend: "down" },
    criticalIssues: { value: 3, change: +1, trend: "up" },
    teamVelocity: { value: "+12%", trend: "up" }
};

export const mockTeamMembers = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Frontend Dev",
        avatar: "https://i.pravatar.cc/150?img=1",
        workload: 110,
        status: "Overloaded"
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "UI Designer",
        avatar: "https://i.pravatar.cc/150?img=2",
        workload: 80,
        status: "Optimal"
    },
    {
        id: 3,
        name: "Jessica Lee",
        role: "Backend Dev",
        avatar: "https://i.pravatar.cc/150?img=3",
        workload: 40,
        status: "Available"
    }
];
