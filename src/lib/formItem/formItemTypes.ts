import { ComponentPropsWithoutRef, JSX } from "react";

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
}

export type ItemDescriptor = (
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
};

interface InputItemDescriptor extends ComponentPropsWithoutRef<"input"> {
  component: "input";
}

interface InputNumItemDescriptor extends ComponentPropsWithoutRef<"input"> {
  component: "inputNum";
}

interface CheckBoxItemDescriptor extends ComponentPropsWithoutRef<"input"> {
  component: "checkbox";
}

interface FileInputItemDescriptor extends Omit<
  ComponentPropsWithoutRef<"input">,
  "onPathChange"
> {
  component: "file";
}

interface ButtonItemDescriptor extends ComponentPropsWithoutRef<"button"> {
  component: "button";
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
