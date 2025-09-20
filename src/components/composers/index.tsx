"use client";

import * as Selector from "./selector-composer";
import * as Vanilla from "./vanilla-composer";

export const SelectorComposer = () => {
  return (
    <Selector.Provider>
      <Selector.Frame>
        <Selector.Input />
        <Selector.Send />
      </Selector.Frame>
    </Selector.Provider>
  );
};

export const VanillaComposer = () => {
  return (
    <Vanilla.Provider>
      <Vanilla.Frame>
        <Vanilla.Input />
        <Vanilla.Send />
      </Vanilla.Frame>
    </Vanilla.Provider>
  );
};
