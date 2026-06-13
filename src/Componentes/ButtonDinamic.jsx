import { cn } from "@/lib/utils";

export function ButtonDinamic({ className, value, onChange, onClick, placeholder, children }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all",
                "hover:bg-gray-800 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20",
                "disabled:pointer-events-none disabled:opacity-50",
                className
            )}
        >
            {children || value || placeholder}
        </button>
    );
}
