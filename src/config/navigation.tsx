import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    ClipboardList,
    Wallet,
    Settings,
    GraduationCap,
    Home,
    Clock,
    FileText,
    CheckCircle2,
    BarChart3,
    Megaphone,
    MessageSquare,
    Bell,
    Shield,
    Stethoscope,
    Briefcase,
    FileSpreadsheet,
    PenTool,
    UserCircle,
    Key,
    Lock,
    Eye,
    LifeBuoy,
    HeartPulse,
    Activity,
    UserPlus,
    UserMinus,
    DollarSign,
    Receipt,
    Target,
    Map,
    ScrollText,
    History,
    AlertCircle,
    LockKeyhole,
    Fingerprint,
    Search,
    ListTodo,
    PieChart,
    Workflow,
    Plus
} from 'lucide-react';
import { ElementType } from 'react';

export interface NavItem {
    title: string;
    href: string;
    icon: ElementType;
    items?: { title: string; href: string }[];
}

export interface NavGroup {
    group: string;
    items: NavItem[];
}

export const TEACHER_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/teacher', icon: Home },
            { title: 'Today’s Schedule', href: '/dashboard/teacher/schedule', icon: Clock },
            { title: 'Notifications', href: '/dashboard/communication/announcements', icon: Bell },
        ]
    },
    {
        group: 'Students',
        items: [
            { title: 'My Classes', href: '/dashboard/teacher/classes', icon: Users },
            { title: 'Class Lists', href: '/dashboard/teacher/class-lists', icon: ListTodo },
            { title: 'Student Profiles', href: '/dashboard/students', icon: UserCircle },
            { title: 'Student Admission', href: '/dashboard/teacher/students/admission', icon: UserPlus },
            { title: 'Attendance', href: '/dashboard/teacher/attendance', icon: CheckCircle2 },
            { title: 'Behavior / Remarks', href: '/dashboard/teacher/remarks', icon: PenTool },
        ]
    },
    {
        group: 'Subjects & Classes',
        items: [
            { title: 'Assigned Subjects', href: '/dashboard/subjects', icon: BookOpen },
            { title: 'Class Timetable', href: '/dashboard/teacher/timetable', icon: Calendar },
            { title: 'Lesson Plans', href: '/dashboard/teacher/lesson-plans', icon: ScrollText },
            { title: 'Scheme of Work', href: '/dashboard/teacher/scheme', icon: FileSpreadsheet },
        ]
    },
    {
        group: 'Assessments',
        items: [
            {
                title: 'Assignments',
                href: '/dashboard/teacher/assignments',
                icon: ClipboardList,
                items: [
                    { title: 'Create Assignment', href: '/dashboard/teacher/assignments/new' },
                    { title: 'Manage Assignments', href: '/dashboard/teacher/assignments' },
                    { title: 'Submissions', href: '/dashboard/teacher/assignments/submissions' },
                ]
            },
            {
                title: 'Tests',
                href: '/dashboard/teacher/tests',
                icon: Target,
                items: [
                    { title: 'Create Test', href: '/dashboard/teacher/tests/new' },
                    { title: 'Manage Tests', href: '/dashboard/teacher/tests' },
                    { title: 'Submissions', href: '/dashboard/teacher/tests/submissions' },
                ]
            },
            {
                title: 'Examinations',
                href: '/dashboard/teacher/exams',
                icon: FileText,
                items: [
                    { title: 'Create Exam', href: '/dashboard/teacher/exams/new' },
                    { title: 'Generate Exam Token', href: '/dashboard/teacher/exams/tokens' },
                    { title: 'Manage Exams', href: '/dashboard/teacher/exams' },
                    { title: 'Exam Submissions', href: '/dashboard/teacher/exams/submissions' },
                ]
            },
        ]
    },
    {
        group: 'Results & Reports',
        items: [
            { title: 'Continuous Assessment', href: '/dashboard/results/ca', icon: BarChart3 },
            { title: 'Exam Scores', href: '/dashboard/results/exams', icon: PieChart },
            { title: 'Result Compilation', href: '/dashboard/results/compilation', icon: Workflow },
            { title: 'Report Sheet Preview', href: '/dashboard/results/preview', icon: Eye },
            { title: 'Submit Results', href: '/dashboard/results/submit', icon: CheckCircle2 },
        ]
    },
    {
        group: 'Communication',
        items: [
            { title: 'Parent Messages', href: '/dashboard/communication/messages?type=parent', icon: MessageSquare },
            { title: 'Student Messages', href: '/dashboard/communication/messages?type=student', icon: MessageSquare },
            { title: 'Class Announcements', href: '/dashboard/communication/announcements?filter=class', icon: Megaphone },
            { title: 'Notices', href: '/dashboard/communication/notices', icon: Bell },
        ]
    },
    {
        group: 'Analytics',
        items: [
            { title: 'Class Performance', href: '/dashboard/analytics/class', icon: BarChart3 },
            { title: 'Subject Performance', href: '/dashboard/analytics/subject', icon: TrendingUpIcon },
            { title: 'Student Progress', href: '/dashboard/analytics/student', icon: Activity },
        ]
    },
    {
        group: 'Settings',
        items: [
            { title: 'Profile', href: '/dashboard/settings/profile', icon: UserCircle },
            { title: 'Security', href: '/dashboard/settings/security', icon: Shield },
            { title: 'Preferences', href: '/dashboard/settings/notifications', icon: Settings },
        ]
    }
];

