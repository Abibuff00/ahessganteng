import { useState, useCallback } from "react";

export interface Account {
  id: string;
  email: string;
  token: string;
  status: "Idle" | "Running" | "Done" | "Error";
  fingerprint?: string;
  clientCode?: string;
}

export interface LogEntry {
  id: number;
  time: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

export interface JackpotEntry {
  id: number;
  email: string;
  prize: string;
  time: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addFromText = useCallback((text: string) => {
    const lines = text.trim().split("\n").filter(Boolean);
    const newAccounts: Account[] = lines.map((line, i) => {
      const parts = line.split("|");
      return {
        id: `${Date.now()}-${i}`,
        email: parts[0]?.trim() || "",
        token: parts[1]?.trim() || "",
        status: "Idle",
      };
    });
    setAccounts((prev) => [...prev, ...newAccounts]);
    return newAccounts.length;
  }, []);

  const remove = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setAccounts([]), []);

  const setStatus = useCallback((id: string, status: Account["status"]) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }, []);

  const setAllStatus = useCallback((status: Account["status"]) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, status })));
  }, []);

  return { accounts, setAccounts, addFromText, remove, clearAll, setStatus, setAllStatus };
}

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString("id-ID"), message, type },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, addLog, clearLogs };
}

export function useJackpots() {
  const [jackpots, setJackpots] = useState<JackpotEntry[]>([]);

  const addJackpot = useCallback((email: string, prize: string) => {
    setJackpots((prev) => [
      ...prev,
      { id: Date.now(), email, prize, time: new Date().toLocaleTimeString("id-ID") },
    ]);
  }, []);

  return { jackpots, addJackpot };
}
