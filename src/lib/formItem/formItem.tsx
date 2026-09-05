import { ComponentType, PropsWithChildren, useContext } from "react";
import { DataFormContext } from "../form/dataFormContext";
import { FormItemProps } from "./formItemTypes";
import React from "react";

export const PreparedFormItem: React.FC<
  { fldKey: string } & {
    additionalProps?: React.PropsWithChildren<FormItemProps>;
  }
> = ({ fldKey, additionalProps }) => {
  const mediator = useContext(DataFormContext)!;
  const { componentFactory, schema, formData, setFormData, errors } = mediator;

  const descriptor = schema[fldKey];
  const error = errors.find((err) => err.fld == fldKey);

  return (
    <FormItem {...descriptor} notify={error} {...additionalProps}>
      {componentFactory(descriptor, formData[fldKey], (val: any) => {
        const oldVal = formData[fldKey];
        descriptor.onBeforeChange?.(oldVal, val, mediator as any);
        setFormData((prev) =>
          Object.is(prev[fldKey], val) ? prev : { ...prev, [fldKey]: val }
        );
        descriptor.onAfterChange?.(oldVal, val, mediator as any);
      })}
    </FormItem>
  );
};

export const PFI = (
  fldKey: string,
  additionalProps?: React.PropsWithChildren<FormItemProps>
) => <PreparedFormItem fldKey={fldKey} additionalProps={additionalProps} />;

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = ({
  children,
  required,
  title,
  notify,
  hint,
  gridPositioning,
}) => {
  return (
    <>
      <div
        className="lsdvrform-form__label"
        style={
          gridPositioning
            ? {
                gridColumn: `${gridPositioning.label.horizontal.from} / ${gridPositioning.label.horizontal.to}`,
                gridRow: `${gridPositioning.label.vertical.from} / ${gridPositioning.label.vertical.to}`,
              }
            : {}
        }
      >
        {title}
        {hint ? (
          <span
            className="lsdvrform-form__hint"
            data-hint={hint}
            aria-label={`Подсказка: ${hint}`}
            tabIndex={0}
          >
            ❔
          </span>
        ) : (
          ""
        )}
        :
        {required && (
          <span className="lsdvrform-form__required" aria-hidden="true">
            *
          </span>
        )}
      </div>
      <div
        className={`lsdvrform-form__control${notify?.message ? " lsdvrform-form__control--with-message" : ""}`}
        style={
          gridPositioning
            ? {
                gridColumn: `${gridPositioning.control.horizontal.from} / ${gridPositioning.control.horizontal.to}`,
                gridRow: `${gridPositioning.control.vertical.from} / ${gridPositioning.control.vertical.to}`,
              }
            : {}
        }
      >
        {children}
        {notify?.message && (
          <span
            className="lsdvrform-form__message"
            role={notify.severity === "error" ? "alert" : "status"}
          >
            {notify.message}
          </span>
        )}
      </div>
    </>
  );
};
