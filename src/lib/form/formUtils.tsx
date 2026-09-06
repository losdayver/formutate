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

export interface GridPositioning {
  label: { row: [number, number]; col: [number, number] };
  control: { row: [number, number]; col: [number, number] };
}

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
  header?: string;
}>;

type GridItemProps = PropsWithChildren<{
  gridPositioning?: GridPositioning;
}>;

export const GridItem: ComponentType<PropsWithChildren<GridItemProps>> = ({
  children,
  gridPositioning,
}) =>
  Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child, { ...(child?.props ?? {}), gridPositioning } as any)
      : child
  );

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
): element is ReactElement<GridItemProps, typeof GridItem> => {
  return isValidElement(element) && element.type === GridItem;
};

interface Cursor {
  row: number;
  col: number;
}

interface BuiltChild {
  content: ReactNode;
  /** Первая свободная позиция справа и снизу от построенного узла. */
  nextCursor: Cursor;
}

const buildChild = (child: ReactNode, cursor: Cursor): BuiltChild => {
  if (isGridItem(child)) {
    return {
      content: cloneElement(child, {
        ...child.props,
        gridPositioning: {
          label: {
            row: [cursor.row, cursor.row + 1],
            col: [cursor.col, cursor.col + 1],
          },
          control: {
            row: [cursor.row, cursor.row + 1],
            col: [cursor.col + 1, cursor.col + 2],
          },
        },
      }),
      nextCursor: {
        row: cursor.row + 1,
        col: cursor.col + 2,
      },
    };
  }

  if (isGridGroup(child)) {
    let childCursor = { ...cursor };
    // Always the right lowest point
    let bounds = { ...cursor };
    const group = child;

    const contentRow: ReactNode[] = [];

    Children.map(group.props.children, (child) => {
      const { content, nextCursor } = buildChild(child, childCursor);

      bounds = {
        row: Math.max(bounds.row, nextCursor.row),
        col: Math.max(bounds.col, nextCursor.col),
      };

      childCursor = group.props.split
        ? { row: cursor.row, col: nextCursor.col }
        : { row: nextCursor.row, col: cursor.col };

      contentRow.push(content);
    });

    return {
      content: contentRow,
      nextCursor: bounds,
    };
  }

  return { content: null, nextCursor: cursor };
};

export const buildGrid = (children: ReactNode): ReactNode => {
  let cursor = { col: 1, row: 1 };

  return Children.map(children, (child) => {
    const result = buildChild(child, cursor);

    cursor = { col: cursor.col, row: result.nextCursor.row };

    return result.content;
  });
};
