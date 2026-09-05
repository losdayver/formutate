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
  notify?: FormItemNotify;
  hint?: string;
  disabled?: boolean;
  componentFactory?: ComponentFactoryType;
  gridPositioning?: {
    label: {
      vertical: { from: number; to: number };
      horizontal: { from: number; to: number };
    };
    control: {
      vertical: { from: number; to: number };
      horizontal: { from: number; to: number };
    };
  };
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
