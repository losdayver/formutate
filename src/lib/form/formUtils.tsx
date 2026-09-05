import {
  Children,
  cloneElement,
  ComponentProps,
  ComponentType,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import { PreparedFormItem, PreparedFormItemProps } from "../formItem/formItem";

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
  header?: string;
}>;

export const GridGroup: ComponentType<PropsWithChildren<GridGroupProps>> = ({
  children,
}) => children;

interface GridPosition {
  row: number;
  col: number;
}
const isGridGroup = (
  element: ReactNode
): element is ReactElement<GridGroupProps, typeof GridGroup> => {
  return isValidElement(element) && element.type === GridGroup;
};

const isGridItem = (
  element: ReactNode
): element is ReactElement<PreparedFormItemProps, typeof PreparedFormItem> => {
  return isValidElement(element) && element.type === PreparedFormItem;
};

export const buildGrid = (
  children: ReactNode,
  initialPosition: GridPosition = { col: 1, row: 1 }
): ReactNode => {
  return Children.map(children, (child) => {
    if (isGridGroup(child)) {
      if (child.props.split) {
        return Children.map(child.props.children, (child, index) =>
          buildGrid(child, {
            ...initialPosition,
            col: initialPosition.col + index,
            row: initialPosition.row,
          })
        );
      }
      return Children.map(child.props.children, (child, index) =>
        buildGrid(child, {
          ...initialPosition,
          row: initialPosition.row + index,
        })
      );
    } else if (isGridItem(child))
      return cloneElement(child, {
        ...child.props,
        additionalProps: {
          gridPositioning: {
            label: {
              vertical: {
                from: initialPosition.row,
                to: initialPosition.row + 1,
              },
              horizontal: {
                from: initialPosition.col,
                to: initialPosition.col + 1,
              },
            },
            control: {
              vertical: {
                from: initialPosition.row,
                to: initialPosition.row + 1,
              },
              horizontal: {
                from: initialPosition.col + 1,
                to: initialPosition.col + 2,
              },
            },
          },
        },
      });
  });
};
