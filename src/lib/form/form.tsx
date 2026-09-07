import { CSSProperties, PropsWithChildren, useContext } from "react";
import { GFI, PreparedFormItem } from "../formItem/formItem.js";
import { FormProps, FormSchema } from "./formTypes.js";
import { BuiltinButton } from "../builtin/intrinsic/button.js";
import {
  getDataFormContext,
  DataFormProvider,
  DataFormContextMediator,
} from "./dataFormContext.js";
import { buildGrid, GridGroup } from "./gridUtils.js";

const formStyle = {
  display: "grid",
  gridAutoColumns: "150px minmax(100px, 1.3fr)",
  gridAutoRows: "minmax(30px, 1fr)",
  gap: 20,
};

export const DataForm = <Schema extends FormSchema>(
  props: PropsWithChildren<FormProps<Schema>>
) => (
  <DataFormProvider {...props}>
    <DataFormContent {...props} />
  </DataFormProvider>
);

const DataFormContent = <Schema extends FormSchema>({
  children,
  confirmButtonProps,
  gridStyle,
}: PropsWithChildren<FormProps<Schema>>) => {
  const mediator =
    useContext<DataFormContextMediator<Schema>>(getDataFormContext<Schema>());
  if (!mediator) {
    throw new Error("DataFormContent must be rendered inside DataFormProvider");
  }

  const { confirm, schema: mediatedSchema } = mediator;

  return (
    <div>
      <form
        className="lsdvrform-form"
        style={{ ...formStyle, ...(gridStyle ?? {}) }}
      >
        {children
          ? buildGrid(children)
          : buildGrid(
              <GridGroup>
                {Object.entries(mediatedSchema).map(([fldKey]) => GFI(fldKey))}
              </GridGroup>
            )}
      </form>
      <br />
      <BuiltinButton
        className="lsdvrform-form__submit"
        onClick={confirm}
        {...confirmButtonProps}
      >
        {confirmButtonProps?.children ?? "Confirm"}
      </BuiltinButton>
    </div>
  );
};
