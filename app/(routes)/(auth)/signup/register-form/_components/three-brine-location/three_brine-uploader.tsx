"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Upload,
  FileSpreadsheet,
  MapPin,
  X,
  Plus,
  Info,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LocationSelector from "./location-selector";

type Site = {
  id: string;
  name: string;
  file: File | null;
  stressLevel: number | null;
  powerAvailability: number | null;
  identicalCharacteristics: boolean;
};

type BrineSample = {
  id: string;
  location: string;
  sites: Site[];
};

export default function BrineLocationData() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [brineSamples, setBrineSamples] = useState<BrineSample[]>([]);

  const handleLocationSelect = (locations: string[]) => {
    setSelectedLocations(locations);
  };

  useEffect(() => {
    // Add new locations to brine samples
    const existingLocations = brineSamples.map((sample) => sample.location);
    const newLocations = selectedLocations.filter(
      (loc) => !existingLocations.includes(loc),
    );

    if (newLocations.length > 0) {
      const newSamples = newLocations.map((location) => ({
        id: crypto.randomUUID(),
        location,
        sites: [
          {
            id: crypto.randomUUID(),
            name: "",
            file: null,
            stressLevel: null,
            powerAvailability: null,
            identicalCharacteristics: false,
          },
        ], // Start with one empty site
      }));

      setBrineSamples((prev) => [...prev, ...newSamples]);
    }

    // Remove samples for unselected locations
    const updatedSamples = brineSamples.filter((sample) =>
      selectedLocations.includes(sample.location),
    );
    if (updatedSamples.length !== brineSamples.length) {
      setBrineSamples(updatedSamples);
    }
  }, [selectedLocations, brineSamples]);

  const handleAddSite = (sampleId: string) => {
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites: [
                ...sample.sites,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  file: null,
                  stressLevel: null,
                  powerAvailability: null,
                  identicalCharacteristics:
                    sample.sites.length > 0
                      ? sample.sites[0].identicalCharacteristics
                      : false,
                },
              ],
            }
          : sample,
      ),
    );
  };

  const handleRemoveSite = (sampleId: string, siteId: string) => {
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites:
                sample.sites.length > 1
                  ? sample.sites.filter((site) => site.id !== siteId)
                  : sample.sites, // Keep at least one site
            }
          : sample,
      ),
    );
  };

  const handleSiteNameChange = (
    sampleId: string,
    siteId: string,
    name: string,
  ) => {
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites: sample.sites.map((site) =>
                site.id === siteId ? { ...site, name } : site,
              ),
            }
          : sample,
      ),
    );
  };

  const handleFileChange = (
    sampleId: string,
    siteId: string,
    file: File | null,
  ) => {
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites: sample.sites.map((site) =>
                site.id === siteId ? { ...site, file } : site,
              ),
            }
          : sample,
      ),
    );
  };

  const handleStressLevelChange = (
    sampleId: string,
    siteId: string,
    level: number,
  ) => {
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites: sample.sites.map((site) =>
                site.id === siteId ? { ...site, stressLevel: level } : site,
              ),
            }
          : sample,
      ),
    );
  };

  const handlePowerAvailabilityChange = (
    sampleId: string,
    siteId: string,
    level: number,
  ) => {
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites: sample.sites.map((site) =>
                site.id === siteId
                  ? { ...site, powerAvailability: level }
                  : site,
              ),
            }
          : sample,
      ),
    );
  };

  const handleIdenticalCharacteristicsChange = (
    sampleId: string,
    siteId: string,
    value: boolean,
  ) => {
    // If this is the first site in a location with multiple sites, apply the change to all sites in that location
    setBrineSamples(
      brineSamples.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              sites:
                sample.sites.length > 1 && siteId === sample.sites[0].id
                  ? sample.sites.map((site) => ({
                      ...site,
                      identicalCharacteristics: value,
                    }))
                  : sample.sites.map((site) =>
                      site.id === siteId
                        ? { ...site, identicalCharacteristics: value }
                        : site,
                    ),
            }
          : sample,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process the data - in a real app, you would send this to your backend
    console.log("Submitting brine samples:", brineSamples);
  };

  // TODO: UNCOMMENT AND HANDLE SUBMIT
  // const isFormValid =
  //   brineSamples.length > 0 &&
  //   brineSamples.every(
  //     (sample) =>
  //       sample.sites.length > 0 &&
  //       sample.sites.every(
  //         (site) =>
  //           site.name &&
  //           site.file &&
  //           site.stressLevel !== null &&
  //           site.powerAvailability !== null,
  //       ),
  //   );

  const completedSites = brineSamples.reduce(
    (count, sample) =>
      count +
      sample.sites.filter(
        (site) =>
          site.name &&
          site.file &&
          site.stressLevel !== null &&
          site.powerAvailability !== null,
      ).length,
    0,
  );

  const totalSites = brineSamples.reduce(
    (count, sample) => count + sample.sites.length,
    0,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Select Geographic Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationSelector
            selectedLocations={selectedLocations}
            onSelectLocations={handleLocationSelect}
          />

          {selectedLocations.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedLocations.map((location) => (
                <Badge key={location} variant="secondary">
                  {location}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none"
                    onClick={() => {
                      setSelectedLocations(
                        selectedLocations.filter((loc) => loc !== location),
                      );
                      setBrineSamples(
                        brineSamples.filter(
                          (sample) => sample.location !== location,
                        ),
                      );
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => {
                  setSelectedLocations([]);
                  setBrineSamples([]);
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Brine Samples</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {selectedLocations.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">
                No locations selected
              </h3>
              <p className="text-muted-foreground mb-4">
                Please select one or more geographic locations above to upload
                brine samples.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  (
                    document.querySelector('[role="combobox"]') as HTMLElement
                  )?.click()
                }
              >
                Select Locations
              </Button>
            </div>
          ) : (
            <>
              <div className="px-6 pb-2">
                <Alert className="mb-4">
                  <AlertDescription>
                    For each selected location, provide site details and upload
                    the corresponding brine sample Excel file.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="mx-6 mb-6 overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[20%] font-medium">
                        Location
                      </TableHead>
                      <TableHead className="w-[20%] font-medium">
                        Site Details
                      </TableHead>
                      <TableHead className="w-[20%] font-medium">
                        Brine Sample
                      </TableHead>
                      <TableHead className="w-[30%] font-medium">
                        Site Characteristics
                      </TableHead>
                      <TableHead className="w-[10%] text-right font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brineSamples.map((sample) => (
                      <React.Fragment key={sample.id}>
                        <TableRow className="bg-muted/20 border-t-2">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
                              {sample.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* This cell intentionally left empty for alignment */}
                          </TableCell>
                          <TableCell>
                            {/* This cell intentionally left empty for alignment */}
                          </TableCell>
                          <TableCell>
                            {/* This cell intentionally left empty for alignment */}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="ml-auto flex items-center justify-end gap-2">
                              <span className="text-muted-foreground text-xs whitespace-nowrap">
                                {sample.sites.length} site
                                {sample.sites.length !== 1 ? "s" : ""}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddSite(sample.id)}
                                className="h-8"
                              >
                                <Plus className="mr-1 h-3.5 w-3.5" />
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedLocations(
                                    selectedLocations.filter(
                                      (loc) => loc !== sample.location,
                                    ),
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {sample.sites.map((site, index) => (
                          <TableRow
                            key={site.id}
                            className={
                              index === sample.sites.length - 1
                                ? ""
                                : "border-b-0"
                            }
                          >
                            <TableCell className="text-muted-foreground pl-10 text-sm">
                              Site {index + 1}
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Enter site name"
                                value={site.name}
                                onChange={(e) =>
                                  handleSiteNameChange(
                                    sample.id,
                                    site.id,
                                    e.target.value,
                                  )
                                }
                                className="mb-2"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="relative">
                                <Input
                                  id={`file-${site.id}`}
                                  type="file"
                                  accept=".xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleFileChange(sample.id, site.id, file);
                                  }}
                                />
                                {site.file ? (
                                  <div className="bg-muted/50 flex items-center rounded-md border p-2">
                                    <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" />
                                    <span className="flex-1 truncate text-sm">
                                      {site.file.name}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        handleFileChange(
                                          sample.id,
                                          site.id,
                                          null,
                                        )
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                      document
                                        .getElementById(`file-${site.id}`)
                                        ?.click()
                                    }
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose Excel File
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-4">
                                <div>
                                  <div className="mb-1 flex items-center">
                                    <Label className="text-sm font-medium">
                                      Stress Level
                                    </Label>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 h-5 w-5"
                                          >
                                            <Info className="h-3 w-3" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-[200px] text-xs">
                                            Rate the stress level from 1 (low)
                                            to 5 (high)
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <RadioGroup
                                    className="flex space-x-1"
                                    value={site.stressLevel?.toString() || ""}
                                    onValueChange={(value) =>
                                      handleStressLevelChange(
                                        sample.id,
                                        site.id,
                                        Number.parseInt(value),
                                      )
                                    }
                                  >
                                    {[1, 2, 3, 4, 5].map((level) => (
                                      <div
                                        key={level}
                                        className="flex flex-col items-center"
                                      >
                                        <RadioGroupItem
                                          value={level.toString()}
                                          id={`stress-${site.id}-${level}`}
                                          className="sr-only"
                                        />
                                        <Label
                                          htmlFor={`stress-${site.id}-${level}`}
                                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border ${
                                            site.stressLevel === level
                                              ? "bg-primary text-primary-foreground border-primary"
                                              : "border-muted-foreground/30 hover:border-muted-foreground/50"
                                          }`}
                                        >
                                          {level}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>

                                <div>
                                  <div className="mb-1 flex items-center">
                                    <Label className="text-sm font-medium">
                                      Power Availability
                                    </Label>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 h-5 w-5"
                                          >
                                            <Info className="h-3 w-3" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-[200px] text-xs">
                                            Rate power availability from 1 (low)
                                            to 5 (high)
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <RadioGroup
                                    className="flex space-x-1"
                                    value={
                                      site.powerAvailability?.toString() || ""
                                    }
                                    onValueChange={(value) =>
                                      handlePowerAvailabilityChange(
                                        sample.id,
                                        site.id,
                                        Number.parseInt(value),
                                      )
                                    }
                                  >
                                    {[1, 2, 3, 4, 5].map((level) => (
                                      <div
                                        key={level}
                                        className="flex flex-col items-center"
                                      >
                                        <RadioGroupItem
                                          value={level.toString()}
                                          id={`power-${site.id}-${level}`}
                                          className="sr-only"
                                        />
                                        <Label
                                          htmlFor={`power-${site.id}-${level}`}
                                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border ${
                                            site.powerAvailability === level
                                              ? "bg-primary text-primary-foreground border-primary"
                                              : "border-muted-foreground/30 hover:border-muted-foreground/50"
                                          }`}
                                        >
                                          {level}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>

                                {sample.sites.length > 1 && index === 0 && (
                                  <div className="pt-2">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id={`identical-${site.id}`}
                                        checked={site.identicalCharacteristics}
                                        onCheckedChange={(checked) =>
                                          handleIdenticalCharacteristicsChange(
                                            sample.id,
                                            site.id,
                                            checked,
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`identical-${site.id}`}
                                        className="text-sm"
                                      >
                                        Power and water characteristics are
                                        identical for all sites
                                      </Label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {sample.sites.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveSite(sample.id, site.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between px-6 pb-6">
                <div className="text-muted-foreground text-sm">
                  {completedSites} of {totalSites} sites ready for submission
                </div>
                {/* <Button type="submit" disabled={!isFormValid}>
                  Submit All Samples
                </Button> */}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );

  // Debug log to check state
  console.log("Current state:", { selectedLocations, brineSamples });
}
