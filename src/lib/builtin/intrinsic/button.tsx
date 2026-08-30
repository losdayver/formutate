import type { ComponentPropsWithoutRef } from "react";

export type ButtonProps = ComponentPropsWithoutRef<"button">;

export const BuiltinButton: React.FC<ButtonProps> = ({
  className,
  type = "button",
  ...props
}) => (
  <button
    {...props}
    className={[
      "lsdvr-data-form-intrinsic-button",
      className,
      props.disabled ? "disabled" : undefined,
    ]
      .filter(Boolean)
      .join(" ")}
    type={type}
  />
);
