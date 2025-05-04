"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CompanyInfo() {
  return (
    <div className="">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" placeholder="ABC company limited" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company-location">Company Location</Label>
          <Select>
            <SelectTrigger id="company-location" className="w-full">
              <SelectValue placeholder="New York" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="london">London</SelectItem>
              <SelectItem value="tokyo">Tokyo</SelectItem>
              <SelectItem value="sydney">Sydney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="registration-status">Registration Status</Label>
          <Select>
            <SelectTrigger id="registration-status" className="w-full">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="license-number">Business Licence Number</Label>
          <Input id="license-number" placeholder="123-456-789" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="annual-revenue">Estimated Annual Revenue</Label>
          <Select>
            <SelectTrigger id="annual-revenue" className="w-full">
              <SelectValue placeholder="$1M - $100M" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Less than $1m">Less than $1M</SelectItem>
              <SelectItem value="1m-100m">$1M - $100M</SelectItem>
              <SelectItem value="100m-500m">$100M - $500M</SelectItem>
              <SelectItem value="500m-1b">$500M - $1B</SelectItem>
              <SelectItem value="1b+">$1B+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
