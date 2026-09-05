import {
  addressFormValidator,
  portFormValidator,
  tagFormValidator,
} from "../../lib/builtin/commonFormValidators";
import { builtinComponentFactory } from "../../lib/builtin/componentFactory";
import { DataForm } from "../../lib/form/form";
import { GridGroup } from "../../lib/form/formUtils";
import { PFI } from "../../lib/formItem/formItem";

export const PreviewApp = () => {
  return (
    <div
      style={{
        width: 1500,
        border: "1px solid white",
        borderRadius: 10,
        padding: 8,
        backgroundColor: "#040404",
      }}
    >
      <DataForm
        gridRowHeight={"50px"}
        componentFactory={builtinComponentFactory}
        initialData={{
          selfTag: "oidfun0sdn7u09ascn09anc09asnscdssdds",
        }}
        onConfirm={(data) => alert(JSON.stringify(data))}
        schema={{
          selfTag: {
            title: "Self tag",
            component: "input",
            validator: tagFormValidator,
            disabled: true,
          },
          distantTag: {
            title: "Distant tag",
            component: "input",
            required: true,
            validator: tagFormValidator,
            onAfterChange: (_, newVal, mediator) => {
              mediator.setFormData({
                ...mediator.formData,
                distantTag: newVal + "1",
              });
            },
          },
          aggressive: {
            title: "Aggressive mode",
            component: "checkbox",
            hint: "Upon request timeout will try again and again indefinitely",
            onAfterChange: (_, newVal, mediator) => {
              mediator.setSchema({
                ...mediator.schema,
                selfAddr: { ...mediator.schema.selfAddr, required: !!newVal },
              });
            },
          },
          selfAddr: {
            title: "Self address",
            component: "input",
            placeholder: "XXX.XXX.XXX.XXX",
            validator: addressFormValidator,
            hint: "If you want to bind your udp socket to a specific address",
          },
          selfPort: {
            title: "Self port",
            component: "inputNum",
            validator: portFormValidator,
            hint: "If you want to bind your udp socket to a specific port",
          },
          relayAddr: {
            title: "Relay address",
            component: "input",
            placeholder: "XXX.XXX.XXX.XXX",
            required: true,
            validator: addressFormValidator,
          },
          relayPort: {
            title: "Relay port",
            component: "inputNum",
            required: true,
            validator: portFormValidator,
          },
          encrypt: {
            component: "checkbox",
            title: "Use encryption",
          },
        }}
      >
        <GridGroup split header="Parameters">
          <GridGroup split header="Distant parameters">
            {PFI("selfTag")}
            {PFI("distantTag")}
          </GridGroup>
          <GridGroup split header="Self parameters">
            {PFI("aggressive")}
            {PFI("selfAddr")}
            {PFI("selfPort")}
          </GridGroup>
        </GridGroup>
        <GridGroup split header="Relay parameters">
          {PFI("relayAddr")}
          {PFI("relayPort")}
        </GridGroup>
        {PFI("encrypt")}
      </DataForm>
    </div>
  );
};
