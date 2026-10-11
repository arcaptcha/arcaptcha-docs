import React from "react";
import { Redirect } from "react-router-dom";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Login() {
  const targetUrl = useBaseUrl("/quick start");
  return <Redirect to={targetUrl} />;
}
