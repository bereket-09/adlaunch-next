import { useState } from "react";
import { Download, FileSpreadsheet, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportButtonProps {
  data?: { [sheetName: string]: any[] }; // support multiple sheets
  filename?: string;
  variant?: "default" | "outline" | "ghost";
}

const ExportButton = ({
  data = {},
  filename = "export",
  variant = "outline",
}: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    setIsExporting(true);

    try {
      if (format === "xlsx") {
        const workbook = XLSX.utils.book_new();
        for (const sheetName in data) {
          const ws = XLSX.utils.json_to_sheet(data[sheetName]);
          XLSX.utils.book_append_sheet(workbook, ws, sheetName);
        }
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      }

      if (format === "csv") {
        // CSV: only export first sheet
        const firstSheetName = Object.keys(data)[0];
        if (firstSheetName) {
          const ws = XLSX.utils.json_to_sheet(data[firstSheetName]);
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${filename}.csv`;
          link.click();
        }
      }

      if (format === "pdf") {
        const doc = new jsPDF();
        let yOffset = 10;
        for (const sheetName in data) {
          const rows = data[sheetName].map((row) => Object.values(row));
          const headers = Object.keys(data[sheetName][0] || {});
          doc.text(sheetName, 10, yOffset);
          // @ts-ignore
          doc.autoTable({ head: [headers], body: rows, startY: yOffset + 5 });
          // @ts-ignore
          yOffset = doc.lastAutoTable?.finalY + 10 || yOffset + 60;
        }
        doc.save(`${filename}.pdf`);
      }

      toast.success(`${format.toUpperCase()} export started`, {
        description: `${filename}.${format} downloaded successfully.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="gap-2" disabled={isExporting}>
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          className="gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("xlsx")}
          className="gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="gap-2 cursor-pointer"
        >
          <File className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
