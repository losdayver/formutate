import { BuiltinCheckbox } from "../builtin/intrinsic/checkbox";
import { BuiltinInput } from "../builtin/intrinsic/input";
import { FormItemProps, ItemDescriptor } from "./formItemTypes";

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = ({
  children,
  required,
  title,
  reactKey,
  divideAfter,
  notify,
  hint,
  disabled,
}) => {
  return (
    <div
      className={`lsdvr-data-form-form__item${notify ? ` ${notify.severity}` : ""}${disabled ? " disabled" : ""}`}
      key={reactKey}
    >
      <span className="lsdvr-data-form-form__label">
        {title}
        {hint ? (
          <span
            className="lsdvr-data-form-form__hint"
            data-hint={hint}
            aria-label={`Подсказка: ${hint}`}
            tabIndex={0}
          >
            ❔
          </span>
        ) : (
          ""
        )}
        :
        {required && (
          <span className="lsdvr-data-form-form__required" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <span
        className={`lsdvr-data-form-form__control${notify?.message ? " lsdvr-data-form-form__control--with-message" : ""}`}
      >
        {children}
        {notify?.message && (
          <span
            className="lsdvr-data-form-form__message"
            role={notify.severity === "error" ? "alert" : "status"}
          >
            {notify.message}
          </span>
        )}
      </span>
      {divideAfter && <hr className="lsdvr-data-form-form__divider" />}
    </div>
  );
};

export const componentFactory = (
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
          value={value ?? ""}
          onChange={(event) => {
            const value = event.target.value?.replace(/\D/g, "");
            onChange(value ? Number(value) : null);
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
        <></> // <FileInput {...descriptor} value={value} onPathChange={onChange} />
      );
    default:
      return <></>;
  }
};
