"use client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import data from "@/app/data.json"; // with { type: 'json' };
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const SelectComponent = () => {
  const { currentKeys, submitKey} = useContext(KeyContext);
  if (currentKeys.length === 0) return null;

  return (
    <Select onValueChange={submitKey}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="select next key" />
      </SelectTrigger>
      <SelectContent>
        {currentKeys.map((key) => (
          <SelectItem key={key} value={key}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const KeyContext = createContext({
  keys: [] as string[],
  currentKeys: [] as string[],
  submitKey: (_key: string) => {},
  resetTo: (_index: number) => {},
});

function KeyProvider({ children }: PropsWithChildren) {
  const [keys, setKeys] = useState<string[]>([]);
  const submitKey = useCallback(
    (key: string) => setKeys((prevKeys) => [...prevKeys, key]),
    []
  );
  const resetTo = useCallback(
    (index: number) => setKeys((prevKeys) => [...prevKeys.slice(0, index)]),
    []
  );

  const currentKeys = useMemo(() => {
    const currentObj = keys.reduce<Record<string, any>>(
      (d, key) => d[key],
      data
    );
    return Object.keys(currentObj);
  }, [keys]);

  const ctx = useMemo(
    () => ({ keys, resetTo, currentKeys, submitKey }),
    [keys]
  );

  return <KeyContext.Provider value={ctx}>{children}</KeyContext.Provider>;
}

const SelectedValues = () => {
  const { resetTo, keys } = useContext(KeyContext);
  return (
    <>
      {keys.map((value, index) => (
        <div className="relative group">
          <Input disabled value={value} />
          <button
            onClick={() => resetTo(index)}
            className="absolute inset-y-0 right-0 px-4 py-2 text-white bg-gradient-to-r from-transparent via-red-500 to-red-500 opacity-0 group-hover:opacity-100"
          >
            Reset
          </button>
        </div>
      ))}
    </>
  );
};

const SaveButton = ({ saveKey }: { saveKey: (v: string[]) => void}) => {
  const {keys, currentKeys, resetTo} = useContext(KeyContext);
  const saveAndClear = () => {
    if (currentKeys.length) keys.push('*');
    saveKey(keys);
    resetTo(0)
  }

  return <Button disabled={keys.length === 0} onClick={saveAndClear}>Save key</Button>;
}

export function KeyBuilder({ saveKey }: { saveKey: (v: string[]) => void }) {
  return (
    <KeyProvider>
      <div className="flex gap-2">
        <SelectedValues />
        <SelectComponent />
        <SaveButton saveKey={saveKey} />
      </div>
    </KeyProvider>
  );
}
