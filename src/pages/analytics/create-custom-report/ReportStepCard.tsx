import type { ReactNode } from "react"
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ReportStepCardProps = {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function ReportStepCard({
  title,
  description,
  children,
  className,
}: ReportStepCardProps) {
  return (
    <Card
      className={cn(
        "border border-gray-200 bg-white shadow-sm rounded-xl",
        className
      )}
    >
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-700">
            <FileText className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
