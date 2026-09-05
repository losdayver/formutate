import type { ComponentPropsWithoutRef } from "react";

export type InputProps = ComponentPropsWithoutRef<"input">;

export const BuiltinInput: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={`lsdvrform-intrinsic-input${className ? ` ${className}` : ""}`}
  />
);
