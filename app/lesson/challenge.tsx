import { challengeOptions, challenges, matchingPairs } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Card } from "./card";

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
  question: string;
  matchingPairs?: (typeof matchingPairs.$inferSelect)[];
  selectedPairs?: { batakId: number; indonesiaId: number }[];
  onPairSelect?: (batakId: number, indonesiaId: number) => void;
  arrangedOrder?: number[];
  onArrange?: (optionId: number, position: number) => void;
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
  question,
  matchingPairs,
  selectedPairs,
  onPairSelect,
  arrangedOrder,
  onArrange,
}: ChallengeProps) => {
  // VOCAB_INTRO: Introduction to new vocabulary
  if (type === "VOCAB_INTRO") {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-700 mb-4">
            📚 Kata Baru
          </h2>
          <p className="text-lg text-neutral-600 mb-6">{question}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
          {options.map((option) => (
            <div key={option.id} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {option.text}
              </div>
              <div className="text-sm text-neutral-500">
                Aksara Batak
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // SELECT: Multiple choice questions
  if (type === "SELECT") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
          {options.map((option, i) => (
            <Card
              key={option.id}
              id={option.id}
              text={option.text}
              imageSrc={option.imageSrc}
              shortcut={`${i + 1}`}
              selected={selectedOption === option.id}
              onClick={() => onSelect(option.id)}
              status={status}
              audioSrc={option.audioSrc}
              disabled={disabled}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }

  // ASSIST: Assisted word construction
  if (type === "ASSIST") {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-lg text-neutral-600">
            Pilih karakter yang benar untuk membentuk kata:
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {options.map((option, i) => (
            <Card
              key={option.id}
              id={option.id}
              text={option.text}
              imageSrc={option.imageSrc}
              shortcut={`${i + 1}`}
              selected={selectedOption === option.id}
              onClick={() => onSelect(option.id)}
              status={status}
              audioSrc={option.audioSrc}
              disabled={disabled}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }

  // FILL_BLANK: Fill in the blanks
  if (type === "FILL_BLANK") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
            <p className="text-lg text-neutral-700 font-medium">
              {question}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {options.map((option, i) => (
            <Card
              key={option.id}
              id={option.id}
              text={option.text}
              imageSrc={option.imageSrc}
              shortcut={`${i + 1}`}
              selected={selectedOption === option.id}
              onClick={() => onSelect(option.id)}
              status={status}
              audioSrc={option.audioSrc}
              disabled={disabled}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }

  // MATCHING: Match pairs
  if (type === "MATCHING") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-lg text-neutral-600">{question}</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Batak Column */}
          <div className="space-y-3">
            <h3 className="text-center font-semibold text-neutral-700">
              Aksara Batak
            </h3>
            {matchingPairs?.map((pair, i) => (
              <div
                key={`batak-${pair.id}`}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-blue-50",
                  selectedPairs?.some(p => p.batakId === pair.id)
                    ? "border-blue-500 bg-blue-100"
                    : "border-neutral-200 bg-white"
                )}
                onClick={() => onPairSelect && onPairSelect(pair.id, 0)}
              >
                <div className="text-center text-2xl font-bold text-blue-600">
                  {pair.batak}
                </div>
                <div className="text-center text-xs text-neutral-500 mt-1">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Indonesian Column */}
          <div className="space-y-3">
            <h3 className="text-center font-semibold text-neutral-700">
              Bahasa Indonesia
            </h3>
            {matchingPairs?.map((pair, i) => (
              <div
                key={`indonesia-${pair.id}`}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-green-50",
                  selectedPairs?.some(p => p.indonesiaId === pair.id)
                    ? "border-green-500 bg-green-100"
                    : "border-neutral-200 bg-white"
                )}
                onClick={() => onPairSelect && onPairSelect(0, pair.id)}
              >
                <div className="text-center text-lg font-medium text-green-600">
                  {pair.indonesia}
                </div>
                <div className="text-center text-xs text-neutral-500 mt-1">
                  {String.fromCharCode(65 + i)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ARRANGE: Arrange words in correct order
  if (type === "ARRANGE") {
    const arrangedOptions = arrangedOrder
      ? arrangedOrder.map(id => options.find(opt => opt.id === id)).filter(Boolean)
      : [];

    const remainingOptions = options.filter(
      opt => !arrangedOrder?.includes(opt.id)
    );

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-lg text-neutral-600">{question}</p>
        </div>

        {/* Arranged sentence area */}
        <div className="bg-neutral-50 rounded-lg p-6 border-2 border-dashed border-neutral-300 min-h-[100px]">
          <h3 className="text-center font-semibold text-neutral-700 mb-4">
            Susunan Kalimat:
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {arrangedOptions.map((option) => (
              <div
                key={`arranged-${option?.id}`}
                className="bg-blue-100 border-2 border-blue-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-200"
                onClick={() => onArrange && option && onArrange(option.id, -1)}
              >
                <span className="text-blue-700 font-medium">{option?.text}</span>
              </div>
            ))}
            {arrangedOptions.length === 0 && (
              <p className="text-neutral-500 italic">
                Seret kata-kata ke sini untuk menyusun kalimat
              </p>
            )}
          </div>
        </div>

        {/* Available words */}
        <div className="space-y-3">
          <h3 className="text-center font-semibold text-neutral-700">
            Kata-kata yang tersedia:
          </h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {remainingOptions.map((option, i) => (
              <Card
                key={option.id}
                id={option.id}
                text={option.text}
                imageSrc={option.imageSrc}
                shortcut={`${i + 1}`}
                selected={false}
                onClick={() => onArrange && onArrange(option.id, arrangedOptions.length)}
                status="none"
                audioSrc={option.audioSrc}
                disabled={disabled}
                type={type}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="grid gap-2">
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};
