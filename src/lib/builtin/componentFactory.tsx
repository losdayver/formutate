import {
  ComponentFactoryType,
  ItemDescriptor,
} from "../formItem/formItemTypes";
import { BuiltinButton } from "./intrinsic/button";
import { BuiltinCheckbox } from "./intrinsic/checkbox";
import { BuiltinInput } from "./intrinsic/input";

export const builtinComponentFactory: ComponentFactoryType = (
  descriptor: ItemDescriptor,
  value: any,
  onChange: (val: any) => void
) => {
  switch (descriptor.component) {
    case "input":
      return (
        <BuiltinInput
          {...descriptor?.componentProps}
          disabled={descriptor.disabled ?? descriptor.componentProps?.disabled}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "inputNum":
      return (
        <BuiltinInput
          {...descriptor?.componentProps}
          disabled={descriptor.disabled ?? descriptor.componentProps?.disabled}
          type="number"
          value={value ?? ""}
          onChange={(event) => {
            if (event.currentTarget.value === "") {
              onChange(undefined);
              return;
            }
            const nextValue = event.currentTarget.valueAsNumber;
            if (Number.isFinite(nextValue)) {
              onChange(nextValue);
            }
          }}
        />
      );
    case "checkbox":
      return (
        <BuiltinCheckbox
          {...descriptor?.componentProps}
          checked={Boolean(value)}
          disabled={descriptor.disabled ?? descriptor.componentProps?.disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      );
    case "button":
      return (
        <BuiltinButton
          {...descriptor.componentProps}
          disabled={descriptor.disabled ?? descriptor.componentProps?.disabled}
        />
      );
    case "file":
      return (
        <BuiltinInput
          {...descriptor.componentProps}
          type="file"
          disabled={descriptor.disabled ?? descriptor.componentProps?.disabled}
          onChange={(event) =>
            onChange(event.currentTarget.files?.item(0)?.name ?? "")
          }
        />
      );
    default:
      return <></>;
  }
};
