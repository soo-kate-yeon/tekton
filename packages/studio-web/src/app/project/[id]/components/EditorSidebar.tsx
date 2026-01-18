import React from 'react';
import { Palette, Smartphone, Tablet, Monitor, Type, Layout, PaintBucket, ChevronRight, ChevronDown } from 'lucide-react';

export type NavCategory = 'template' | 'layout';
export type NavItem = 'color' | 'typography' | 'mobile' | 'tablet' | 'desktop';

interface EditorSidebarProps {
    activeCategory: NavCategory | null;
    activeItem: NavItem;
    onSelect: (category: NavCategory, item: NavItem) => void;
}

export function EditorSidebar({ activeCategory: _activeCategory, activeItem, onSelect }: EditorSidebarProps) {
    const [expanded, setExpanded] = React.useState<Record<NavCategory, boolean>>({
        template: true,
        layout: true,
    });

    const toggle = (category: NavCategory) => {
        setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <aside className="w-[240px] border-r border-border bg-card flex flex-col shrink-0 h-full">
            <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Editor</h2>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {/* Template Category */}
                <div className="mb-2">
                    <button
                        onClick={() => toggle('template')}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                        {expanded.template ? <ChevronDown className="w-4 h-4 mr-2 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 mr-2 text-muted-foreground" />}
                        <Palette className="w-4 h-4 mr-2 text-primary" />
                        Template
                    </button>

                    {expanded.template && (
                        <div className="pl-4 pr-2 space-y-1 mt-1">
                            <NavItemButton
                                active={activeItem === 'color'}
                                onClick={() => onSelect('template', 'color')}
                                icon={<PaintBucket className="w-3.5 h-3.5" />}
                                label="Color"
                            />
                            <NavItemButton
                                active={activeItem === 'typography'}
                                onClick={() => onSelect('template', 'typography')}
                                icon={<Type className="w-3.5 h-3.5" />}
                                label="Typography"
                            />
                        </div>
                    )}
                </div>

                {/* Layout Category */}
                <div className="mb-2">
                    <button
                        onClick={() => toggle('layout')}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                        {expanded.layout ? <ChevronDown className="w-4 h-4 mr-2 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 mr-2 text-muted-foreground" />}
                        <Layout className="w-4 h-4 mr-2 text-primary" />
                        Layout
                    </button>

                    {expanded.layout && (
                        <div className="pl-4 pr-2 space-y-1 mt-1">
                            <NavItemButton
                                active={activeItem === 'mobile'}
                                onClick={() => onSelect('layout', 'mobile')}
                                icon={<Smartphone className="w-3.5 h-3.5" />}
                                label="Mobile"
                            />
                            <NavItemButton
                                active={activeItem === 'tablet'}
                                onClick={() => onSelect('layout', 'tablet')}
                                icon={<Tablet className="w-3.5 h-3.5" />}
                                label="Tablet"
                            />
                            <NavItemButton
                                active={activeItem === 'desktop'}
                                onClick={() => onSelect('layout', 'desktop')}
                                icon={<Monitor className="w-3.5 h-3.5" />}
                                label="Desktop"
                            />
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

function NavItemButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${active
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
