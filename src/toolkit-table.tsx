import React, { useState, useCallback, Suspense } from "react";
import { DataTable } from "./components/table/data-table";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import "./App.css";
import Ripple from "./components/ui/ripple";
import { ToolkitTableProps } from "./types/table-types";
import {
  DefaultToolkitTableFeatures,
  DefaultToolkitTableIcons,
  DefaultToolkitTableLabelsCommand,
  DefaultToolkitTableLabelsTable,
} from "./types/default-types";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./components/ui/command";
import { ToolkitForm } from "./components/form";

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ToolkitTable<ColumnData>(
  tableProps: ToolkitTableProps<ColumnData>
) {
  const [openCommand, setOpenCommand] = useState(false);
  const [openForm, setOpenForm] = useState<"add" | "edit" | undefined>(
    undefined
  );
  const loading = tableProps?.loading;

  const commandLabels = React.useMemo(
    () => ({
      ...DefaultToolkitTableLabelsCommand,
      ...tableProps?.label?.command,
    }),
    [tableProps?.label]
  );

  const tableLabels = React.useMemo(
    () => ({ ...DefaultToolkitTableLabelsTable, ...tableProps?.label?.table }),
    [tableProps?.label]
  );

  const tableIcons = React.useMemo(
    () => ({ ...DefaultToolkitTableIcons, ...tableProps?.icons?.table }),
    [tableProps?.icons]
  );

  const tableFeatures = React.useMemo(
    () => ({ ...DefaultToolkitTableFeatures, ...tableProps?.features?.table }),

    [tableProps?.features?.table]
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "j" &&
        (e.metaKey || e.ctrlKey) &&
        tableFeatures?.Command === true
      ) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commandsGroups = React.useMemo(() => {
    const keys = Object.keys(tableProps?.commands || {});
    return keys.map((key) => {
      const actions = tableProps.commands[key];
      return (
        <CommandGroup heading={key} key={key}>
          {actions.map((action, n) => {
            return (
              <CommandItem
                onSelect={(value) => {
                  action.callback();
                  setOpenCommand(false);
                }}
                key={`${key}_${n}`}
                className="cursor-pointer"
              >
                {action?.icon}
                {action?.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      );
    });
  }, [tableProps?.commands]);

  const buttonAddCallback = tableProps?.settings?.table?.buttonAddCallback;
  const onRefresh = tableProps?.settings?.table?.onRefresh;

  const handleEdit = useCallback((user: any) => {}, []);

  const handleOpenForm = useCallback(() => {
    if (buttonAddCallback) {
      buttonAddCallback();
      return;
    }
    setOpenForm(() => "add");
  }, [buttonAddCallback]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh().catch(console.error);
      return;
    }
  }, [onRefresh]);

  const handleCloseForm = useCallback(() => {}, []);

  const hasForm = tableFeatures?.Add || tableFeatures?.Edit;

  return (
    <>
      <div className="fluent-background" />
      <div className="relative min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <motion.div
            className="fluent-glass rounded-lg p-6 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-8 ">
              {tableFeatures?.Breadcrumb && (
                <motion.div
                  className="flex items-center space-x-2 text-primary mb-2"
                  variants={itemVariants}
                >
                  {tableIcons.breadcrumbIcon}
                  {tableIcons.breadcrumbArrow}
                  <span className="text-xl font-medium">
                    {tableLabels.breadcrumbLabel}
                  </span>
                </motion.div>
              )}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {tableFeatures?.Description ? (
                  <motion.div variants={itemVariants}>
                    <p className="mt-2 text-left text-muted-foreground max-w-2xl">
                      {tableLabels.description}
                    </p>
                  </motion.div>
                ) : (
                  <></>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {tableFeatures?.Refresh && (
                    <motion.div
                      variants={itemVariants}
                      className="flex-shrink-0"
                    >
                      <Button
                        onClick={handleRefresh}
                        className="fluent-button-secondary w-full md:w-auto "
                        size="lg"
                        variant="outline"
                      >
                        {tableIcons.refresh}
                        {tableLabels.refreshLabel}
                      </Button>
                    </motion.div>
                  )}
                  {tableFeatures?.Command && (
                    <motion.div
                      variants={itemVariants}
                      className="flex-shrink-0"
                    >
                      <Button
                        onClick={() => setOpenCommand((s) => !s)}
                        className="fluent-button-secondary w-full md:w-auto gap-2"
                        size="lg"
                        variant="outline"
                      >
                        {tableIcons.command}
                        {tableLabels.commandLabel}
                      </Button>
                    </motion.div>
                  )}
                  {tableFeatures?.Add && (
                    <motion.div
                      variants={itemVariants}
                      className="flex-shrink-0"
                    >
                      <Button
                        onClick={handleOpenForm}
                        className="fluent-button w-full md:w-auto dark:text-foreground"
                        size="lg"
                      >
                        {tableIcons.addButton}
                        {tableLabels.buttonAdd}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <Suspense fallback={<></>}>
              <motion.div variants={itemVariants}>
                <DataTable<ColumnData>
                  tableProps={tableProps}
                  setOpenForm={setOpenForm}
                />
              </motion.div>
            </Suspense>
          </motion.div>
        </div>
        {loading && <Ripple />}
      </div>

      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={commandLabels.placeholder}
          />
          <CommandList className="windows11-mica max-h-[300px] overflow-y-auto overflow-x-hidden">
            <CommandEmpty>{commandLabels.empty}</CommandEmpty>
            {commandsGroups}
          </CommandList>
        </Command>
      </CommandDialog>

      {hasForm && (
        <ToolkitForm<ColumnData>
          tableProps={tableProps}
          setOpenForm={setOpenForm}
          openForm={openForm}
        />
      )}
    </>
  );
}
