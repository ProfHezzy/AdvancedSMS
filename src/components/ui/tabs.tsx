"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{ activeTab: string, setActiveTab: (v: string) => void }>({ activeTab: '', setActiveTab: () => { } })

const Tabs = ({ defaultValue, children, className }: { defaultValue: string, children: React.ReactNode, className?: string }) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    )
}

const TabsList = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400", className)}>
        {children}
    </div>
)

const TabsTrigger = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeTab === value ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50" : "hover:bg-slate-200/50",
                className
            )}
            onClick={() => setActiveTab(value)}
        >
            {children}
        </button>
    )
}

const TabsContent = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
    const { activeTab } = React.useContext(TabsContext)
    if (activeTab !== value) return null
    return (
        <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
