"use client";
import { useCallback, useMemo } from "react";
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from "slate-react";
import { withHistory } from "slate-history";
import clsx from "clsx";
import Svg from "shared/components/icon/svg";
import { BaseEditor, Descendant, createEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type CustomElement =
  | { type: "paragraph"; children: CustomText[] }
  | { type: "heading"; children: CustomText[] }
  | { type: "list-item"; children: CustomText[] }
  | { type: "bulleted-list"; children: CustomElement[] }
  | { type: "numbered-list"; children: CustomElement[] };

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
}: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading":
        return (
          <h3 {...props.attributes} className="text-lg font-semibold mb-2">
            {props.children}
          </h3>
        );
      case "list-item":
        return (
          <li {...props.attributes} className="ml-4">
            {props.children}
          </li>
        );
      case "bulleted-list":
        return (
          <ul {...props.attributes} className="list-disc pl-4 space-y-1">
            {props.children}
          </ul>
        );
      case "numbered-list":
        return (
          <ol {...props.attributes} className="list-decimal pl-4 space-y-1">
            {props.children}
          </ol>
        );
      default:
        return (
          <p {...props.attributes} className="mb-2">
            {props.children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let children = <span {...props.attributes}>{props.children}</span>;

    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }

    if (props.leaf.underline) {
      children = <u>{children}</u>;
    }

    return children;
  }, []);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const content = JSON.stringify(newValue);
      onChange(content);
    },
    [onChange]
  );

  const slateValue = useMemo(() => {
    try {
      return value ? JSON.parse(value) : initialValue;
    } catch {
      return initialValue;
    }
  }, [value]);

  return (
    <div className={clsx("border rounded-lg overflow-hidden", className)}>
      <div className="border-b bg-gray-50 p-2 flex gap-1">
        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bold">
          <Svg src="/icons/bold.svg" width={16} height={16} />
        </button>
        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Italic">
          <Svg src="/icons/italic.svg" width={16} height={16} />
        </button>
        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Underline">
          <Svg src="/icons/underline.svg" width={16} height={16} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bulleted List">
          <Svg src="/icons/list-bullet.svg" width={16} height={16} />
        </button>
        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
          <Svg src="/icons/list-number.svg" width={16} height={16} />
        </button>
      </div>

      <div className="p-4">
        <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            className="min-h-[120px] outline-none"
          />
        </Slate>
      </div>
    </div>
  );
}
