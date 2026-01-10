'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu Context
 * -----------------------------------------------------------------------------------------------*/
interface DropdownMenuContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
}
const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined);

function useDropdownMenu() {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("useDropdownMenu must be used within DropdownMenu");
    return context;
}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/
export function DropdownMenu({ children, open: controlledOpen, onOpenChange }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = React.useCallback((newOpen: boolean) => {
        if (onOpenChange) onOpenChange(newOpen);
        if (!isControlled) setUncontrolledOpen(newOpen);
    }, [isControlled, onOpenChange]);

    // Close on click outside
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, setOpen]);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div ref={ref} className="relative inline-block text-left">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
}

export function DropdownMenuTrigger({ asChild, children, className, onClick, ...props }: any) {
    const { open, setOpen } = useDropdownMenu();

    // Check if child is a button or similar and clone it?
    // For simplicity, just wrap or handle click. 
    // Shadcn usually uses Slot (asChild).
    // If we don't have Slot, we can just render a div or clone element.
    // Let's assume standardized simple usage: usually a Button is passed.

    return (
        <div
            className={cn("cursor-pointer", className)}
            onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export function DropdownMenuContent({ align = "end", children, className, ...props }: any) {
    const { open } = useDropdownMenu();

    if (!open) return null;

    const alignClass = align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

    return (
        <div
            className={cn(
                "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
                alignClass,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function DropdownMenuItem({ className, children, onClick, ...props }: any) {
    const { setOpen } = useDropdownMenu();

    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
                setOpen(false);
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export function DropdownMenuLabel({ className, ...props }: any) {
    return (
        <div className={cn("px-2 py-1.5 text-sm font-bold opacity-75", className)} {...props} />
    );
}

export function DropdownMenuSeparator({ className, ...props }: any) {
    return (
        <div className={cn("-mx-1 my-1 h-px bg-neutral-100", className)} {...props} />
    );
}

// Simplified SubMenu Mock - Full recursion is hard without primitives, 
// so we'll just render it as a group for now or simple nested item.
export function DropdownMenuSub({ children }: any) {
    return <>{children}</>;
}

export function DropdownMenuSubTrigger({ children, className, ...props }: any) {
    return (
        <div
            className={cn(
                "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                className
            )}
            {...props}
        >
            {children}
            <ChevronRight className="ml-auto h-4 w-4" />
        </div>
    );
}

export function DropdownMenuSubContent({ children, className }: any) {
    // Basic indentation for "sub content" visual since we don't have real popping
    return (
        <div className={cn("pl-4 border-l border-brand-50 my-1", className)}>
            {children}
        </div>
    );
}
