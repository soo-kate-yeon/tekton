import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PreviewPanelProps {
    viewportMode: 'mobile' | 'tablet' | 'desktop';
    children?: React.ReactNode;
}

export function PreviewPanel({ viewportMode, children }: PreviewPanelProps) {
    const [zoom, setZoom] = React.useState(100);

    const getViewportSize = () => {
        switch (viewportMode) {
            case 'mobile': return { width: 375, height: 667 };
            case 'tablet': return { width: 768, height: 1024 };
            case 'desktop': return { width: 1280, height: 800 };
            default: return { width: 1280, height: 800 };
        }
    };

    const size = getViewportSize();

    return (
        <div className="flex-1 bg-muted/20 relative flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-10 border-b border-border bg-background/50 backdrop-blur-sm flex items-center px-4 justify-between shrink-0">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Preview</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="p-1 hover:bg-muted rounded text-muted-foreground">
                        <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs w-8 text-center tabular-nums">{zoom}%</span>
                    <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1 hover:bg-muted rounded text-muted-foreground">
                        <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                <div
                    className="bg-white shadow-lg transition-all duration-300 border border-border/50 relative origin-top-center"
                    style={{
                        width: size.width,
                        height: size.height,
                        transform: `scale(${zoom / 100})`,
                    }}
                >
                    {children}

                    {/* Interactive Overlay Hints (if needed in future) */}
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-black/5"></div>
                </div>
            </div>
        </div>
    );
}
