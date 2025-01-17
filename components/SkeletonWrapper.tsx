import React, { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

function SkeletonWrapper({
  children,
  isLoading,
  fullWidth = true,
}: {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}) {
  if (!isLoading) return children;
  else {
    return (
      <Skeleton className={cn(fullWidth && "w-full")}>
        <div className="opcaticy-0">{children}</div>
      </Skeleton>
    );
  }
}

export default SkeletonWrapper;
