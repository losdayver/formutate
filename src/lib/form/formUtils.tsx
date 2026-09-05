import {
  Children,
  ComponentType,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import { PreparedFormItem } from "../formItem/formItem";
import { FormItemProps } from "../formItem/formItemTypes";

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
}>;

export const GridGroup: ComponentType<PropsWithChildren<GridGroupProps>> = ({
  children,
}) => children;

const isGridGroup = (
  element: ReactNode
): element is ReactElement<GridGroupProps, typeof GridGroup> => {
  return isValidElement(element) && element.type === GridGroup;
};

const isGridItem = (
  element: ReactNode
): element is ReactElement<
  React.PropsWithChildren<FormItemProps>,
  typeof PreparedFormItem
> => {
  return isValidElement(element) && element.type === PreparedFormItem;
};

export const buildGrid = (
  children: ReactNode,
  position = { row: 1, column: 1 },
  split?: boolean
) => {
  if (!children) return undefined;
  return Children.map(children, (element) => {
    if (isGridGroup(element)) {
      if (element.props.split) {
        return buildGrid(
          element.props.children,
          {
            column: position.column,
            row: position.row + 1,
          },
          split
        );
      }
      return buildGrid(element.props.children, {
        column: position.column,
        row: position.row + 1,
      });
    } else if (isGridItem(element)) {
      return {
        ...element,
        props: {
          ...element.props,
          additionalProps: {
            gridPositioning: {
              label: {
                vertical: { from: position.row, to: position.row + 1 },
                horizontal: {
                  from: position.column,
                  to: position.column + 1,
                },
              },
              control: {
                vertical: { from: position.row + 1, to: position.row + 2 },
                horizontal: {
                  from: position.column,
                  to: position.column + 1,
                },
              },
            },
          },
        },
      };
    }
  });
};
