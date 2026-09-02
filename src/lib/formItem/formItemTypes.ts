import { ComponentPropsWithoutRef, JSX } from "react";
import { DataFormContextMediator } from "../form/dataFormContext";
import { FormSchema } from "../form/formTypes";

export interface FormItemNotify<Keys extends string = string> {
  fld: Keys;
  severity: "info" | "warning" | "error";
  message?: string;
}

export interface FormItemProps {
  title: string;
  required?: boolean;
  reactKey?: string;
  divideAfter?: boolean;
  notify?: FormItemNotify;
  hint?: string;
  disabled?: boolean;
  componentFactory?: ComponentFactoryType;
}

export type ItemDescriptor<Schema extends FormSchema = any> = (
  | InputItemDescriptor
  | CheckBoxItemDescriptor
  | FileInputItemDescriptor
  | InputNumItemDescriptor
  | ButtonItemDescriptor
) & {
  title: string;
  validator?: (value: any) => Omit<FormItemNotify, "fld"> | void;
  required?: boolean;
  divideAfter?: boolean;
  hint?: string;
  disabled?: boolean;
  placeholder?: string;
  onBeforeChange?: (
    oldVal: any,
    newVal: any,
    mediator: DataFormContextMediator<Schema>
  ) => void;
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

export interface DescriptorsValueTypes {
  input: string;
  inputNum: number;
  checkbox: boolean;
  file: string;
  button: never;
}

export type ComponentFactoryType = (
  descriptor: ItemDescriptor,
  value: any,
  onChange: (val: any) => void
) => JSX.Element;
