import { createContext, useContext } from "react";
import type { PublicProfileResponse } from "../services/api";

interface PublicProfileContextValue extends PublicProfileResponse {
  username: string;
}

export const PublicProfileContext =
  createContext<PublicProfileContextValue | null>(null);

export function usePub() {
  const ctx = useContext(PublicProfileContext);
  if (!ctx) throw new Error("usePub must be used within PublicLayout");
  return ctx;
}
