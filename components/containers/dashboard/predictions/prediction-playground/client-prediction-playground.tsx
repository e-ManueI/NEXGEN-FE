"use client";

import { UserType } from "@/app/_db/enum";
import BasePredictionPlayground from "./base-playground";

export default function ClientPredictionPlayground() {
  return (
    <BasePredictionPlayground defaultRole={UserType.CLIENT} refreshOnSuccess />
  );
}
