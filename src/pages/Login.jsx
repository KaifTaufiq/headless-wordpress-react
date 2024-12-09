import { useNavigate, Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useAuth, RedirectIfAuthenticated } from "../AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../api/AuthAPI";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginScheme = z.object({
  login: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password must be at least 1 character long"),
});
const Login = () => {
  const form = useForm({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      login: "",
      password: "",
    },
  });
  const { setUserFromToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: (response) => {
      const token = response.data.data.jwt;
      localStorage.setItem("token", token);
      setUserFromToken(token);
      navigate("/dashboard");
    },
  });

  const onSubmit = (data) => {
    const { login, password } = data;
    mutation.mutate({ login, password });
  };
  return (
    <RedirectIfAuthenticated redirectTo="/dashboard">
      <div className="h-screen flex items-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your details below to login to your account
              {mutation.isError && (
                <span className="text-red-500">
                  <br />
                  {mutation.error.response?.data?.data?.message}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username or Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/reset-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>

                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending && (
                      <LoaderCircle className="animate-spin" />
                    )}
                    {mutation.isPending ? "Loading" : "Login"}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don't have an Account{" "}
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

export default Login;
