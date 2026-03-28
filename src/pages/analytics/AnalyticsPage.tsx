import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAnalytics } from "@/operations/analytics";
import { AnalyticsReportContent } from "@/pages/analytics/AnalyticsReportContent";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("this-year");
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#F7F7F7] p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger
              size="sm"
              className="!w-[140px] !h-9 !bg-white !border !border-gray-300 !text-gray-600 hover:!bg-gray-50 !rounded-lg !px-3 !text-sm !shadow-none data-[size=sm]:!h-9 data-[size=default]:!h-9"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            asChild
            className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-normal text-gray-600 shadow-none hover:bg-gray-50"
          >
            <Link to="/create-custom-report">
              <Plus className="mr-2 h-4 w-4 text-gray-600" />
              Create Custom Report
            </Link>
          </Button>
          <Button
            type="button"
            onClick={() => setExportOpen(true)}
            className="h-9 rounded-lg border-0 bg-[#6B7C3F] px-4 text-sm font-normal text-white shadow-none hover:bg-[#5a6a35]"
          >
            <Download className="mr-2 h-4 w-4 text-white" />
            Export
          </Button>
        </div>
      </div>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent
          showCloseButton
          className="max-w-sm rounded-2xl border-0 bg-[#D4E4C4] p-8 shadow-lg"
        >
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-lg font-bold text-gray-800">
              Export Report as
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4">
            <Button
              type="button"
              className="h-12 w-full rounded-xl border-0 bg-[#6B7C3F] text-base font-medium text-white shadow-none hover:bg-[#5a6a35]"
              onClick={() => {
                setExportOpen(false);
                navigate({ to: "/analytics/pdf-preview" });
              }}
            >
              PDF
            </Button>
            <Button
              type="button"
              className="h-12 w-full rounded-xl border-0 bg-[#6B7C3F] text-base font-medium text-white shadow-none hover:bg-[#5a6a35]"
              onClick={() => setExportOpen(false)}
            >
              Excel / CSV
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AnalyticsReportContent />
    </div>
  );
}
