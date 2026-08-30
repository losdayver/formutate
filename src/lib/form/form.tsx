import { useState } from "react";
import { FormItemNotify } from "../formItem/formItemTypes";
import { FormItem } from "../formItem/formItem";
import { FormProps, FormSchema, InferDataFromSchema } from "./formTypes";
import { BuiltinButton } from "../builtin/intrinsic/button";

export const DataForm = <Schema extends FormSchema>({
  schema,
  componentFactory,
  initialData,
  onConfirm,
  customValidate,
  ConfirmButton,
}: FormProps<Schema>) => {
  const [formData, setFormData] = useState<
    Partial<InferDataFromSchema<Schema>>
  >(initialData ?? {});
  const [errors, setErrors] = useState<
    FormItemNotify<Extract<keyof Schema, string>>[]
  >([]);

  const validate = (): FormItemNotify[] => {
    const requiredKeys = Object.entries(schema)
      .filter(([_, descriptor]) => descriptor.required)
      .map(([fldKey]) => fldKey);

    const failed = requiredKeys.filter(
      (fldKey) => formData[fldKey] == null || formData[fldKey] == ""
    );
    return failed.map((fld) => ({ fld, severity: "error" }));
  };

  const confirm = () => {
    let errorsToSet = new Map<string, FormItemNotify>();

    const simpleValidateErrors = validate();
    simpleValidateErrors.forEach((error) => errorsToSet.set(error.fld, error));

    const customRes = customValidate?.(formData);
    if (customRes instanceof Array)
      customRes.forEach((error) => errorsToSet.set(error.fld, error));

    Object.entries(schema).forEach(([fldKey, item]) => {
      if (
        item.validator &&
        (item.required || (!item.required && formData[fldKey]))
      ) {
        const error = item.validator(formData[fldKey]);
        if (error) errorsToSet.set(fldKey, { ...error, fld: fldKey });
      }
    });

    const errors = [...errorsToSet.values()];
    if (errors.length) setErrors(errors as any);

    !errors.length && onConfirm?.(formData as InferDataFromSchema<Schema>);
  };

  return (
    <form className="lsdvr-data-form-form">
      {Object.entries(schema).map(([fldKey, descriptor]) => {
        const error = errors.find((err) => err.fld == fldKey);
        return (
          <FormItem
            title={descriptor.title}
            required={descriptor.required}
            key={fldKey}
            divideAfter={descriptor.divideAfter}
            notify={error}
            hint={descriptor.hint}
            disabled={descriptor.disabled}
          >
            {componentFactory(descriptor, formData[fldKey], (val: any) =>
              setFormData((prev) =>
                Object.is(prev[fldKey], val) ? prev : { ...prev, [fldKey]: val }
              )
            )}
          </FormItem>
        );
      })}
      {ConfirmButton ? (
        <ConfirmButton
          className="lsdvr-data-form-form__submit"
          onClick={confirm}
        >
          Confirm
        </ConfirmButton>
      ) : (
        <BuiltinButton
          className="lsdvr-data-form-form__submit"
          onClick={confirm}
        >
          Confirm
        </BuiltinButton>
      )}
    </form>
  );
};
