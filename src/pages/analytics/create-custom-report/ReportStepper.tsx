import { Fragment } from "react"
import { cn } from "@/lib/utils"

const STEP_NUMBERS = [1, 2, 3, 4] as const

type ReportStepperProps = {
  currentStep: number
}

export function ReportStepper({ currentStep }: ReportStepperProps) {
  return (
    <div className="flex w-full max-w-3xl items-center">
      {STEP_NUMBERS.map((stepNum, index) => (
        <Fragment key={stepNum}>
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
              stepNum <= currentStep
                ? "bg-[#6B7C3F] text-white"
                : "bg-gray-200 text-gray-500"
            )}
          >
            {stepNum}
          </div>
          {index < STEP_NUMBERS.length - 1 && (
            <div
              className={cn(
                "mx-3 h-0.5 min-h-[2px] min-w-[1.5rem] flex-1 rounded-full",
                currentStep > stepNum ? "bg-[#6B7C3F]" : "bg-gray-200"
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}
