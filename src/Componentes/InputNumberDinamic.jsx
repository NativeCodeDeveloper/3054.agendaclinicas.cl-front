import { cn } from "@/lib/utils";

export function InputNumberDinamic({ className, value, onChange, onClick, placeholder }) {
    const handleChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d*\.?\d*$/.test(val)) {
            onChange?.(e);
        }
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleChange}
            onClick={onClick}
            placeholder={placeholder}
            className={cn(
                "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all outline-none",
                "focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        />
    );
}
