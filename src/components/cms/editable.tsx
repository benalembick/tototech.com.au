"use client";

import { ReactNode } from "react";

export type EditableType = "text" | "rich" | "rich-array" | "link" | "image" | "collection";

type EditableProps = {
  file: string;
  path: string;
  label: string;
  type?: EditableType;
  required?: boolean;
  multiline?: boolean;
  children: ReactNode;
  className?: string;
  as?: "span" | "div";
  collectionIndex?: number;
};

export function Editable({
  file,
  path,
  label,
  type = "text",
  required = false,
  multiline = false,
  children,
  className,
  as = "span",
  collectionIndex,
}: EditableProps) {
  const Component = as;
  const shouldRenderHtml = (type === "rich" || type === "rich-array") && typeof children === "string";

  return (
    <Component
      className={className}
      data-cms-editable="true"
      data-cms-file={file}
      data-cms-path={path}
      data-cms-label={label}
      data-cms-type={type}
      data-cms-required={required ? "true" : "false"}
      data-cms-multiline={multiline ? "true" : "false"}
      data-cms-collection-index={collectionIndex ?? undefined}
    >
      {shouldRenderHtml ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
    </Component>
  );
}

export function EditableHtml({
  html,
  fallback,
  ...props
}: Omit<EditableProps, "children"> & { html: string; fallback?: ReactNode }) {
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return <Editable {...props}>{fallback ?? html}</Editable>;
  }

  return (
    <Editable {...props} as={props.as ?? "span"}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </Editable>
  );
}
