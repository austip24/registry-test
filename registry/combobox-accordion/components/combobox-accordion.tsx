"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";

export type ComboboxAccordionProps = {
  items: { value: string; label: string }[];
};

export const ComboboxAccordion: React.FC<ComboboxAccordionProps> = ({
  items,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<typeof items>([]);

  console.log(selectedValues);

  const itemsByLabel = items.reduce((acc, item) => {
    if (acc[item.label]) {
      acc[item.label].push(item.value);
    } else {
      acc[item.label] = [item.value];
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} items selected`
            : "Select item..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            {Object.entries(itemsByLabel).map(([label, values]) => (
              <CommandGroup key={label}>
                {values.length > 1 ? (
                  <Accordion type="multiple">
                    <AccordionItem
                      value={label}
                      className="border-0 py-0 w-full"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="shrink">
                          <Checkbox
                            checked={selectedValues.some(
                              (item) => item.label === label
                            )}
                            onClick={() => {
                              setSelectedValues((prev) => {
                                if (prev.some((item) => item.label === label)) {
                                  return prev.filter((v) => v.label !== label);
                                }
                                return [
                                  ...prev,
                                  ...values.map((v) => ({ value: v, label })),
                                ];
                              });
                            }}
                          />
                        </div>
                        <div className="grow">
                          <AccordionTrigger className="border-0 py-0">
                            <CommandItem
                              className={cn(
                                "flex items-center justify-between pl-2 py-0 w-full"
                              )}
                            >
                              {label}
                            </CommandItem>
                          </AccordionTrigger>
                        </div>
                      </div>

                      <AccordionContent className="pl-4">
                        {values.map((value: string, idx: number) => (
                          <div
                            key={`selector-${value}-${label}-${idx}`}
                            onClick={() => {
                              setSelectedValues((prev) => {
                                const existingItem = prev.find(
                                  (item) =>
                                    item.value === value && label === item.label
                                );

                                if (existingItem) {
                                  // remove the existingItem from selectedValues
                                  const filteredItems = prev.filter(
                                    (item) =>
                                      item.value !== value ||
                                      item.label !== label
                                  );
                                  console.log("filtered result", filteredItems);
                                  return filteredItems;
                                }
                                return [...prev, { value, label }];
                              });
                            }}
                          >
                            <CommandItem
                              className={cn(
                                "flex items-center gap-2",
                                value === value && "text-gray-500"
                              )}
                            >
                              <Checkbox
                                checked={selectedValues.some(
                                  (item) =>
                                    item.value === value && item.label === label
                                )}
                              />
                              {value}
                            </CommandItem>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  values.map((value) => (
                    <CommandItem
                      key={value}
                      onSelect={() => {
                        setSelectedValues((prev) => {
                          const existingItem = prev.find(
                            (item) =>
                              item.value === value && label === item.label
                          );

                          if (existingItem) {
                            // remove the existingItem from selectedValues
                            const filteredItems = prev.filter(
                              (item) =>
                                item.value !== value || item.label !== label
                            );
                            console.log("filtered result", filteredItems);
                            return filteredItems;
                          }
                          return [...prev, { value, label }];
                        });
                      }}
                      className={cn("flex items-centergap-2")}
                    >
                      <Checkbox
                        checked={selectedValues.some(
                          (item) => item.label === label && item.value === value
                        )}
                      />
                      {value}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
