'use client';

/**
 * Workspace Page - Framer-style project gallery
 * 
 * Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
 * Function-TAG: Main workspace page showing all user projects as cards
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FolderArchive, Search, MoreHorizontal, Trash2 } from 'lucide-react';
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

export default function WorkspacePage() {
    const router = useRouter();
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data, isLoading, error } = useProjects({ include_archived: showArchived });
    const createProject = useCreateProject();
    const deleteProject = useDeleteProject();

    const handleCreateProject = async () => {
        setIsCreating(true);
        try {
            const project = await createProject.mutateAsync({
                name: 'Untitled Project',
                description: '',
            });
            router.push(`/project/${project.id}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteProject = async (projectId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteProject.mutateAsync({ projectId });
        }
    };

    const handleProjectClick = (projectId: number) => {
        router.push(`/project/${projectId}`);
    };

    // Filter projects by search query
    const filteredProjects = data?.items.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 bg-background">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-semibold mb-4">Unable to Load Projects</h2>
                    <p className="text-muted-foreground mb-4">
                        {error instanceof Error ? error.message : 'An unexpected error occurred'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please ensure the Studio API is running at localhost:8000
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-56 border-r border-border bg-muted/30 flex flex-col">
                {/* Logo/Account area */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            T
                        </div>
                        <span className="font-medium">Tekton Studio</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2">
                    <div className="space-y-1">
                        <button
                            onClick={() => setShowArchived(false)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${!showArchived
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            All Projects
                        </button>
                        <button
                            onClick={() => setShowArchived(true)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${showArchived
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <FolderArchive className="w-4 h-4" />
                            Archive
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-14 border-b border-border flex items-center justify-between px-6">
                    {/* Search */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 h-9 pl-9 pr-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    {/* New Project Button */}
                    <Button
                        onClick={handleCreateProject}
                        disabled={isCreating}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </header>

                {/* Projects Grid */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold">
                            {showArchived ? 'Archived Projects' : 'All Projects'}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Create your first project to get started
                            </p>
                            <Button onClick={handleCreateProject} disabled={isCreating}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Project
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => handleProjectClick(project.id)}
                                    className="group cursor-pointer"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-muted/50 to-muted border border-border overflow-hidden relative mb-3 transition-all group-hover:border-primary/50 group-hover:shadow-lg">
                                        {project.thumbnail_url ? (
                                            <img
                                                src={project.thumbnail_url}
                                                alt={project.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-4xl font-bold text-muted-foreground/30">
                                                    {project.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover Actions */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleDeleteProject(project.id, e)}
                                                className="w-8 h-8 rounded-md bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Project Info */}
                                    <div>
                                        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Edited {formatRelativeTime(project.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
