"use client";
import { KeyBuilder } from "@/components/key-builder";
import { useCallback, useState } from "react";

export default function Home() {
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const saveKey = useCallback((key: string[]) => {
    setSavedKeys((previousKeys) => [...previousKeys, key.join("")]);
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <KeyBuilder saveKey={saveKey} />
      <ul>
        {savedKeys.map((v) => (
          <li>{v}</li>
        ))}
      </ul>
    </main>
  );
}
