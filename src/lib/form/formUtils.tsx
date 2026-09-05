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
import { PreparedFormItem, EmptyFormItem } from "../formItem/formItem";

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
  header?: string;
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

type EmptyGridItemElement = ReactElement<
  ComponentProps<typeof EmptyFormItem>,
  typeof EmptyFormItem
>;

const isEmptyGridItem = (
  element: ReactNode
): element is EmptyGridItemElement => {
  return isValidElement(element) && element.type === EmptyFormItem;
};

type GridRowElement = GridItemElement | EmptyGridItemElement;

interface GridItemsRow {
  type: "items";
  elements: GridRowElement[];
}

interface GridHeaderRow {
  type: "header";
  columnSpan: number;
  content: string;
}

type GridRow = GridItemsRow | GridHeaderRow;

const getGridRowColumnSpan = (row: GridRow): number =>
  row.type === "items" ? row.elements.length * 2 : row.columnSpan;

const buildGridRows = (children: ReactNode): GridRow[] => {
  const rows: GridRow[] = [];

  Children.forEach(children, (element) => {
    if (isGridGroup(element)) {
      const nestedRows = buildGridRows(element.props.children);
      let groupRows = nestedRows;

      if (element.props.split) {
        const nestedHeaders = nestedRows.filter(
          (row): row is GridHeaderRow => row.type === "header"
        );
        const splitElements = nestedRows.flatMap((row) =>
          row.type === "items" ? row.elements : []
        );

        groupRows = [...nestedHeaders];
        if (splitElements.length > 0) {
          groupRows.push({ type: "items", elements: splitElements });
        }
      }

      if (element.props.header !== undefined) {
        const columnSpan = Math.max(
          2,
          ...groupRows.map(getGridRowColumnSpan)
        );

        rows.push({
          type: "header",
          columnSpan,
          content: element.props.header,
        });
      }

      rows.push(...groupRows);
    } else if (isGridItem(element) || isEmptyGridItem(element)) {
      rows.push({ type: "items", elements: [element] });
    }
  });

  return rows;
};

export const buildGrid = (children: ReactNode): ReactNode => {
  return buildGridRows(children).flatMap((row, rowIndex) => {
    const rowStart = rowIndex + 1;

    if (row.type === "header") {
      return (
        <div
          className="lsdvrform-form__group-header"
          key={`grid-header-${rowIndex}`}
          style={{
            gridColumn: `1 / span ${row.columnSpan}`,
            gridRow: `${rowStart} / ${rowStart + 1}`,
          }}
        >
          {row.content}
        </div>
      );
    }

    return row.elements.map((element, itemIndex) => {
      const labelColumnStart = itemIndex * 2 + 1;
      const controlColumnStart = labelColumnStart + 1;

      if (isEmptyGridItem(element)) return undefined;

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
