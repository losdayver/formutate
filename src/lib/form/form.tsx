import { PropsWithChildren, useContext } from "react";
import { PreparedFormItem } from "../formItem/formItem";
import { FormProps, FormSchema } from "./formTypes";
import { BuiltinButton } from "../builtin/intrinsic/button";
import {
  getDataFormContext,
  DataFormProvider,
  DataFormContextMediator,
} from "./dataFormContext";
import { buildGrid, GridGroup } from "./formUtils";

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
    <div>
      <form className="lsdvrform-form">
        {children
          ? buildGrid(children)
          : buildGrid(
              <GridGroup>
                {Object.entries(mediatedSchema).map(([fldKey]) => {
                  return <PreparedFormItem key={fldKey} fldKey={fldKey} />;
                })}
              </GridGroup>
            )}
      </form>
      {ConfirmButton ? (
        <ConfirmButton className="lsdvrform-form__submit" onClick={confirm}>
          Confirm
        </ConfirmButton>
      ) : (
        <BuiltinButton className="lsdvrform-form__submit" onClick={confirm}>
          Confirm
        </BuiltinButton>
      )}
    </div>
  );
};
