import React from 'react';
import { NavCategory, NavItem } from './EditorSidebar';

interface PresetItem {
    id: number;
    name: string;
    description?: string | null;
}

interface SettingsPanelProps {
    activeCategory: NavCategory | null;
    activeItem: NavItem;
    // Props needed for Theme/Color settings
    presets?: PresetItem[];
    activePresetId?: number;
    onSelectPreset?: (id: number) => void;
}

export function SettingsPanel({
    activeCategory,
    activeItem,
    presets = [],
    activePresetId,
    onSelectPreset
}: SettingsPanelProps) {

    return (
        <div className="w-[320px] border-r border-border bg-card flex flex-col shrink-0 h-full">
            <div className="h-10 border-b border-border flex items-center px-4 shadow-sm">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {activeCategory} / {activeItem}
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeCategory === 'template' && activeItem === 'color' && (
                    <ColorSettings
                        presets={presets}
                        activePresetId={activePresetId}
                        onSelectPreset={onSelectPreset}
                    />
                )}

                {activeCategory === 'template' && activeItem === 'typography' && (
                    <TypographySettings />
                )}

                {activeCategory === 'layout' && (
                    <LayoutSettings mode={activeItem as 'mobile' | 'tablet' | 'desktop'} />
                )}
            </div>
        </div>
    );
}

// Sub-components for specific settings

function ColorSettings({ presets, activePresetId, onSelectPreset }: { presets: PresetItem[], activePresetId?: number, onSelectPreset?: (id: number) => void }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Theme Presets</h4>
                <p className="text-xs text-muted-foreground">Select a pre-defined color theme for your project.</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => onSelectPreset?.(preset.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${activePresetId === preset.id
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                : 'border-border hover:border-foreground/20 hover:bg-muted/50'
                            }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/80 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium text-foreground">{preset.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {preset.description || "No description available."}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground text-center">
                    More granular color controls coming soon.
                </div>
            </div>
        </div>
    );
}

function TypographySettings() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Typography</h4>
                <p className="text-xs text-muted-foreground">Global font settings.</p>
            </div>

            <div className="p-4 border border-border border-dashed rounded-lg bg-muted/20 text-center">
                <span className="text-xs text-muted-foreground">Font selection is under development.</span>
            </div>
        </div>
    );
}

function LayoutSettings({ mode }: { mode: 'mobile' | 'tablet' | 'desktop' }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground capitalize">{mode} Layout</h4>
                <p className="text-xs text-muted-foreground">Configure global layout rules for {mode} devices.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Container Width</label>
                    <input
                        type="text"
                        disabled
                        value={mode === 'mobile' ? '100%' : mode === 'tablet' ? '768px' : '1200px'}
                        className="w-full h-8 px-3 rounded-md border border-border bg-muted/50 text-xs"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Gutter Size</label>
                    <select className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs">
                        <option>16px</option>
                        <option>20px</option>
                        <option>24px</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Columns</label>
                    <select className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs" defaultValue={mode === 'mobile' ? "4" : "12"}>
                        <option value="4">4 Columns</option>
                        <option value="8">8 Columns</option>
                        <option value="12">12 Columns</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
