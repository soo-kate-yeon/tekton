'use client';

/**
 * Project Editor Page - Redesigned Layout
 * 
 * Design-TAG: SPEC-STUDIO-WEB-002 Redesigned Split-View Editor
 * Structure: Left Nav | Settings Panel | Preview Panel
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Loader2,
    Play,
} from 'lucide-react';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { useThemes } from '@/hooks/useThemes';
import { Button } from '@/components/ui/Button';
import { EditorSidebar, NavCategory, NavItem } from './components/EditorSidebar';
import { SettingsPanel } from './components/SettingsPanel';
import { PreviewPanel } from './components/PreviewPanel';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

interface EditorState {
    activeCategory: NavCategory;
    activeItem: NavItem;
    viewport: ViewportMode;
    hasUnsavedChanges: boolean;
    lastSaved: Date | null;
}

function formatSaveStatus(lastSaved: Date | null, hasChanges: boolean): string {
    if (hasChanges) {
        return 'Unsaved changes';
    }
    if (!lastSaved) {
        return 'Not saved';
    }

    const diffMs = Date.now() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) {
        return 'Saved just now';
    }
    if (diffMins < 60) {
        return `Saved ${diffMins}m ago`;
    }
    return `Saved ${Math.floor(diffMins / 60)}h ago`;
}

export default function ProjectEditorPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = Number(params.id);

    const { data: project, isLoading, error } = useProject(projectId);
    const { data: presetsData } = useThemes({ limit: 100 });
    const updateProject = useUpdateProject();

    const [editorState, setEditorState] = useState<EditorState>({
        activeCategory: 'template',
        activeItem: 'color',
        viewport: 'desktop',
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
        if (!project) {
            return;
        }

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

    const handleSelectPreset = async (themeId: number) => {
        if (!project) {
            return;
        }

        const preset = presetsData?.items.find((p) => p.id === themeId);
        if (preset) {
            setTokenConfig(preset.config);
            await updateProject.mutateAsync({
                projectId: project.id,
                data: {
                    active_template_id: themeId,
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

    const handleNavigation = (category: NavCategory, item: NavItem) => {
        setEditorState(prev => {
            let nextViewport = prev.viewport;

            // Auto-switch viewport if a layout item is selected
            if (category === 'layout') {
                if (item === 'mobile' || item === 'tablet' || item === 'desktop') {
                    nextViewport = item as ViewportMode;
                }
            }

            return {
                ...prev,
                activeCategory: category,
                activeItem: item,
                viewport: nextViewport
            };
        });
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 bg-background">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">Project Not Found</h2>
                    <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/workspace')}>Back to Workspace</Button>
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
        <div className="h-screen bg-background flex flex-col overflow-hidden" data-theme="saas-dashboard">
            {/* 1. Global Toolbar */}
            <header className="h-[48px] border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/workspace')}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        title="Back to Workspace"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs uppercase">
                            {projectName.charAt(0)}
                        </div>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-foreground w-48 hover:bg-muted/50 rounded px-1 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">
                        {formatSaveStatus(editorState.lastSaved, editorState.hasUnsavedChanges)}
                    </span>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        disabled={updateProject.isPending || !editorState.hasUnsavedChanges}
                        className={editorState.hasUnsavedChanges ? "text-primary hover:text-primary/80 hover:bg-primary/10" : "text-muted-foreground"}
                    >
                        {updateProject.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                    </Button>

                    <Button size="sm" className="btn-primary h-8">
                        <Play className="w-3 h-3 mr-2 fill-current" />
                        Publish
                    </Button>
                </div>
            </header>

            {/* 2. Main Workspace (Redesigned Layout) */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Navigation */}
                <EditorSidebar
                    activeCategory={editorState.activeCategory}
                    activeItem={editorState.activeItem}
                    onSelect={handleNavigation}
                />

                {/* Center Split View */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Settings Panel (Dynamic) */}
                    <SettingsPanel
                        activeCategory={editorState.activeCategory}
                        activeItem={editorState.activeItem}
                        presets={presetsData?.items}
                        activePresetId={project.active_template_id ?? undefined}
                        onSelectPreset={handleSelectPreset}
                    />

                    {/* Preview Area */}
                    <PreviewPanel viewportMode={editorState.viewport}>
                        {/* 
                          In a real implementation, this would be the actual renderer/iframe.
                          For now, we render a placeholder block to represent the canvas. 
                        */}
                        <div className="w-full h-full bg-white flex flex-col pointer-events-none select-none">
                            <div className="h-12 border-b flex items-center justify-between px-4 bg-white">
                                <div className="w-24 h-4 bg-muted rounded"></div>
                                <div className="flex gap-2">
                                    <div className="w-16 h-4 bg-muted rounded"></div>
                                    <div className="w-16 h-4 bg-muted rounded"></div>
                                </div>
                            </div>
                            <div className="flex-1 p-8">
                                <div className="w-2/3 h-8 bg-muted rounded mb-4"></div>
                                <div className="w-full h-32 bg-secondary/30 rounded mb-8 border border-secondary flex items-center justify-center">
                                    <p className="text-secondary-foreground font-medium">Canvas Content</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-24 bg-muted rounded"></div>
                                    <div className="h-24 bg-muted rounded"></div>
                                    <div className="h-24 bg-muted rounded"></div>
                                </div>
                            </div>
                        </div>
                    </PreviewPanel>
                </main>
            </div>
        </div>
    );
}

