"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "../ui/button-group";

// TODO: Add button functionality
// Change button colors

export function UpdateFilterCard() {
  return (
    <Card>
      <CardTitle className="flex justify-center">Search Craters</CardTitle>
      <CardContent className="flex justify-between">
        <ButtonGroup>
          <Button size={"sm"}>Apply</Button>
          <Button size={"sm"} variant={"secondary"}>
            Clear
          </Button>
        </ButtonGroup>
        <Button size={"sm"} variant={"destructive"}>
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
