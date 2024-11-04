import useMediaQuery from "@/hooks/use-media-query";
import {
  ToolkitTableFormProps,
  ToolkitTableFormType,
  ToolkitTableProps,
} from "@/types/table-types";
import React from "react";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Function to process each field and return the corresponding Zod schema
function processField(fieldProps: ToolkitTableFormProps): ZodTypeAny {
  switch (fieldProps.type) {
    case ToolkitTableFormType.Text:
    case ToolkitTableFormType.Cnpj:
    case ToolkitTableFormType.Cpf:
    case ToolkitTableFormType.Phone:
      return z.object({
        value: fieldProps.value,
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>().optional(),
        description: z.custom<React.ReactNode>().optional(),
        placeholder: z.string().optional(),
        mask: z.string().optional(),
      }); // ZodString

    case ToolkitTableFormType.Number:
    case ToolkitTableFormType.Currency:
    case ToolkitTableFormType.Decimal:
      return z.object({
        value: fieldProps.value,
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>().optional(),
        description: z.custom<React.ReactNode>().optional(),
        placeholder: z.string().optional(),
        mask: z.string().optional(),
        decimalScale: z.number().optional(),
        prefix: z.string().optional(),
        suffix: z.string().optional(),
      });

    case ToolkitTableFormType.Slider:
      return z.object({
        value: fieldProps.value,
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>().optional(),
        description: z.custom<React.ReactNode>().optional(),
        max: z.number(),
        min: z.number(),
        step: z.number(),
      });

    case ToolkitTableFormType.Block:
      return z.object({
        value: z.custom<React.ReactNode>(),
        type: z.nativeEnum(ToolkitTableFormType),
      }); // ZodLiteral<React.ReactNode>

    case ToolkitTableFormType.Alert:
      return z.object({
        value: z.custom<React.ReactNode>(),
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>().optional(),
        icon: z.custom<React.ReactNode>().optional(),
      }); // ZodLiteral<React.ReactNode>

    case ToolkitTableFormType.Checkbox:
    case ToolkitTableFormType.Switch:
      return z.object({
        value: fieldProps.value,
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>().optional(),
      }); // ZodString

    case ToolkitTableFormType.Select:
    case ToolkitTableFormType.RadioGroup:
      return z.object({
        value: fieldProps.value,
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>(),
        description: z.custom<React.ReactNode>().optional(),
        placeholder: z.string().optional(),
        group: z.array(
          z.object({
            label: z.custom<React.ReactNode>(),
            value: z.string(),
          })
        ),
      }); // ZodString

    case ToolkitTableFormType.Date:
      return z.object({
        value: fieldProps.value,
        type: z.nativeEnum(ToolkitTableFormType),
        label: z.custom<React.ReactNode>(),
        description: z.custom<React.ReactNode>().optional(),
        placeholder: z.string().optional(),
      }); // ZodString

    case ToolkitTableFormType.Column:
      // Recursively process nested fields
      return createSchemaFromFields(fieldProps.value);

    case ToolkitTableFormType.Tab:
      // Extract the literal value and process it
      const tabFields = fieldProps.value.value;
      return createSchemaFromFields(tabFields);

    default:
      return z.any();
  }
}

// Helper function to create schema from fields
function createSchemaFromFields(
  fields: Record<string, ToolkitTableFormProps>
): z.ZodObject<any> {
  const fieldSchemas: Record<string, ZodTypeAny> = {};

  for (const fieldKey in fields) {
    const fieldProps = fields[fieldKey];
    fieldSchemas[fieldKey] = processField(fieldProps);
  }

  return z.object(fieldSchemas);
}

export type ToolkitFormProps<ColumnData> = {
  tableProps: ToolkitTableProps<ColumnData>;
  openForm?: "add" | "edit";
  setOpenForm: React.Dispatch<React.SetStateAction<"add" | "edit" | undefined>>;
};

export function ToolkitForm<ColumnData>({
  tableProps,
  openForm,
  setOpenForm,
}: ToolkitFormProps<ColumnData>) {
  const form = tableProps?.form || {};

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = React.useState(Object.keys(form)[0]);

  const schema = React.useMemo(() => {
    const schemaShape: Record<string, any> = {};

    Object.entries(form).forEach(([tabKey, fields]) => {
      Object.entries(fields).forEach(([fieldKey, field]) => {
        if ("value" in field && field.value instanceof z.ZodType) {
          schemaShape[`${tabKey}.${fieldKey}`] = field.value;
        }
      });
    });

    return z.object(schemaShape);
  }, [form]);

  const formMethods = useForm({
    resolver: zodResolver(schema),
  });
}
