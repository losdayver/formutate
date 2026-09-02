import { FormItemProps } from "./formItemTypes";

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = ({
  children,
  required,
  title,
  reactKey,
  divideAfter,
  notify,
  hint,
  disabled,
}) => {
  return (
    <div
      className={`lsdvr-data-form-form__item${notify ? ` ${notify.severity}` : ""}${disabled ? " disabled" : ""}`}
      key={reactKey}
    >
      <span className="lsdvr-data-form-form__label">
        {title}
        {hint ? (
          <span
            className="lsdvr-data-form-form__hint"
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
          <span className="lsdvr-data-form-form__required" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <span
        className={`lsdvr-data-form-form__control${notify?.message ? " lsdvr-data-form-form__control--with-message" : ""}`}
      >
        {children}
        {notify?.message && (
          <span
            className="lsdvr-data-form-form__message"
            role={notify.severity === "error" ? "alert" : "status"}
          >
            {notify.message}
          </span>
        )}
      </span>
      {divideAfter && <hr className="lsdvr-data-form-form__divider" />}
    </div>
  );
};
