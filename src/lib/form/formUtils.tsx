import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
} from "react";

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
  header?: string;
}>;

export const GridGroup: ComponentType<PropsWithChildren<GridGroupProps>> = ({
  children,
}) => children;

export const buildGrid = (children: ReactNode): ReactNode => {
  return children;
};
