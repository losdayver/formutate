import { PropsWithChildren, useContext } from "react";
import { PreparedFormItem } from "../formItem/formItem";
import { FormProps, FormSchema } from "./formTypes";
import { BuiltinButton } from "../builtin/intrinsic/button";
import {
  getDataFormContext,
  DataFormProvider,
  DataFormContextMediator,
} from "./dataFormContext";

export const DataForm = <Schema extends FormSchema>(
  props: PropsWithChildren<FormProps<Schema>>
) => (
  <DataFormProvider {...props}>
    <DataFormContent {...props} />
  </DataFormProvider>
);

const DataFormContent = <Schema extends FormSchema>({
  children,
  ConfirmButton,
}: PropsWithChildren<FormProps<Schema>>) => {
  const mediator =
    useContext<DataFormContextMediator<Schema>>(getDataFormContext<Schema>());
  if (!mediator) {
    throw new Error("DataFormContent must be rendered inside DataFormProvider");
  }

  const { confirm, schema: mediatedSchema } = mediator;

  return (
    <form className="lsdvr-data-form-form">
      {children
        ? children
        : Object.entries(mediatedSchema).map(([fldKey]) => {
            return <PreparedFormItem key={fldKey} fldKey={fldKey} />;
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
