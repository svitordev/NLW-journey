import { ReactNode } from "react";

interface BoxInputProps {
  children: ReactNode;
}
export function BoxInput({ children }: BoxInputProps) {
  return (
    <div className="flex items-center flex-1 gap-2 h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg ">
      {children}
    </div>
  );
}
