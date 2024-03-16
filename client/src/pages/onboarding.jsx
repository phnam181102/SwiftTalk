import Protected from "@/hooks/useProtected";
import React from "react";

function onboarding() {
  return <Protected>onboarding</Protected>;
}

export default onboarding;
