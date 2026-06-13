import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function ShadcnSelect({
                                 nombreDefault,
                                 value1,
                                 value2,
                                 value3,
                                 value4,
                                 value5,
                                 onChange,
                             }) {
    return (
        <Select
            // shadcn usa onValueChange, NO onChange
            onValueChange={onChange}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={nombreDefault} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {value1 && <SelectItem value={value1}>{value1}</SelectItem>}
                    {value2 && <SelectItem value={value2}>{value2}</SelectItem>}
                    {value3 && <SelectItem value={value3}>{value3}</SelectItem>}
                    {value4 && <SelectItem value={value4}>{value4}</SelectItem>}
                    {value5 && <SelectItem value={value5}>{value5}</SelectItem>}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}