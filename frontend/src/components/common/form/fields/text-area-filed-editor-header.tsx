
import FormatType from "@/types/customtollbar";
import clsx from "clsx";
import * as Lucide from "lucide-react";




interface CustomToolbarProps {
    onToggle: (format: keyof FormatType, value?: boolean) => void;
    onHeader: (level: number | null) => void;
    onList: (type: "ordered" | "bullet") => void;
    formats: FormatType;
    classname: string
}


// ------------------ Toolbar ------------------
const CustomToolbar: React.FC<CustomToolbarProps> = ({
    onToggle,
    onHeader,
    onList,
    formats,
    classname
}) => {
    return (
        <div
            className={clsx(" flex flex-wrap items-center gap-2 p-[6px] border border-[#6B6B6B] rounded-[12px]  bg-[#FAFAFA] border-b-0 rounded-b-none ", classname)}
            role="toolbar"
            aria-label="Editor toolbar"
        >
            {/* Header dropdown */}
            <select
                className="ql-header-dropdown w-[150px] px-4 rounded-md py-1 "
                value={formats.header ?? "normal"}
                onChange={(e) =>
                    onHeader(e.target.value === "normal" ? null : parseInt(e.target.value, 10))
                }
            >
                <option value="normal">Normal</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
            </select>

            {/* Inline formatting */}
            <button
                type="button"
                className={`ql-btn ${formats.bold ? "active" : ""}`}
                title="Bold"
                onClick={() => onToggle("bold")}
            >
                <Lucide.Bold size={16} />
            </button>
            <button
                type="button"
                className={`ql-btn ${formats.italic ? "active" : ""}`}
                title="Italic"
                onClick={() => onToggle("italic")}
            >
                <Lucide.Italic size={16} />
            </button>
            <button
                type="button"
                className={`ql-btn ${formats.underline ? "active" : ""}`}
                title="Underline"
                onClick={() => onToggle("underline")}
            >
                <Lucide.Underline size={16} />
            </button>
            <button
                type="button"
                className={`ql-btn ${formats.strike ? "active" : ""}`}
                title="Strike"
                onClick={() => onToggle("strike")}
            >
                <Lucide.Strikethrough size={16} />
            </button>

            {/* Lists */}
            <button
                type="button"
                className={`ql-btn ${formats.list === "ordered" ? "active" : ""}`}
                title="Ordered list"
                onClick={() => onList("ordered")}
            >
                <Lucide.ListOrdered size={16} />
            </button>
            <button
                type="button"
                className={`ql-btn ${formats.list === "bullet" ? "active" : ""}`}
                title="Bullet list"
                onClick={() => onList("bullet")}
            >
                <Lucide.List size={16} />
            </button>
        </div>
    );
};

export default CustomToolbar;