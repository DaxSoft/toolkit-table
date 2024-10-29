import { z } from "zod";

/**
 * @description Input field to be used in the schema
 * @example
 *   name: inputField.extend({
 *     category: z.literal('mask'),
 *     mask: z.literal('^[A-Za-z ]*$'),
 *   }),
 *   email: inputField.extend({
 *     category: z.literal('mask'),
 *     mask: z.literal('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
 *   }),
 *   phone: inputField.extend({
 *     category: z.literal('mask'),
 *     mask: z.literal('(999) 999-9999'),
 *   }),
 */
export const inputField = z.object({
  _type: z.literal("input"),
  category: z.enum(["currency", "mask", "number"]).optional(),
  mask: z.string().optional(),
  format: z
    .object({
      type: z.enum(["integer", "decimal"]),
      prefix: z.string().optional(),
      suffix: z.string().optional(),
    })
    .optional(),
  value: z.union([z.string(), z.number()]),
});
