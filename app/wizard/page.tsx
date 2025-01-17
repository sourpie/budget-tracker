import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container max-w-2xl flex-col gap-4 flex h-screen w-full items-center justify-center">
      <div>
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-2 font-bold">{user.firstName}👋 </span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let &apos;s get started by setting up your currency
        </h2>

        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>

          <Separator />
          <Card className="w-full">
              <CardHeader>
                  <CardTitle>Currency</CardTitle>
                  <CardDescription>Set you default Currency</CardDescription>
              </CardHeader>
              <CardContent>
                  <CurrencyComboBox/>
              </CardContent>
          </Card>

          <Separator />

          <Button className="w-full" asChild>
              <Link href={"/"}>
                I&apos;m done! Take me to the dashboard
              </Link>
          </Button>
          <div className="mt-8">
              <Logo/>
          </div>
    </div>
  );
}

export default page;
