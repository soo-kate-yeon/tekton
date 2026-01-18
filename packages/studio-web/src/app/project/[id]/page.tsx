'use client';

/**
 * Project Editor Page - Framer-style project editing
 * 
 * Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
 * Function-TAG: Main editor page with sidebar (Template/Layout/Settings) and preview canvas
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Download, Check, Loader2 } from 'lucide-react';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { usePresets } from '@/hooks/usePresets';
import { Button } from '@/components/ui/Button';

// Editor sections
type SidebarSection = 'template' | 'layout' | 'settings';
type TemplateSubSection = 'presets' | 'color';
type LayoutSubSection = 'mobile' | 'tablet' | 'desktop';

interface EditorState {
    activeSection: SidebarSection;
    templateSubSection: TemplateSubSection;
    layoutSubSection: LayoutSubSection;
    hasUnsavedChanges: boolean;
    lastSaved: Date | null;
}

function formatSaveStatus(lastSaved: Date | null, hasChanges: boolean): string {
    if (hasChanges) return 'Unsaved changes';
    if (!lastSaved) return 'Not saved';

    const diffMs = Date.now() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Saved just now';
    if (diffMins < 60) return `Saved ${diffMins}m ago`;
    return `Saved ${Math.floor(diffMins / 60)}h ago`;
}

export default function ProjectEditorPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = Number(params.id);

    const { data: project, isLoading, error } = useProject(projectId);
    const { data: presetsData } = usePresets({ limit: 100 });
    const updateProject = useUpdateProject();

    const [editorState, setEditorState] = useState<EditorState>({
        activeSection: 'template',
        templateSubSection: 'presets',
        layoutSubSection: 'desktop',
        hasUnsavedChanges: false,
        lastSaved: null,
    });

    const [projectName, setProjectName] = useState('');
    const [tokenConfig, setTokenConfig] = useState<Record<string, unknown>>({});

    // Initialize state from project data
    useEffect(() => {
        if (project) {
            setProjectName(project.name);
            setTokenConfig(project.token_config);
            setEditorState((prev) => ({ ...prev, lastSaved: new Date(project.updated_at) }));
        }
    }, [project]);

    const handleSave = async () => {
        if (!project) return;

        await updateProject.mutateAsync({
            projectId: project.id,
            data: {
                name: projectName,
                token_config: tokenConfig,
            },
        });

        setEditorState((prev) => ({
            ...prev,
            hasUnsavedChanges: false,
            lastSaved: new Date(),
        }));
    };

    const handleNameChange = (name: string) => {
        setProjectName(name);
        setEditorState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    };

    const handleSelectPreset = async (presetId: number) => {
        if (!project) return;

        const preset = presetsData?.items.find((p) => p.id === presetId);
        if (preset) {
            setTokenConfig(preset.config);
            await updateProject.mutateAsync({
                projectId: project.id,
                data: {
                    active_template_id: presetId,
                    token_config: preset.config,
                },
            });
            setEditorState((prev) => ({
                ...prev,
                hasUnsavedChanges: false,
                lastSaved: new Date(),
            }));
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 bg-background">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
                    <p className="text-muted-foreground mb-4">
                        The project you're looking for doesn't exist or has been deleted.
                    </p>
                    <Button onClick={() => router.push('/workspace')}>
                        Back to Workspace
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Bar */}
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/workspace')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </button>

                    <div className="w-px h-6 bg-border" />

                    {/* Project Name (Editable) */}
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-foreground"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Save Status */}
                    <span className="text-sm text-muted-foreground">
                        {formatSaveStatus(editorState.lastSaved, editorState.hasUnsavedChanges)}
                    </span>

                    {/* Save Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={updateProject.isPending || !editorState.hasUnsavedChanges}
                    >
                        {updateProject.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                    </Button>

                    {/* Export Button */}
                    <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </header>

            {/* Main Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-muted/30 flex flex-col overflow-y-auto">
                    {/* Template Section */}
                    <div className="border-b border-border">
                        <button
                            onClick={() => setEditorState((prev) => ({ ...prev, activeSection: 'template' }))}
                            className={`w-full px-4 py-3 text-left font-medium text-sm flex items-center justify-between transition-colors ${editorState.activeSection === 'template'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Template
                            {project.active_template && (
                                <Check className="w-4 h-4 text-green-500" />
                            )}
                        </button>
                        {editorState.activeSection === 'template' && (
                            <div className="pb-2">
                                <button
                                    onClick={() => setEditorState((prev) => ({ ...prev, templateSubSection: 'presets' }))}
                                    className={`w-full px-6 py-2 text-left text-sm transition-colors ${editorState.templateSubSection === 'presets'
                                            ? 'text-primary bg-primary/10'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    Presets Gallery
                                </button>
                                <button
                                    onClick={() => setEditorState((prev) => ({ ...prev, templateSubSection: 'color' }))}
                                    className={`w-full px-6 py-2 text-left text-sm transition-colors ${editorState.templateSubSection === 'color'
                                            ? 'text-primary bg-primary/10'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    Color
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Layout Section */}
                    <div className="border-b border-border">
                        <button
                            onClick={() => setEditorState((prev) => ({ ...prev, activeSection: 'layout' }))}
                            className={`w-full px-4 py-3 text-left font-medium text-sm flex items-center justify-between transition-colors ${editorState.activeSection === 'layout'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Layout
                        </button>
                        {editorState.activeSection === 'layout' && (
                            <div className="pb-2">
                                {project.breakpoints.map((bp) => (
                                    <button
                                        key={bp.id}
                                        onClick={() => setEditorState((prev) => ({
                                            ...prev,
                                            layoutSubSection: bp.name as LayoutSubSection
                                        }))}
                                        className={`w-full px-6 py-2 text-left text-sm transition-colors flex items-center justify-between ${editorState.layoutSubSection === bp.name
                                                ? 'text-primary bg-primary/10'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                            }`}
                                    >
                                        <span className="capitalize">{bp.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {bp.min_width}px{bp.max_width ? ` - ${bp.max_width}px` : '+'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings Section */}
                    <div>
                        <button
                            onClick={() => setEditorState((prev) => ({ ...prev, activeSection: 'settings' }))}
                            className={`w-full px-4 py-3 text-left font-medium text-sm transition-colors ${editorState.activeSection === 'settings'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Settings
                        </button>
                        {editorState.activeSection === 'settings' && (
                            <div className="pb-2">
                                <button className="w-full px-6 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                    Stack
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Canvas Area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Content based on active section */}
                    <div className="flex-1 overflow-auto p-6">
                        {editorState.activeSection === 'template' && editorState.templateSubSection === 'presets' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Select a Template</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Choose a preset to apply its design tokens to your project
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {presetsData?.items.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handleSelectPreset(preset.id)}
                                            className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${project.active_template_id === preset.id
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="font-medium text-sm mb-1">{preset.name}</div>
                                            <div className="text-xs text-muted-foreground mb-2">
                                                {preset.one_line_definition || preset.category}
                                            </div>
                                            <div className="flex gap-1">
                                                {preset.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-xs bg-muted rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {editorState.activeSection === 'template' && editorState.templateSubSection === 'color' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Color Tokens</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Customize your color palette
                                    </p>
                                </div>

                                {/* Color preview from token config */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(tokenConfig?.color || {}).slice(0, 8).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <div
                                                className="h-16 rounded-lg border border-border"
                                                style={{ backgroundColor: String(value) || '#ccc' }}
                                            />
                                            <div className="text-xs font-medium truncate">{key}</div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-muted-foreground italic">
                                    Full color editor coming soon...
                                </p>
                            </div>
                        )}

                        {editorState.activeSection === 'layout' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">
                                        Layout - {editorState.layoutSubSection.charAt(0).toUpperCase() + editorState.layoutSubSection.slice(1)}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Configure layout settings for this breakpoint
                                    </p>
                                </div>

                                {project.breakpoints
                                    .filter((bp) => bp.name === editorState.layoutSubSection)
                                    .map((bp) => (
                                        <div key={bp.id} className="space-y-4">
                                            <div className="p-4 rounded-lg border border-border bg-muted/50">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Min Width:</span>{' '}
                                                        <span className="font-medium">{bp.min_width}px</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Max Width:</span>{' '}
                                                        <span className="font-medium">{bp.max_width ? `${bp.max_width}px` : 'No limit'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground italic">
                                                Layout configuration (margins, columns, typography scale) coming soon...
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {editorState.activeSection === 'settings' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Project Settings</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Configure project-wide settings
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground italic">
                                    Settings (stack preferences, export options) coming soon...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Preview Bar */}
                    <div className="h-12 border-t border-border flex items-center justify-center gap-4 bg-muted/30 shrink-0">
                        <span className="text-xs text-muted-foreground">Preview:</span>
                        {project.breakpoints.map((bp) => (
                            <button
                                key={bp.id}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${editorState.layoutSubSection === bp.name
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                    }`}
                                onClick={() => setEditorState((prev) => ({
                                    ...prev,
                                    layoutSubSection: bp.name as LayoutSubSection,
                                    activeSection: 'layout',
                                }))}
                            >
                                {bp.name.charAt(0).toUpperCase() + bp.name.slice(1)}
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
