import React from "react";
import { Button, Card, Input, Stack, Typography } from "@/components/ui";
function GeneratedComponent() {
  return (
    <Card
      className="max-w-md mx-auto mt-20 shadow-none border-none bg-transparent p-6"
    >
      <Typography
        variant="h1"
        text="Tekton Studio"
        className="text-center mb-2 font-serif text-4xl"
      />
      <Typography
        variant="body1"
        text="Sign in to access your editorial workspace"
        className="text-center text-muted-foreground mb-8"
      />
      <Stack className="flex flex-col gap-4">
        <Input label="Email Address" placeholder="name@magazine.com" />
        <Input
          label="Password"
          type="password"
          placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
        />
        <Button
          variant="default"
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest py-3 mt-4"
        >
          Sign In
        </Button>
      </Stack>
      <Typography
        variant="body2"
        text="Forgot your password? Reset it here."
        className="text-center mt-6 text-sm"
      />
    </Card>
  );
}
export default GeneratedComponent;
