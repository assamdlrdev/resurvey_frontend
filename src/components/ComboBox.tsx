
import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

// interface Item {
//   id: number;
//   name: string;
// }

interface Props {
  bhunakshaPartDags: any[];
  partDag: string;
  setPartDag: (name: string) => void;
  setFinalPartDag: (name: string) => void
}

const ComboboxFreeInput: React.FC<Props> = ({
  bhunakshaPartDags,
  partDag,
  setPartDag,
  setFinalPartDag
}) => {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? bhunakshaPartDags
      : bhunakshaPartDags.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox
      value={partDag}
      onChange={(val: string) => setPartDag(val)}
    >
      <div className="relative">
        <ComboboxInput
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          displayValue={(val: string) => val}
          onChange={(event) => {
            const val = event.target.value;
            setQuery(val);
            setPartDag(val); // Allows free typing
          }}
          onBlur={() => {
            setFinalPartDag(partDag);
          }}
          placeholder="Type or select..."
        />

        {filteredItems.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredItems.map((item, index) => (
              <ComboboxOption
                key={index}
                value={item.name}
                className={({ active }) =>
                  `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                    active ? "bg-blue-500 text-white" : "text-gray-900"
                  }`
                }
              >
                {item.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};

export default ComboboxFreeInput;
