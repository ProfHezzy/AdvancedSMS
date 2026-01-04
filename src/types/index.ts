import { Role } from '@prisma/client';

export type UserRole = Role;

export interface DashboardStats {
    totalStudents: number;
    activeCourses: number;
    assessments: number;
    avgPerformance: number;
}

export interface NavItem {
    label: string;
    href: string;
    icon: any;
}

export interface ActivityItem {
    id: string;
    title: string;
    description: string;
    timestamp: Date;
}
