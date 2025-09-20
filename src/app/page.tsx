import { SelectorComposer, VanillaComposer } from "@/components/composers";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          {/* <span className="text-sm text-foreground">With context selector</span> */}
          <SelectorComposer />
        </div>
        {/* <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-sm text-foreground">With vanilla context</span>
          <VanillaComposer />
        </div> */}
      </div>
    </div>
  );
}
