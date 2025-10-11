"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";

export interface GeometrySliderProps {
  defaultValue: { min: number; max: number };
  min: number;
  max: number;
  step: number;
}

export function GeometrySlider({
  defaultValue,
  min,
  max,
  step,
}: GeometrySliderProps) {
  const [value, setValue] = React.useState([
    defaultValue.min,
    defaultValue.max,
  ]);
  const [from, to] = value;

  return (
    <span className="w-full">
      <Slider
        className="mt-2"
        value={value}
        onValueChange={setValue}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={step}
      />
      <span className="w-full mt-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{from}</span>
        <span className="text-sm text-muted-foreground">{to}</span>
      </span>
    </span>
  );
}
