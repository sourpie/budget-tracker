"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DAYS_RANGE } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";

function TransactionsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="border-b bg-card w-full">
        <div className="w-full flex flex-wrap items-center justify-between px-6 gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Transactions</p>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;

              if (differenceInDays(to, from) > MAX_DAYS_RANGE) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DAYS_RANGE} days!`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="container">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}

export default TransactionsPage;
