import { ComponentPropsWithoutRef, ComponentType } from "react";
import {
  ComponentFactoryType,
  DescriptorsValueTypes,
  FormItemNotify,
  ItemDescriptor,
} from "../formItem/formItemTypes";

export type FormSchema<KeysType extends object = Record<string, unknown>> =
  Record<Extract<keyof KeysType, string>, ItemDescriptor>;

export type InferDataFromSchema<Schema extends FormSchema> = {
  [Key in keyof Schema as Schema[Key] extends { required: true }
    ? Key
    : never]-?: DescriptorsValueTypes[Schema[Key]["component"]];
} & {
  [Key in keyof Schema as Schema[Key] extends { required: true }
    ? never
    : Key]?: DescriptorsValueTypes[Schema[Key]["component"]];
};

export interface FormProps<Schema extends FormSchema> {
  schema: Schema;
  componentFactory: ComponentFactoryType;
  initialData?: Partial<InferDataFromSchema<Schema>>;
  onConfirm?: (data: InferDataFromSchema<Schema>) => void;
  customValidate?: (
    data: Partial<InferDataFromSchema<Schema>>
  ) => FormItemNotify<Extract<keyof Schema, string>>[];
  gridRowHeight?: string;
  ConfirmButton?: ComponentType<ComponentPropsWithoutRef<"button">>;
}
