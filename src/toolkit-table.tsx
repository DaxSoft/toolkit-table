import { DataTable } from "./components/table/data-table";
import React, { useState, useCallback } from "react";
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

export type ToolkitTableProps<ColumnData, TData> = {
  breadcrumbIcon: React.ReactNode;
  breadcrumbLabel: React.ReactNode;
  tableDescription: React.ReactNode;
  buttonAddLabel: React.ReactNode;
  columns: ColumnDef<ColumnData>[];
};

export default function ToolkitTable<ColumnData, TData>({
  breadcrumbIcon,
  breadcrumbLabel,
  tableDescription,
  buttonAddLabel,
  columns,
}: ToolkitTableProps<ColumnData, TData>) {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formValues, setFormValues] =
    useState<Partial<UserFormData>>(defaultValues);

  const handleSubmit = useCallback(async (data: UserFormData) => {
    console.log("Form submitted:", data);
    setShowUserForm(false);
    setEditingUser(null);
    setFormValues(defaultValues);
  }, []);

  const handleEdit = useCallback((user: any) => {
    const formData: Partial<UserFormData> = {
      general: {
        _type: "tab",
        _title: "General Information",
        _description: "Basic user details",
        name: {
          _type: "input",
          category: "mask",
          mask: "^[A-Za-z ]*$",
          value: user.name,
        },
        email: {
          _type: "input",
          category: "mask",
          mask: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          value: user.email,
        },
        phone: {
          _type: "input",
          category: "mask",
          mask: "(999) 999-9999",
          value: "",
        },
      },
      financial: {
        _type: "tab",
        _title: "Financial Details",
        _description: "Salary and budget information",
        salary: {
          _type: "input",
          category: "currency",
          value: 0,
        },
        budget: {
          _type: "input",
          category: "number",
          format: {
            type: "decimal",
            prefix: "$",
          },
          value: 0,
        },
      },
      projects: {
        _type: "tab",
        _title: "Project Assignment",
        _description: "Manage project assignments",
        supervisor: {
          _type: "dialog",
          _id: "",
          value: "",
          endpoint: "/api/supervisors",
        },
        assignedProjects: {
          _type: "table",
          data:
            user.projects?.map((project: string) => ({
              id: crypto.randomUUID(),
              name: project,
              role: "member",
              startDate: new Date(),
            })) || [],
        },
      },
    };

    setEditingUser(user);
    setFormValues(formData);
    setShowUserForm(true);
  }, []);

  const handleOpenForm = useCallback(() => {
    setEditingUser(null);
    setFormValues(defaultValues);
    setShowUserForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowUserForm(false);
    setEditingUser(null);
    setFormValues(defaultValues);
  }, []);

  return (
    <>
      <div className="fluent-background" />
      <div className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <motion.div
            className="fluent-glass rounded-lg p-6 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-8">
              <motion.div
                className="flex items-center space-x-2 text-primary mb-2"
                variants={itemVariants}
              >
                {breadcrumbIcon}
                <ChevronRight className="h-4 w-4" />
                <span className="text-sm font-medium">{breadcrumbLabel}</span>
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <motion.div variants={itemVariants}>
                  <p className="mt-2 text-muted-foreground max-w-2xl">
                    {tableDescription}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-shrink-0">
                  <Button
                    onClick={handleOpenForm}
                    className="fluent-button w-full md:w-auto"
                    size="lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {buttonAddLabel}
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div variants={itemVariants}>
              <DataTable columns={columns} data={users} onEdit={handleEdit} />
            </motion.div>
          </motion.div>
        </div>
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
