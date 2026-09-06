import {
  Children,
  cloneElement,
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
  labelColSpan?: number;
  labelRowSpan?: number;
  controlColSpan?: number;
  controlRowSpan?: number;
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
  nextCursor: Cursor;
}

const buildChild = (
  child: ReactNode,
  cursor: Cursor,
  groupDepth = 1,
  rightEdge?: number
): BuiltChild => {
  if (isGridItem(child)) {
    const gridItem = child;
    const labelColEnd = cursor.col + (gridItem.props.labelColSpan ?? 1);
    const labelRowEnd = cursor.row + (gridItem.props.labelRowSpan ?? 1);
    const controlRowEnd = cursor.row + (gridItem.props.controlRowSpan ?? 1);
    const controlColEnd =
      gridItem.props.controlColSpan === undefined
        ? (rightEdge ?? labelColEnd + 1)
        : labelColEnd + gridItem.props.controlColSpan;

    return {
      content: cloneElement(gridItem, {
        ...gridItem.props,
        gridPositioning: {
          label: {
            row: [cursor.row, labelRowEnd],
            col: [cursor.col, labelColEnd],
          },
          control: {
            row: [cursor.row, controlRowEnd],
            col: [labelColEnd, controlColEnd],
          },
        },
      }),
      nextCursor: {
        row: Math.max(labelRowEnd, controlRowEnd),
        col: controlColEnd,
      },
    };
  }

  if (isGridGroup(child)) {
    const group = child;

    const contentStart = {
      row: cursor.row + (group.props.header ? 1 : 0),
      col: cursor.col,
    };

    let childCursor = { ...cursor };

    // Always the rightmost lowest point
    let bounds = { ...cursor };

    if (group.props.header) childCursor.row += 1;

    const contentRow: ReactNode[] = [];

    const groupChildren = Children.toArray(group.props.children);

    groupChildren.forEach((child, index) => {
      const { content, nextCursor } = buildChild(
        child,
        childCursor,
        groupDepth + 1,
        group.props.split && index < groupChildren.length - 1
          ? undefined
          : rightEdge
      );

      bounds = {
        row: Math.max(bounds.row, nextCursor.row),
        col: Math.max(bounds.col, nextCursor.col),
      };

      childCursor = group.props.split
        ? { row: contentStart.row, col: nextCursor.col }
        : { row: nextCursor.row, col: contentStart.col };

      contentRow.push(content);
    });

    if (group.props.header)
      contentRow.unshift(
        <div
          className={`lsdvrform-form__group-header lsdvrform-form__group-header__${groupDepth}`}
          style={{
            alignSelf: "center",
            gridColumn: `${cursor.col} / ${bounds.col}`,
            gridRow: `${cursor.row} / ${cursor.row + 1}`,
          }}
          key={`lsdvrform-form__group-header${cursor.col}/${bounds.col}:${cursor.row}/${cursor.row + 1}`}
        >
          {group.props.header}
        </div>
      );

    return {
      content: contentRow,
      nextCursor: bounds,
    };
  }

  return { content: null, nextCursor: cursor };
};

export const buildGrid = (children: ReactNode): ReactNode => {
  const rightEdge = Math.max(
    1,
    ...Children.toArray(children).map(
      (child) => buildChild(child, { col: 1, row: 1 }).nextCursor.col
    )
  );
  let cursor = { col: 1, row: 1 };

  return Children.map(children, (child) => {
    const result = buildChild(child, cursor, 1, rightEdge);

    cursor = { col: cursor.col, row: result.nextCursor.row };

    return result.content;
  });
};
