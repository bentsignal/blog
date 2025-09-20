import * as Composer from "./composer";

export default function DefaultComposer() {
  return (
    <Composer.Provider>
      <Composer.Frame>
        <Composer.Input />
        <Composer.Send />
      </Composer.Frame>
    </Composer.Provider>
  );
}
