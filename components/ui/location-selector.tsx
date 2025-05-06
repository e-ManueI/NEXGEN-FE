"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const regions = [
  {
    name: "North America",
    locations: [
      "California Coast",
      "Gulf of Mexico",
      "Great Salt Lake",
      "Salton Sea",
      "Death Valley",
      "Bonneville Salt Flats",
    ],
  },
  {
    name: "South America",
    locations: [
      "Salar de Uyuni",
      "Atacama Desert",
      "Salar de Atacama",
      "Salar de Arizaro",
      "Salar de Hombre Muerto",
    ],
  },
  {
    name: "Europe",
    locations: [
      "Dead Sea",
      "Mediterranean Coast",
      "Black Sea",
      "Caspian Sea",
      "Baltic Sea",
    ],
  },
  {
    name: "Asia",
    locations: [
      "Lop Nur Salt Lake",
      "Qarhan Salt Lake",
      "Sambhar Salt Lake",
      "Rann of Kutch",
      "Lake Urmia",
      "Aral Sea",
    ],
  },
  {
    name: "Australia",
    locations: [
      "Lake Eyre",
      "Lake Frome",
      "Lake Gairdner",
      "Lake Torrens",
      "Lake Disappointment",
    ],
  },
  {
    name: "Africa",
    locations: [
      "Danakil Depression",
      "Lake Assal",
      "Lake Natron",
      "Lake Magadi",
      "Makgadikgadi Pan",
    ],
  },
];

type LocationSelectorProps = {
  selectedLocations: string[];
  onSelectLocations: (locations: string[]) => void;
};

export default function LocationSelector({
  selectedLocations,
  onSelectLocations,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState(regions[0].name);

  const handleSelectLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      onSelectLocations(selectedLocations.filter((loc) => loc !== location));
    } else {
      onSelectLocations([...selectedLocations, location]);
    }
    // Close the popover after selection for better UX
    // setOpen(false)
  };

  const handleSelectAllInRegion = (regionName: string) => {
    const region = regions.find((r) => r.name === regionName);
    if (!region) return;

    const regionLocations = region.locations;
    const allSelected = regionLocations.every((loc) =>
      selectedLocations.includes(loc),
    );

    if (allSelected) {
      // Deselect all in this region
      onSelectLocations(
        selectedLocations.filter((loc) => !regionLocations.includes(loc)),
      );
    } else {
      // Select all in this region
      const locationsToAdd = regionLocations.filter(
        (loc) => !selectedLocations.includes(loc),
      );
      onSelectLocations([...selectedLocations, ...locationsToAdd]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLocations.length > 0
            ? `${selectedLocations.length} location${selectedLocations.length > 1 ? "s" : ""} selected`
            : "Select locations"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Tabs defaultValue={activeRegion} onValueChange={setActiveRegion}>
          <div className="flex border-b">
            <ScrollArea className="max-w-full">
              <TabsList className="h-10 flex-nowrap">
                {regions.map((region) => (
                  <TabsTrigger
                    key={region.name}
                    value={region.name}
                    className="px-4 whitespace-nowrap"
                  >
                    {region.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>

          {regions.map((region) => (
            <TabsContent
              key={region.name}
              value={region.name}
              className="m-0 p-0"
            >
              <Command>
                <CommandInput
                  placeholder={`Search ${region.name} locations...`}
                />
                <CommandList>
                  <CommandEmpty>No locations found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleSelectAllInRegion(region.name)}
                      className="cursor-pointer"
                    >
                      <div
                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                          region.locations.every((loc) =>
                            selectedLocations.includes(loc),
                          )
                            ? "bg-primary border-primary text-primary-foreground"
                            : "opacity-50"
                        }`}
                      >
                        {region.locations.every((loc) =>
                          selectedLocations.includes(loc),
                        ) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="font-medium">
                        Select All in {region.name}
                      </span>
                    </CommandItem>

                    {region.locations.map((location) => (
                      <CommandItem
                        key={location}
                        onSelect={() => handleSelectLocation(location)}
                        className="cursor-pointer"
                      >
                        <div
                          className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                            selectedLocations.includes(location)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "opacity-50"
                          }`}
                        >
                          {selectedLocations.includes(location) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        {location}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
