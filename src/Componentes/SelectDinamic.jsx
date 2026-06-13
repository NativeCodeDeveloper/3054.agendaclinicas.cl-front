{/*

* */}



import { cn } from "@/lib/utils";

export function SelectDinamic({ className, value, onChange, onClick, placeholder, options = [] }) {
    return (
        <select
            value={value}
            onChange={onChange}
            onClick={onClick}
            className={cn(
                "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-all outline-none appearance-none",
                "focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                !value && "text-gray-400",
                className
            )}
        >
            {placeholder && (
                <option value="" disabled hidden>{placeholder}</option>
            )}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
