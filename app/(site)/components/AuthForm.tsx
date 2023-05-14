"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { BsGithub, BsGoogle } from "react-icons/bs";
import React, { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import { toast } from "react-hot-toast";

type variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession()
  const [variant, setVariant] = useState<variant>("LOGIN");
  const [loading, setLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  console.log(session);
  

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((res: any) => {
          console.log(res);

          if (res?.error) {
            toast.error(res?.error);
            setLoading(false);
          }
          if (res?.ok && !res?.error) {
            toast.success("Logged In!");
          }
        })
        .finally(() => setLoading(false));
    }
    if (variant === "REGISTER") {
      if (data.name === "" || data.email === "" || data.password === "") {
        toast.error("Please enter all the fields");
        setLoading(false);
      } else {
        axios
          .post("/api/register", data)
          .catch(() => toast.error("Something went Wrong!"))
          .finally(() => setLoading(false));
      }
    }
  };

  const socialAction = (action: string) => {
    setLoading(true);
    signIn(action, {
      redirect: false,
    }).then((res: any) => {
      if (res?.error) {
        toast.error("Invalid Credentials!");
      }

      if (res?.ok && !res?.error) {
        toast.success("Logged In!");
      }
    }).finally(() => setLoading(false))
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              label="Name"
              register={register}
              id="name"
              errors={errors}
            ></Input>
          )}
          <Input label="Email" register={register} id="email" errors={errors} />
          <Input
            label="Password"
            type="password"
            register={register}
            id="password"
            errors={errors}
          />
          <Button disabled={loading} fullWidth type="submit">
            {variant === "LOGIN" ? "Sign In" : "Register"}
          </Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
