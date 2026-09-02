import { Context, createContext, PropsWithChildren, useState } from "react";
import { FormItemNotify } from "../formItem/formItemTypes";
import { FormProps, FormSchema, InferDataFromSchema } from "./formTypes";

export type DataFormContextMediator<Schema> = {
  setFormData: React.Dispatch<
    React.SetStateAction<Partial<InferDataFromSchema<Schema & FormSchema>>>
  >;
  setSchema: React.Dispatch<React.SetStateAction<Schema>>;
  confirm: () => void;
  errors: FormItemNotify<Extract<keyof Schema, string>>[];
  formData: Partial<InferDataFromSchema<Schema & FormSchema>>;
  schema: Schema;
};

const DataFormContext = createContext<DataFormContextMediator<any> | null>(
  null
);

export const getDataFormContext = <Schema extends FormSchema>() =>
  DataFormContext as unknown as Context<DataFormContextMediator<Schema>>;

export const DataFormProvider = <Schema extends FormSchema>(
  props: PropsWithChildren<FormProps<Schema>>
) => {
  const [formData, setFormData] = useState<
    Partial<InferDataFromSchema<Schema>>
  >(props.initialData ?? {});
  const [errors, setErrors] = useState<
    FormItemNotify<Extract<keyof Schema, string>>[]
  >([]);
  const [schema, setSchema] = useState<Schema>(props.schema);

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

    const customRes = props.customValidate?.(formData);
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

    !errors.length &&
      props.onConfirm?.(formData as InferDataFromSchema<Schema>);
  };

  return (
    <DataFormContext.Provider
      value={{
        ...props,
        formData,
        errors,
        setFormData: setFormData as any,
        setSchema,
        confirm,
        schema: schema,
      }}
    >
      {props.children}
    </DataFormContext.Provider>
  );
};