// Helper icon for Trend (replacing TrendingUp which might be confusing)
function TrendingUpIcon(props: any) {
    return <BarChart3 {...props} />;
}

export const STUDENT_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/student', icon: Home },
            { title: 'Academic Summary', href: '/dashboard/student/performance', icon: BarChart3 },
            { title: 'Notifications', href: '/dashboard/communication/announcements', icon: Bell },
        ]
    },
    {
        group: 'My Classes',
        items: [
            { title: 'Subjects', href: '/dashboard/student/subjects', icon: BookOpen },
            { title: 'Timetable', href: '/dashboard/student/timetable', icon: Calendar },
            { title: 'Attendance', href: '/dashboard/student/attendance', icon: CheckCircle2 },
            { title: 'Teachers', href: '/dashboard/student/teachers', icon: Users },
        ]
    },
    {
        group: 'Assessments',
        items: [
            {
                title: 'Assignments',
                href: '/dashboard/student/assignments',
                icon: ClipboardList,
                items: [
                    { title: 'Available', href: '/dashboard/student/assignments/available' },
                    { title: 'Submitted', href: '/dashboard/student/assignments/submitted' },
                    { title: 'Graded', href: '/dashboard/student/assignments/graded' },
                ]
            },
            {
                title: 'Tests',
                href: '/dashboard/student/tests',
                icon: Target,
                items: [
                    { title: 'Available', href: '/dashboard/student/tests/available' },
                    { title: 'Attempted', href: '/dashboard/student/tests/attempted' },
                ]
            },
            {
                title: 'Examinations',
                href: '/dashboard/student/exams',
                icon: FileText,
                items: [
                    { title: 'Enter Exam Token', href: '/dashboard/student/assessments' },
                    { title: 'Attempt Exam', href: '/dashboard/student/exams/attempt' },
                    { title: 'Exam History', href: '/dashboard/student/exams/history' },
                ]
            },
        ]
    },
    {
        group: 'Results',
        items: [
            { title: 'Current Term', href: '/dashboard/results/current', icon: PieChart },
            { title: 'Previous Terms', href: '/dashboard/results/history', icon: History },
            { title: 'Report Sheet', href: '/dashboard/results/report-sheet', icon: FileText },
        ]
    },
    {
        group: 'Communication',
        items: [
            { title: 'Teacher Messages', href: '/dashboard/communication/messages?type=teacher', icon: MessageSquare },
            { title: 'Management', href: '/dashboard/communication/messages?type=admin', icon: MessageSquare },
            { title: 'Announcements', href: '/dashboard/communication/announcements', icon: Megaphone },
        ]
    },
    {
        group: 'Groups',
        items: [
            { title: 'My Groups', href: '/dashboard/student/groups', icon: Users },
            { title: 'Create Group', href: '/dashboard/student/groups/new', icon: Plus },
            { title: 'Group Chats', href: '/dashboard/student/groups/chats', icon: MessageSquare },
        ]
    },
    {
        group: 'Settings',
        items: [
            { title: 'Profile', href: '/dashboard/settings/profile', icon: UserCircle },
            { title: 'Security', href: '/dashboard/settings/security', icon: Shield },
            { title: 'Preferences', href: '/dashboard/settings/preferences', icon: Settings },
        ]
    }
];

