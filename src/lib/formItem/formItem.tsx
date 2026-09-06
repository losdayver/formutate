import { CSSProperties, useContext } from "react";
import { DataFormContext } from "../form/dataFormContext";
import { FormItemProps } from "./formItemTypes";
import React from "react";
import { GridItem, GridPositioning } from "../form/formUtils";

const formItemGridStyle: CSSProperties = {
  display: "contents",
};

const controlLayoutStyle: CSSProperties = {
  position: "relative",
  minWidth: 0,
};

const messageLayoutStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 2px)",
  right: 0,
  zIndex: 1,
  maxWidth: "100%",
};

export interface PreparedFormItemProps {
  fldKey: string;
  formItemProps?: Partial<FormItemProps>;
  gridPositioning?: GridPositioning;
}

export const PreparedFormItem: React.FC<PreparedFormItemProps> = ({
  fldKey,
  formItemProps,
  gridPositioning,
}) => {
  const mediator = useContext(DataFormContext)!;
  const { componentFactory, schema, formData, setFormData, errors } = mediator;

  const descriptor = schema[fldKey];
  const error = errors.find((err) => err.fld == fldKey);

  return (
    <FormItem
      {...descriptor}
      notify={error}
      {...formItemProps}
      gridPositioning={gridPositioning}
    >
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

export const GFI = (fldKey: string, fromItemProps?: Partial<FormItemProps>) => (
  <GridItem>
    <PreparedFormItem fldKey={fldKey} formItemProps={fromItemProps} />
  </GridItem>
);

export const EmptyFormItem = () => <></>;

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = ({
  children,
  required,
  title,
  notify,
  hint,
  disabled,
  gridPositioning,
}) => {
  return (
    <div
      className={[
        "lsdvrform-form__item",
        notify?.severity,
        disabled ? "disabled" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      style={formItemGridStyle}
    >
      <div
        className="lsdvrform-form__label"
        style={{
          alignSelf: "center",
          ...(gridPositioning
            ? {
                gridColumn: `${gridPositioning.label.col[0]} / ${gridPositioning.label.col[1]}`,
                gridRow: `${gridPositioning.label.row[0]} / ${gridPositioning.label.row[1]}`,
              }
            : {}),
        }}
      >
        {title}
        {required && (
          <span className="lsdvrform-form__required" aria-hidden="true">
            *
          </span>
        )}
        {hint ? (
          <span
            className="lsdvrform-form__hint"
            data-hint={hint}
            aria-label={`Hint: ${hint}`}
            tabIndex={0}
          >
            {"\u2754"}
          </span>
        ) : (
          ""
        )}
        :
      </div>
      <div
        className={`lsdvrform-form__control${notify?.message ? " lsdvrform-form__control--with-message" : ""}`}
        style={{
          ...controlLayoutStyle,
          ...(gridPositioning
            ? {
                gridColumn: `${gridPositioning.control.col[0]} / ${gridPositioning.control.col[1]}`,
                gridRow: `${gridPositioning.control.row[0]} / ${gridPositioning.control.row[1]}`,
              }
            : {}),
        }}
      >
        {children}
        {notify?.message && (
          <span
            className="lsdvrform-form__message"
            role={notify.severity === "error" ? "alert" : "status"}
            style={messageLayoutStyle}
          >
            {notify.message}
          </span>
        )}
      </div>
    </div>
  );
};
