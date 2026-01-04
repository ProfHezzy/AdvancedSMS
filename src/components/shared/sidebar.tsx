'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import {
    GraduationCap,
    LogOut,
    ChevronDown,
    ChevronRight,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';
import { ROLE_NAV_MAP, NavItem, NavGroup } from '@/config/navigation';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    role?: string;
}

export function Sidebar({ role = 'STUDENT' }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const navGroups = ROLE_NAV_MAP[role] || ROLE_NAV_MAP.STUDENT;

    // Persist collapse state (optional, browser only)
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved) setIsCollapsed(saved === 'true');
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    return (
        <aside
            className={cn(
                "h-screen bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col transition-all duration-300 ease-in-out relative z-50",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Collapse Toggle Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-20 bg-white border border-brand-100 rounded-full p-1 shadow-md hover:bg-brand-50 text-brand-600 transition-all z-50"
            >
                {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Logo Section */}
            <div className={cn(
                "h-20 flex items-center border-b border-brand-50/50 px-4",
                isCollapsed ? "justify-center" : "gap-3 px-6"
            )}>
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                {!isCollapsed && (
                    <div className="animate-in fade-in slide-in-from-left-2">
                        <h1 className="font-black text-xl tracking-tight text-gray-900">ASMS</h1>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-600">Pro Edition</p>
                    </div>
                )}
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
                {navGroups.map((group, gIdx) => (
                    <div key={group.group} className="space-y-2">
                        {!isCollapsed && (
                            <h3 className="px-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 animate-in fade-in">
                                {group.group}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    item={item}
                                    isCollapsed={isCollapsed}
                                    isActive={pathname === item.href || (item.items?.some(sub => pathname === sub.href) ?? false)}
                                    // isExpanded={expandedItems.includes(item.title)}
                                    // toggleExpand={() => toggleExpand(item.title)}
                                    pathname={pathname}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-brand-50/50 space-y-2">
                {!isCollapsed && (
                    <div className="px-4 py-3 rounded-xl bg-brand-50/50 border border-brand-100/50 mb-4 animate-in fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-200 to-brand-300 font-bold flex items-center justify-center text-brand-800 text-xs shadow-inner">
                                {role.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{role}</p>
                                <p className="text-[10px] text-brand-600 font-medium">Session Active</p>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                        "text-rose-600 hover:bg-rose-50 hover:shadow-sm active:scale-95 group",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    {!isCollapsed && <span className="animate-in fade-in">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

function SidebarItem({
    item,
    isCollapsed,
    isActive,
    pathname
}: {
    item: NavItem,
    isCollapsed: boolean,
    isActive: boolean,
    pathname: string
}) {
    const [isExpanded, setIsExpanded] = useState(isActive);
    const hasChildren = item.items && item.items.length > 0;
    const Icon = item.icon;

    // Update expanded state if path changes and is active
    useEffect(() => {
        if (isActive) setIsExpanded(true);
    }, [isActive]);

    return (
        <div className="space-y-1">
            <div
                className={cn(
                    "flex items-center justify-between group transition-all duration-200 rounded-xl cursor-pointer",
                    isActive && !hasChildren
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                        : "text-gray-600 hover:bg-white hover:text-brand-700 hover:shadow-soft active:scale-98",
                    isCollapsed ? "px-0 justify-center h-12" : "px-4 py-3"
                )}
                onClick={() => hasChildren && !isCollapsed && setIsExpanded(!isExpanded)}
            >
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                    <Icon className={cn(
                        "w-5 h-5 transition-transform",
                        isActive && !hasChildren ? "scale-110" : "group-hover:scale-110",
                    )} />
                    {!isCollapsed && (
                        <span className="font-semibold text-sm animate-in fade-in">
                            {hasChildren ? (
                                <span onClick={(e) => {
                                    // Allow clicking the title to navigate if it's not JUST a folder
                                    // For now, folders don't have separate content pages in most cases
                                }}>{item.title}</span>
                            ) : (
                                <Link href={item.href} className="flex-1">{item.title}</Link>
                            )}
                        </span>
                    )}
                </div>

                {!isCollapsed && hasChildren && (
                    <div className="transition-transform duration-200">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                )}

                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-[10px] rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {item.title}
                    </div>
                )}
            </div>

            {/* Sub-items */}
            {!isCollapsed && hasChildren && isExpanded && (
                <div className="ml-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.items?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                            <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                    "block py-2 px-3 text-xs font-semibold rounded-lg transition-all",
                                    isSubActive
                                        ? "text-brand-700 bg-brand-50/50"
                                        : "text-gray-500 hover:text-brand-600 hover:bg-white"
                                )}
                            >
                                {sub.title}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
