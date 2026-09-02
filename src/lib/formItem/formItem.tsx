import { useContext } from "react";
import { DataFormContext } from "../form/dataFormContext";
import { FormItemProps } from "./formItemTypes";

export const PreparedFormItem: React.FC<{ fldKey: string }> = ({ fldKey }) => {
  const mediator = useContext(DataFormContext)!;
  const { componentFactory, schema, formData, setFormData, errors } = mediator;

  const descriptor = schema[fldKey];
  const error = errors.find((err) => err.fld == fldKey);

  return (
    <FormItem {...descriptor} notify={error}>
      {componentFactory(descriptor, formData[fldKey], (val: any) => {
        const oldVal = formData[fldKey];
        descriptor.onBeforeChange?.(oldVal, val, mediator as any);
        setFormData((prev) =>
          Object.is(prev[fldKey], val) ? prev : { ...prev, [fldKey]: val }
        );
        descriptor.onAfterChange?.(oldVal, val, mediator as any);
      })}
    </FormItem>
  );
};

export const PFI = (fldKey: string) => <PreparedFormItem fldKey={fldKey} />;

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
