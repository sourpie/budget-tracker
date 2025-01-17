"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/lib/currencies";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  const { data, isFetched, isLoading, isError } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const response = await fetch("/api/user-settings");
      // if (!response.ok) throw new Error("Failed to fetch user settings");
      return response.json();
    },
  });

  React.useEffect(() => {
    if (!data) return;

    const userCurrency = Currencies.find(
      (c) => c.value === data.currency
    );

    if (userCurrency) setSelectedOption(userCurrency);
  }, [data, isError]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,

    onSuccess: (data: UserSettings) => {
      toast.success("Currency updated", {
        id: "update-currency",
      });

      setSelectedOption(
        Currencies.find((c) => c.value ===  data.currency) || null);
    },

    onError: (error) => {
      console.error("Failed to update currency", error);
      toast.error("Failed to update currency", {
        id: "update-currency",
      });
    },

    
})

  const selectOption = React.useCallback((currency : Currency | null) => {
    if(!currency) {
      toast.error("Please select a currency");
      return;
    }

    toast.loading("Updating currency...", {
      id: "update-currency",
    });

    mutation.mutate(currency.value);

  },[mutation])

  const comboBoxContent = (
    <SkeletonWrapper isLoading={!isFetched || isLoading}>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOption ? selectedOption.label : "+ Set Currency"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList
              setOpen={setOpen}
              setSelectedOption={selectOption}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOption ? selectedOption.label : "+ Set Currency"}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <OptionList
                setOpen={setOpen}
                setSelectedOption={selectOption}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </SkeletonWrapper>
  );

  return comboBoxContent;
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                const selectedCurrency = Currencies.find(
                  (c) => c.value === value
                );
                setSelectedOption(selectedCurrency || null);
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
