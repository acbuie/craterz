"use client";

import { Info } from "lucide-react";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// TODO: Add button functionality
// Change button colors

export function UpdateFilterCard() {
  return (
    <Card>
      <CardHeader className="flex justify-center">
        <CardTitle>Search Craters</CardTitle>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <ul>
              <li>Click `Apply` to apply a filter.</li>
              <li>
                Click `Reset` to reset any changes to the filter configuration.
              </li>
              <li>Click `Clear` to clear all applied filters.</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="flex justify-between">
        <ButtonGroup>
          <Button size={"sm"}>Apply</Button>
          <Button size={"sm"} variant={"secondary"}>
            Reset
          </Button>
        </ButtonGroup>
        <Button size={"sm"} variant={"destructive"}>
          Clear
        </Button>
      </CardContent>
    </Card>
  );
}
