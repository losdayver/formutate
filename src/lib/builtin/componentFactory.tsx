import { ItemDescriptor } from "../formItem/formItemTypes";
import { BuiltinCheckbox } from "./intrinsic/checkbox";
import { BuiltinInput } from "./intrinsic/input";

export const builtinComponentFactory = (
  descriptor: ItemDescriptor,
  value: any,
  onChange: (val: any) => void
) => {
  switch (descriptor.component) {
    case "input":
      return (
        <BuiltinInput
          {...descriptor}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "inputNum":
      return (
        <BuiltinInput
          {...descriptor}
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
          {...descriptor}
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
      );
    case "file":
      return (
        <></>
        // <FileInput {...descriptor} value={value} onPathChange={onChange} />
      );
    default:
      return <></>;
  }
};
