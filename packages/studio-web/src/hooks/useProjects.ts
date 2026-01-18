/**
 * React hooks for Project API operations.
 * 
 * Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
 * Function-TAG: React Query hooks for project CRUD and breakpoint management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// --- Types ---

export interface LayoutBreakpoint {
    id: number;
    project_id: number;
    name: string;
    min_width: number;
    max_width: number | null;
    config: Record<string, unknown>;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Template {
    id: number;
    name: string;
    category: string;
    description: string | null;
    config: Record<string, unknown>;
    tags: string[];
    one_line_definition: string | null;
    reference_style: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    active_template_id: number | null;
    token_config: Record<string, unknown>;
    settings: Record<string, unknown>;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    active_template: Template | null;
    breakpoints: LayoutBreakpoint[];
}

export interface ProjectListResponse {
    items: Project[];
    total: number;
    skip: number;
    limit: number;
}

export interface ProjectCreateData {
    name: string;
    description?: string;
    active_template_id?: number;
    token_config?: Record<string, unknown>;
    settings?: Record<string, unknown>;
}

export interface ProjectUpdateData {
    name?: string;
    description?: string | null;
    thumbnail_url?: string | null;
    active_template_id?: number | null;
    token_config?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    is_archived?: boolean;
}

export interface BreakpointUpdateData {
    name?: string;
    min_width?: number;
    max_width?: number | null;
    config?: Record<string, unknown>;
    display_order?: number;
}

// --- API Functions ---

async function fetchProjects(params: {
    skip?: number;
    limit?: number;
    include_archived?: boolean;
}): Promise<ProjectListResponse> {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
    if (params.include_archived) searchParams.set('include_archived', 'true');

    const response = await fetch(`${API_BASE_URL}/api/v2/projects?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
}

async function fetchProject(projectId: number): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/v2/projects/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
}

async function createProject(data: ProjectCreateData): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/v2/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
}

async function updateProject(
    projectId: number,
    data: ProjectUpdateData
): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/v2/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
}

async function deleteProject(
    projectId: number,
    hardDelete = false
): Promise<void> {
    const params = hardDelete ? '?hard_delete=true' : '';
    const response = await fetch(`${API_BASE_URL}/api/v2/projects/${projectId}${params}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
}

async function updateBreakpoint(
    projectId: number,
    breakpointId: number,
    data: BreakpointUpdateData
): Promise<LayoutBreakpoint> {
    const response = await fetch(
        `${API_BASE_URL}/api/v2/projects/${projectId}/breakpoints/${breakpointId}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) throw new Error('Failed to update breakpoint');
    return response.json();
}

// --- Query Keys ---

export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (params: { skip?: number; limit?: number; include_archived?: boolean }) =>
        [...projectKeys.lists(), params] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: number) => [...projectKeys.details(), id] as const,
};

// --- Hooks ---

/**
 * Fetch list of projects
 */
export function useProjects(params: {
    skip?: number;
    limit?: number;
    include_archived?: boolean;
} = {}) {
    return useQuery({
        queryKey: projectKeys.list(params),
        queryFn: () => fetchProjects(params),
    });
}

/**
 * Fetch a single project by ID
 */
export function useProject(projectId: number | null) {
    return useQuery({
        queryKey: projectKeys.detail(projectId!),
        queryFn: () => fetchProject(projectId!),
        enabled: projectId !== null,
    });
}

/**
 * Create a new project
 */
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

/**
 * Update an existing project
 */
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, data }: { projectId: number; data: ProjectUpdateData }) =>
            updateProject(projectId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.setQueryData(projectKeys.detail(data.id), data);
        },
    });
}

/**
 * Delete a project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, hardDelete }: { projectId: number; hardDelete?: boolean }) =>
            deleteProject(projectId, hardDelete),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

/**
 * Update a breakpoint configuration
 */
export function useUpdateBreakpoint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            breakpointId,
            data,
        }: {
            projectId: number;
            breakpointId: number;
            data: BreakpointUpdateData;
        }) => updateBreakpoint(projectId, breakpointId, data),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
        },
    });
}
