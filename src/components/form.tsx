import useMediaQuery from "@/hooks/use-media-query";
import {
  ToolkitTableFormProps,
  ToolkitTableFormType,
  ToolkitTableProps,
} from "@/types/table-types";
import React from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { DefaultToolkitTableLabelsForm } from "@/types/default-types";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./ui/form";

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

const FormFieldComponent = ({
  fieldProps,
  formMethods,
  name,
}: {
  fieldProps: ToolkitTableFormProps;
  formMethods: UseFormReturn<FieldValues, any, undefined>;
  name: string;
}) => {
  switch (fieldProps.type) {
    case ToolkitTableFormType.Text:
      return (
        <FormField
          control={formMethods.control as any}
          name={name}
          render={({ field, fieldState, formState }) => {
            return (
              <FormItem>
                <FormLabel>{fieldProps.label}</FormLabel>
                <FormControl>
                  <Input
                    className={cn("fluent-input")}
                    placeholder={fieldProps?.placeholder}
                    {...field}
                  />
                </FormControl>
                {fieldProps?.description && (
                  <FormDescription>{fieldProps?.description}</FormDescription>
                )}
                {fieldState?.error && (
                  <p
                    className={cn("text-[0.8rem] font-medium text-destructive")}
                  >
                    {fieldState?.error?.message}
                  </p>
                )}
              </FormItem>
            );
          }}
        />
      );

    default:
      return <></>;
  }
};

const FormFieldMemo = React.memo(FormFieldComponent);

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

  const formLabels = React.useMemo(
    () => ({ ...DefaultToolkitTableLabelsForm, ...tableProps?.label?.form }),
    [tableProps?.label]
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = React.useState(Object.keys(form)[0]);

  const schema = React.useMemo(() => {
    const schemaShape: Record<string, any> = {};

    Object.entries(form).forEach(([tabKey, fields]) => {
      Object.entries(fields).forEach(([fieldKey, field]) => {
        if ("value" in field) {
          schemaShape[`${tabKey}.${fieldKey}`] = processField(field);
        }
      });
    });

    return z.object(schemaShape);
  }, [form]);

  const formMethods = useForm({
    resolver: zodResolver(schema),
    criteriaMode: tableProps?.settings?.form?.criteriaMode || "all",
    mode: tableProps?.settings?.form?.mode || "onChange",
  });

  React.useEffect(() => {
    formMethods.trigger();
  }, []);

  if (isDesktop) {
    return (
      <>
        <Dialog
          open={Boolean(openForm)}
          onOpenChange={(open) => {
            if (!open) {
              setOpenForm(undefined);
            }
          }}
        >
          <DialogContent
            className={cn(["windows11-mica fluent-glass sm:max-w-[960px]"])}
          >
            <DialogHeader>
              <DialogTitle>
                {openForm === "add" ? formLabels.add : formLabels.edit}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 px-4">
              <Form {...formMethods}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                    {Object.keys(form).map((tab) => (
                      <TabsTrigger key={tab} value={tab} className="capitalize">
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(form).map(([tab, fields]) => (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                      {Object.entries(fields).map(([fieldKey, field]) => (
                        <FormFieldMemo
                          key={fieldKey}
                          fieldProps={field}
                          formMethods={formMethods}
                          name={`${tab}.${fieldKey}.value`}
                        />
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </Form>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenForm(undefined)}
                className="fluent-button-secondary"
              >
                {formLabels.goBack}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Drawer
      open={Boolean(openForm)}
      onOpenChange={(open) => {
        if (!open) {
          setOpenForm(undefined);
        }
      }}
    >
      <DrawerContent className="fluent-glass">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {openForm === "add" ? formLabels.add : formLabels.edit}
          </DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 py-4">
          <Form {...formMethods}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                {Object.keys(form).map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="capitalize">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(form).map(([tab, fields]) => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {Object.entries(fields).map(([fieldKey, field]) => (
                    <FormFieldMemo
                      key={fieldKey}
                      fieldProps={field}
                      formMethods={formMethods}
                      name={`${tab}.${fieldKey}`}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </Form>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => setOpenForm(undefined)}
              className="fluent-button-secondary"
            >
              {formLabels.goBack}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
