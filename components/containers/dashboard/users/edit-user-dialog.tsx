"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  errorMessage?: string;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  error = false,
  errorMessage,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500" : ""}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 py-2"
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">
            {show ? "Hide" : "Show"} {label.toLowerCase()}
          </span>
        </Button>
      </div>
      {error && errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

interface EditUserDialogProps {
  // This is used instead of the built in children prop
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  children,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Keep match flag up to date
  useEffect(() => {
    setPasswordMatch(newPassword === retypePassword);
  }, [newPassword, retypePassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // newPassword === retypePassword guaranteed here
    // → send to API…
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit a user account by updating out the form below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname">First Name</Label>
                <Input id="fname" name="fname" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input id="lname" name="lname" required />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            {/* Passwords */}
            <PasswordField
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordField
              id="retypePassword"
              label="Retype Password"
              value={retypePassword}
              onChange={setRetypePassword}
              error={!passwordMatch}
              errorMessage="Passwords do not match"
            />

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!passwordMatch}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
