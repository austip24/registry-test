"use client";

import { Root, Range, Track, Thumb } from "@radix-ui/react-slider";

export const ExampleSlider = () => {
  return (
    <Root
      defaultValue={[50]}
      step={10}
      className="relative flex items-center w-[100px] h-4"
    >
      <Track className="relative grow bg-zinc-500">
        <Range className="absolute bg-zinc-800" />
      </Track>
      <Thumb className="block w-5 h-5 bg-zinc-950" />
    </Root>
  );
};
