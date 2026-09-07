import { ComponentPropsWithoutRef, JSX } from "react";
import { DataFormContextMediator } from "../form/dataFormContext.js";
import { FormSchema } from "../form/formTypes.js";
import { GridPositioning } from "../form/gridUtils.js";

export interface FormItemNotify<Keys extends string = string> {
  fld: Keys;
  severity: "info" | "warning" | "error";
  message?: string;
}

export interface FormItemProps {
  title: string;
  required?: boolean;
  reactKey?: string;
  notify?: FormItemNotify;
  hint?: string;
  disabled?: boolean;
  componentFactory?: ComponentFactoryType;
  gridPositioning?: GridPositioning;
}

export type ItemDescriptor<Schema extends FormSchema = any> = (
  | InputItemDescriptor
  | CheckBoxItemDescriptor
  | FileInputItemDescriptor
  | InputNumItemDescriptor
  | ButtonItemDescriptor
  | CustomItemDescriptor
) & {
  title: string;
  validator?: (value: any) => Omit<FormItemNotify, "fld"> | void;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
  placeholder?: string;
  // Map incoming value to something else before it is commited to form data
  mapOnChange?: (
    oldVal: any,
    newVal: any,
    mediator: DataFormContextMediator<Schema>
  ) => any;
  onAfterChange?: (
    oldVal: any,
    newVal: any,
    mediator: DataFormContextMediator<Schema>
  ) => void;
};

interface InputItemDescriptor {
  component: "input";
  componentProps?: ComponentPropsWithoutRef<"input">;
}

interface InputNumItemDescriptor {
  component: "inputNum";
  componentProps?: ComponentPropsWithoutRef<"input">;
}

interface CheckBoxItemDescriptor {
  component: "checkbox";
  componentProps?: ComponentPropsWithoutRef<"input">;
}

interface FileInputItemDescriptor {
  component: "file";
  componentProps?: ComponentPropsWithoutRef<"input">;
}

interface ButtonItemDescriptor {
  component: "button";
  componentProps?: ComponentPropsWithoutRef<"button">;
}

interface CustomItemDescriptor {
  component: "custom";
  customName: string;
  componentProps?: any;
}

export interface DescriptorsValueTypes {
  input: string;
  inputNum: number;
  checkbox: boolean;
  file: string;
  button: never;
  custom: any;
}

export type ComponentFactoryType = (
  descriptor: ItemDescriptor,
  value: any,
  onChange: (val: any) => void
) => JSX.Element;
