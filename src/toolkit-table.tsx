import React, { useState, useCallback, Suspense } from "react";
import { ComparassionToggle, DataTable } from "./components/table/data-table";
import { Plus, Users, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import "./App.css";
import { ColumnDef } from "@tanstack/react-table";
import Ripple from "./components/ui/ripple";

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

export type ToolkitTableProps<ColumnData, BodyData> = {
  breadcrumbIcon: React.ReactNode;
  breadcrumbLabel: React.ReactNode;
  tableDescription: React.ReactNode;
  buttonAddLabel: React.ReactNode;
  columns: ColumnDef<ColumnData>[];
  data: BodyData[];
  loading?: boolean;
  exportButton: React.ReactNode;
  visualizeButton: React.ReactNode;
  viewButton: React.ReactNode;
  defaultColumn?: Partial<ColumnDef<any, unknown>>;
  bulkActionsLabel: React.ReactNode;
  enableResizing: boolean;
  comparassionToggle?: ComparassionToggle;
  setComparassionToggle?: React.Dispatch<
    React.SetStateAction<ComparassionToggle>
  >;
};

export default function ToolkitTable<ColumnData, BodyData>({
  breadcrumbIcon,
  breadcrumbLabel,
  tableDescription,
  buttonAddLabel,
  columns,
  data,
  loading = false,
  exportButton = "Export",
  visualizeButton = "Visualize",
  viewButton = "View",
  defaultColumn,
  bulkActionsLabel,
  enableResizing,
  comparassionToggle,
  setComparassionToggle,
}: ToolkitTableProps<ColumnData, BodyData>) {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleEdit = useCallback((user: any) => {}, []);

  const handleOpenForm = useCallback(() => {}, []);

  const handleCloseForm = useCallback(() => {}, []);

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
              <motion.div
                className="flex items-center space-x-2 text-primary mb-2"
                variants={itemVariants}
              >
                {breadcrumbIcon}
                <ChevronRight className="h-4 w-4" />
                <span className="text-xl font-medium">{breadcrumbLabel}</span>
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <motion.div variants={itemVariants}>
                  <p className="mt-2 text-left text-muted-foreground max-w-2xl">
                    {tableDescription}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-shrink-0">
                  <Button
                    onClick={handleOpenForm}
                    className="fluent-button w-full md:w-auto dark:text-foreground"
                    size="lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {buttonAddLabel}
                  </Button>
                </motion.div>
              </div>
            </div>

            <Suspense fallback={<></>}>
              <motion.div variants={itemVariants}>
                <DataTable
                  columns={columns}
                  data={data}
                  onEdit={handleEdit}
                  exportButton={exportButton}
                  visualizeButton={visualizeButton}
                  viewButton={viewButton}
                  defaultColumn={defaultColumn}
                  bulkActionsLabel={bulkActionsLabel}
                  enableResizing={enableResizing}
                  comparassionToggle={comparassionToggle}
                  setComparassionToggle={setComparassionToggle}
                />
              </motion.div>
            </Suspense>
          </motion.div>
        </div>
        {loading && <Ripple />}
      </div>

      <Dialog open={showUserForm} onOpenChange={handleCloseForm}>
        <DialogContent className="fluent-glass sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
