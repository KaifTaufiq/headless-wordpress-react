import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { z } from "zod";
import { RedirectIfAuthenticated } from "../AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { reqResetAPI, setPasswordAPI } from "../api/AuthAPI";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const emailParam = searchParams.get("email");
  if (emailParam && code) {
    const setPassScheme = z
      .object({
        Pass: z.string().min(1, "Password is required"),
        ConfirmPass: z.string().min(1, "Confirm Password is required"),
      })
      .refine((data) => data.Pass === data.ConfirmPass, {
        message: "Passwords do not match",
        path: ["ConfirmPass"],
      });
    const mutationSet = useMutation({
      mutationFn: setPasswordAPI,
      onSuccess: (response) => {},
    });
    const onSumbitSet = (data) => {
      const { Pass } = data;
      mutationSet.mutate({ emailParam, code, Pass });
    };
    const SetForm = useForm({
      resolver: zodResolver(setPassScheme),
      defaultValues: {
        Pass: "",
        ConfirmPass: "",
      },
    });
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();
    useEffect(() => {
      if (mutationSet.isSuccess) {
        const timer = setTimeout(() => {
          navigate("/login");
        }, countdown * 1000);

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
          clearTimeout(timer);
          clearInterval(countdownInterval);
        };
      }
    }, [mutationSet.isSuccess, countdown, navigate]);
    return (
      <RedirectIfAuthenticated redirectTo="/dashboard">
        <div className="h-screen flex items-center">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Change Password</CardTitle>
              <CardDescription>
                Enter your new password to reset your password
                {mutationSet.isError && (
                  <span className="text-red-500">
                    <br />
                    {mutationSet.error.response?.data?.data?.message}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...SetForm}>
                <form onSubmit={SetForm.handleSubmit(onSumbitSet)}>
                  <div className="grid gap-4">
                    <FormField
                      control={SetForm.control}
                      name="Pass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={SetForm.control}
                      name="ConfirmPass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {mutationSet.isSuccess && (
                      <CardDescription>
                        <span className="text-green-600">
                          User Password has been changed. Redirecting to Login
                          Page in {countdown}s
                        </span>
                      </CardDescription>
                    )}
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={mutationSet.isPending}
                    >
                      {mutationSet.isPending && (
                        <LoaderCircle className="animate-spin" />
                      )}
                      {mutationSet.isPending ? "Loading" : "Set Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </RedirectIfAuthenticated>
    );
  }
  const resetPasswordScheme = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
  });
  const Reqform = useForm({
    resolver: zodResolver(resetPasswordScheme),
    defaultValues: {
      email: "",
    },
  });
  const mutationReq = useMutation({
    mutationFn: reqResetAPI,
    onSuccess: (response) => {},
  });
  const onSumbitReq = (data) => {
    const { email } = data;
    mutationReq.mutate({ email });
  };
  return (
    <RedirectIfAuthenticated redirectTo="/dashboard">
      <div className="h-screen flex items-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your email below to Reset your password
              {mutationReq.isError && (
                <span className="text-red-500">
                  <br />
                  {mutationReq.error.response?.data?.data?.message ==
                  "Wrong user."
                    ? "User not found"
                    : mutationReq.error.response?.data?.data?.message}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...Reqform}>
              <form onSubmit={Reqform.handleSubmit(onSumbitReq)}>
                <div className="grid gap-4">
                  <FormField
                    control={Reqform.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="m@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {mutationReq.isSuccess && (
                    <CardDescription>
                      <span className="text-green-600">
                        Check your email for password reset link
                      </span>
                    </CardDescription>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutationReq.isPending}
                  >
                    {mutationReq.isPending && (
                      <LoaderCircle className="animate-spin" />
                    )}
                    {mutationReq.isPending ? "Loading" : "Reset"}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              <Link to="/login" className="underline">
                Login in
              </Link>{" "}
              |{" "}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </RedirectIfAuthenticated>
  );
};

export default ResetPassword;
