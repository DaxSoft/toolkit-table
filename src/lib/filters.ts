import { z } from "zod";

export const filterOperators = {
  string: ["contains", "equals", "startsWith", "endsWith"] as const,
  number: ["equals", "gt", "gte", "lt", "lte", "between"] as const,
  date: ["equals", "before", "after", "between"] as const,
} as const;

export type FilterOperator =
  | (typeof filterOperators.string)[number]
  | (typeof filterOperators.number)[number]
  | (typeof filterOperators.date)[number];

export interface FilterValue {
  operator: FilterOperator;
  value: unknown;
  valueTo?: unknown; // For range filters
  caseSensitive?: boolean;
}

export interface ColumnFilter {
  id: string;
  type: "string" | "number" | "date";
  value: FilterValue | null;
}

export const filterSchema = z.object({
  operator: z.enum([
    ...filterOperators.string,
    ...filterOperators.number,
    ...filterOperators.date,
  ]),
  value: z.unknown(),
  valueTo: z.unknown().optional(),
  caseSensitive: z.boolean().optional(),
});

export type FilterSchema = z.infer<typeof filterSchema>;

export function applyFilter(
  value: unknown,
  filter: FilterValue,
  type: "string" | "number" | "date"
): boolean {
  if (!filter?.operator || (!filter?.value && filter?.value !== 0)) return true;

  switch (type) {
    case "string":
      return applyStringFilter(String(value), filter);
    case "number":
      return applyNumberFilter(Number(value), filter);
    case "date":
      return applyDateFilter(
        value instanceof Date ? value : new Date(value as string),
        filter
      );
    default:
      return true;
  }
}

function applyStringFilter(value: string, filter: FilterValue): boolean {
  if (!filter.value) return true;

  const filterValue = String(filter.value);
  const compareValue = filter.caseSensitive ? value : value.toLowerCase();
  const compareFilter = filter.caseSensitive
    ? filterValue
    : filterValue.toLowerCase();

  switch (filter.operator) {
    case "contains":
      return compareValue.includes(compareFilter);
    case "equals":
      return compareValue === compareFilter;
    case "startsWith":
      return compareValue.startsWith(compareFilter);
    case "endsWith":
      return compareValue.endsWith(compareFilter);
    default:
      return true;
  }
}

function applyNumberFilter(value: number, filter: FilterValue): boolean {
  const filterValue = Number(filter.value);
  const filterValueTo = filter.valueTo ? Number(filter.valueTo) : undefined;

  if (isNaN(filterValue)) return true;

  switch (filter.operator) {
    case "equals":
      return value === filterValue;
    case "gt":
      return value > filterValue;
    case "gte":
      return value >= filterValue;
    case "lt":
      return value < filterValue;
    case "lte":
      return value <= filterValue;
    case "between":
      return filterValueTo !== undefined && !isNaN(filterValueTo)
        ? value >= filterValue && value <= filterValueTo
        : true;
    default:
      return true;
  }
}

function applyDateFilter(value: Date, filter: FilterValue): boolean {
  const filterValue = new Date(filter.value as string);
  const filterValueTo = filter.valueTo
    ? new Date(filter.valueTo as string)
    : undefined;

  if (isNaN(filterValue.getTime())) return true;

  switch (filter.operator) {
    case "equals":
      return value.getTime() === filterValue.getTime();
    case "before":
      return value < filterValue;
    case "after":
      return value > filterValue;
    case "between":
      return filterValueTo !== undefined && !isNaN(filterValueTo.getTime())
        ? value >= filterValue && value <= filterValueTo
        : true;
    default:
      return true;
  }
}
