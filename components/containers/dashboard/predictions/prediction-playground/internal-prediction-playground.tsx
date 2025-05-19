"use client";

import { UserType } from "@/app/_db/enum";
import BasePredictionPlayground from "./base-playground";

export default function InternalPredictionPlayground() {
  return (
    <BasePredictionPlayground defaultRole={UserType.ADMIN} refreshOnSuccess />
  );
}