export const PARENT_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/parent', icon: Home },
            { title: 'Notifications', href: '/dashboard/communication/announcements', icon: Bell },
            { title: 'Ward Summary', href: '/dashboard/parent/wards-summary', icon: Users },
        ]
    },
    {
        group: 'My Wards',
        items: [
            { title: 'Ward Profiles', href: '/dashboard/parent/wards', icon: UserCircle },
            { title: 'Academic Progress', href: '/dashboard/parent/performance', icon: BarChart3 },
            { title: 'Attendance', href: '/dashboard/parent/attendance', icon: CheckCircle2 },
        ]
    },
    {
        group: 'Results',
        items: [
            { title: 'Term Results', href: '/dashboard/parent/results', icon: PieChart },
            { title: 'Report Sheets', href: '/dashboard/parent/report-sheets', icon: FileText },
            { title: 'Performance Analytics', href: '/dashboard/parent/analytics', icon: Activity },
        ]
    },
    {
        group: 'Wallet & Payments',
        items: [
            { title: 'Wallet Overview', href: '/dashboard/parent/wallet', icon: Wallet },
            { title: 'Fund Wallet', href: '/dashboard/parent/wallet/fund', icon: DollarSign },
            { title: 'Pay Fees', href: '/dashboard/parent/fees', icon: Receipt },
            { title: 'Payment History', href: '/dashboard/parent/wallet/transactions', icon: History },
        ]
    },
    {
        group: 'Communication',
        items: [
            { title: 'Class Teacher', href: '/dashboard/communication/messages?type=teacher', icon: MessageSquare },
            { title: 'Management', href: '/dashboard/communication/messages?type=admin', icon: MessageSquare },
            { title: 'Announcements', href: '/dashboard/communication/announcements', icon: Megaphone },
        ]
    },
    {
        group: 'Documents',
        items: [
            { title: 'Fee Invoices', href: '/dashboard/parent/invoices', icon: ScrollText },
            { title: 'School Notices', href: '/dashboard/communication/notices', icon: Bell },
        ]
    },
    {
        group: 'Settings',
        items: [
            { title: 'Profile', href: '/dashboard/settings/profile', icon: UserCircle },
            { title: 'Security', href: '/dashboard/settings/security', icon: Shield },
        ]
    }
];

export const HR_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/hr', icon: Home },
            { title: 'Staff Metrics', href: '/dashboard/hr/metrics', icon: BarChart3 },
        ]
    },
    {
        group: 'Staff Management',
        items: [
            { title: 'All Staff', href: '/dashboard/hr/staff', icon: Users },
            { title: 'Teaching Staff', href: '/dashboard/hr/staff/teachers', icon: Users },
            { title: 'Staff Profiles', href: '/dashboard/hr/staff/profiles', icon: UserCircle },
        ]
    },
    {
        group: 'Attendance & Leave',
        items: [
            { title: 'Attendance Records', href: '/dashboard/hr/attendance', icon: CheckCircle2 },
            { title: 'Leave Requests', href: '/dashboard/hr/leave', icon: Calendar },
            { title: 'Approvals', href: '/dashboard/hr/approvals', icon: CheckCircle2 },
        ]
    },
    {
        group: 'Payroll',
        items: [
            { title: 'Salary Structure', href: '/dashboard/hr/payroll/structure', icon: DollarSign },
            { title: 'Staff Salaries', href: '/dashboard/hr/payroll/salaries', icon: Receipt },
            { title: 'Payslips', href: '/dashboard/hr/payroll/payslips', icon: FileText },
        ]
    },
    {
        group: 'Records',
        items: [
            { title: 'Appointments', href: '/dashboard/hr/records/appointments', icon: ScrollText },
            { title: 'Promotions', href: '/dashboard/hr/records/promotions', icon: TrendingUpIcon },
        ]
    }
];

export const MEDICAL_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/medical', icon: Home },
            { title: 'Alerts', href: '/dashboard/medical/alerts', icon: AlertCircle },
        ]
    },
    {
        group: 'Students Health',
        items: [
            { title: 'Health Profiles', href: '/dashboard/medical/profiles', icon: HeartPulse },
            { title: 'Medical History', href: '/dashboard/medical/history', icon: History },
            { title: 'Allergies', href: '/dashboard/medical/allergies', icon: Activity },
        ]
    },
    {
        group: 'Medical Logs',
        items: [
            { title: 'Clinic Visits', href: '/dashboard/medical/visits', icon: Stethoscope },
            { title: 'Treatments', href: '/dashboard/medical/treatments', icon: CrossIcon },
            { title: 'Incidents', href: '/dashboard/medical/incidents', icon: AlertCircle },
        ]
    }
];

