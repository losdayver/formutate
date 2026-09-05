import type { ComponentPropsWithoutRef } from "react";

export type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type">;

export const BuiltinCheckbox: React.FC<CheckboxProps> = ({
  className,
  ...props
}) => (
  <input
    {...props}
    className={`lsdvrform-intrinsic-checkbox${className ? ` ${className}` : ""}`}
    type="checkbox"
  />
);
