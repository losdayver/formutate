import { Children, PropsWithChildren, useContext } from "react";
import { FormItem } from "../formItem/formItem";
import { FormProps, FormSchema } from "./formTypes";
import { BuiltinButton } from "../builtin/intrinsic/button";
import {
  getDataFormContext,
  DataFormProvider,
  DataFormContextMediator,
} from "./dataFormContext";

export const DataForm = <Schema extends FormSchema>(
  props: FormProps<Schema>
) => (
  <DataFormProvider {...props}>
    <DataFormContent {...props} />
  </DataFormProvider>
);

const DataFormContent = <Schema extends FormSchema>({
  children,
  schema,
  componentFactory,
  ConfirmButton,
}: PropsWithChildren<FormProps<Schema>>) => {
  const mediator =
    useContext<DataFormContextMediator<Schema>>(getDataFormContext<Schema>());
  if (!mediator) {
    throw new Error("DataFormContent must be rendered inside DataFormProvider");
  }

  const { errors, formData, setFormData, confirm } = mediator;

  return (
    <form className="lsdvr-data-form-form">
      {children ? (
        <></>
      ) : (
        Object.entries(schema).map(([fldKey, descriptor]) => {
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
              {componentFactory(descriptor, formData[fldKey], (val: any) => {
                const oldVal = formData[fldKey];
                descriptor.onBeforeChange?.(oldVal, val, mediator);
                setFormData((prev) =>
                  Object.is(prev[fldKey], val)
                    ? prev
                    : { ...prev, [fldKey]: val }
                );
                descriptor.onAfterChange?.(oldVal, val, mediator);
              })}
            </FormItem>
          );
        })
      )}
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