function CrossIcon(props: any) {
    return <Activity {...props} />;
}

export const SECURITY_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/security', icon: Home },
            { title: 'Alerts', href: '/dashboard/security/alerts', icon: Shield },
        ]
    },
    {
        group: 'Access Control',
        items: [
            { title: 'Visitor Logs', href: '/dashboard/security/visitors', icon: UserCircle },
            { title: 'Student Movement', href: '/dashboard/security/movement/students', icon: Map },
            { title: 'Staff Movement', href: '/dashboard/security/movement/staff', icon: Map },
        ]
    },
    {
        group: 'Incident Management',
        items: [
            { title: 'Report Incident', href: '/dashboard/security/incidents/new', icon: AlertCircle },
            { title: 'Incident History', href: '/dashboard/security/incidents', icon: History },
        ]
    }
];

export const ACCOUNTANT_NAV: NavGroup[] = [
    {
        group: 'Dashboard',
        items: [
            { title: 'Overview', href: '/dashboard/finance', icon: Home },
            { title: 'Financial Stats', href: '/dashboard/finance/stats', icon: BarChart3 },
        ]
    },
    {
        group: 'Wallets',
        items: [
            { title: 'Active Wallets', href: '/dashboard/finance/wallets', icon: Wallet },
            { title: 'Reconciliation', href: '/dashboard/finance/wallets/reconcile', icon: CheckCircle2 },
            { title: 'Virtual Accounts', href: '/dashboard/finance/virtual-accounts', icon: Fingerprint },
        ]
    },
    {
        group: 'Fees & Payments',
        items: [
            { title: 'Fee Configuration', href: '/dashboard/finance/fees', icon: Settings },
            { title: 'Payment Records', href: '/dashboard/finance/payments', icon: Receipt },
            { title: 'Pending Dues', href: '/dashboard/finance/fees/pending', icon: AlertCircle },
        ]
    },
    {
        group: 'Reports',
        items: [
            { title: 'Daily Revenue', href: '/dashboard/finance/reports/daily', icon: FileSpreadsheet },
            { title: 'Termly Audit', href: '/dashboard/finance/reports/audit', icon: History },
            { title: 'Income Statement', href: '/dashboard/finance/reports/income', icon: FileText },
        ]
    }
];

export const ADMIN_NAV: NavGroup[] = [
    {
        group: 'System',
        items: [
            { title: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
            { title: 'Audit Logs', href: '/dashboard/admin/audit', icon: History },
        ]
    },
    {
        group: 'Users & Roles',
        items: [
            { title: 'User Management', href: '/dashboard/admin/users', icon: Users },
            { title: 'Student Admission', href: '/dashboard/admin/admission', icon: UserPlus },
            { title: 'Role Management', href: '/dashboard/admin/roles', icon: Shield },
            { title: 'Permissions', href: '/dashboard/admin/permissions', icon: LockKeyhole },
        ]
    },
    {
        group: 'School Setup',
        items: [
            { title: 'Sessions', href: '/dashboard/admin/sessions', icon: Calendar },
            { title: 'Terms', href: '/dashboard/admin/terms', icon: Clock },
            { title: 'Classes', href: '/dashboard/admin/classes', icon: Users },
            { title: 'Subjects', href: '/dashboard/admin/subjects', icon: BookOpen },
            { title: 'Timetable', href: '/dashboard/admin/timetable', icon: Calendar },
        ]
    },
    {
        group: 'Settings',
        items: [
            { title: 'Profile', href: '/dashboard/settings/profile', icon: UserCircle },
            { title: 'Security', href: '/dashboard/settings/security', icon: Shield },
            { title: 'Preferences', href: '/dashboard/settings/notifications', icon: Settings },
        ]
    }
];

export const ROLE_NAV_MAP: Record<string, NavGroup[]> = {
    ADMIN: ADMIN_NAV,
    SUPER_ADMIN: ADMIN_NAV,
    TEACHER: TEACHER_NAV,
    STUDENT: STUDENT_NAV,
    PARENT: PARENT_NAV,
    HR: HR_NAV,
    MEDICAL: MEDICAL_NAV,
    SECURITY: SECURITY_NAV,
    ACCOUNTANT: ACCOUNTANT_NAV,
};
