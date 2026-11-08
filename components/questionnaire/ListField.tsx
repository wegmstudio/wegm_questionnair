"use client";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  id: string;
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  max?: number;
}

/** A list of short text entries ("Add another"). */
export function ListField({ id, value, onChange, placeholder, invalid, max = 20 }: Props) {
  const items = value && value.length > 0 ? value : [""];
  const update = (index: number, text: string) => onChange(items.map((v, i) => (i === index ? text : v)));
  const remove = (index: number) => onChange(items.length === 1 ? [""] : items.filter((_, i) => i !== index));
  const add = () => items.length < max && onChange([...items, ""]);
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            id={index === 0 ? id : `${id}-${index}`}
            value={item}
            placeholder={placeholder}
            aria-invalid={invalid}
            onChange={(e) => update(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (index === items.length - 1) add();
              }
            }}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove entry" className="shrink-0 text-slate">
            <X />
          </Button>
        </div>
      ))}
      <Button type="button" variant="subtle" size="sm" onClick={add} disabled={items.length >= max}>
        <Plus /> Add another
      </Button>
    </div>
  );
}
