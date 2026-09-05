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
import { PreparedFormItem } from "../formItem/formItem";

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

type GridItemElement = ReactElement<
  ComponentProps<typeof PreparedFormItem>,
  typeof PreparedFormItem
>;

const isGridItem = (element: ReactNode): element is GridItemElement => {
  return isValidElement(element) && element.type === PreparedFormItem;
};

type GridRow = GridItemElement[];

const buildGridRows = (children: ReactNode): GridRow[] => {
  const rows: GridRow[] = [];

  Children.forEach(children, (element) => {
    if (isGridGroup(element)) {
      if (element.props.split) {
        const splitRow = buildGridRows(element.props.children).flat();
        if (splitRow.length > 0) rows.push(splitRow);
      } else {
        rows.push(...buildGridRows(element.props.children));
      }
    } else if (isGridItem(element)) {
      rows.push([element]);
    }
  });

  return rows;
};

export const buildGrid = (children: ReactNode): ReactNode => {
  return buildGridRows(children).flatMap((row, rowIndex) => {
    const rowStart = rowIndex + 1;

    return row.map((element, itemIndex) => {
      const labelColumnStart = itemIndex * 2 + 1;
      const controlColumnStart = labelColumnStart + 1;

      return cloneElement(element, {
        ...element.props,
        additionalProps: {
          ...element.props.additionalProps,
          gridPositioning: {
            label: {
              vertical: { from: rowStart, to: rowStart + 1 },
              horizontal: {
                from: labelColumnStart,
                to: labelColumnStart + 1,
              },
            },
            control: {
              vertical: { from: rowStart, to: rowStart + 1 },
              horizontal: {
                from: controlColumnStart,
                to: controlColumnStart + 1,
              },
            },
          },
        },
      });
    });
  });
};
