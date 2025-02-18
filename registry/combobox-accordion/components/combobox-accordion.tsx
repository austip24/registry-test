"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type ComboboxAccordionProps = {
  items: { value: string | string[]; label: string }[];
};

export const ComboboxAccordion: React.FC<ComboboxAccordionProps> = ({
  items,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : "Select item..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            {items.map((item) => (
              <CommandGroup key={item.label}>
                {Array.isArray(item.value) ? (
                  <Accordion type="multiple">
                    <AccordionItem value={item.label}>
                      <AccordionTrigger className="py-2 font-normal px-2">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        {item.value.map((subItem) => {
                          return (
                            <CommandItem
                              key={subItem}
                              value={subItem}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                              }}
                              className="pl-4"
                            >
                              {subItem}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === subItem
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <CommandItem
                    key={
                      Array.isArray(item.value)
                        ? JSON.stringify(item.value)
                        : item.value
                    }
                    value={
                      Array.isArray(item.value)
                        ? JSON.stringify(item.value)
                        : item.value
                    }
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
