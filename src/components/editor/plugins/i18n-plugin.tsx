import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react"

import { locales } from "@/components/editor/locales"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type Language = "en" | "ar" | "he"

export type Direction = "ltr" | "rtl"

export type LocalizedText = Partial<Record<Language, string>>

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic (العربية)" },
  { value: "he", label: "Hebrew (עברית)" },
] as const

const LANGUAGE_DIRECTION: Record<Language, Direction> = {
  en: "ltr",
  ar: "rtl",
  he: "rtl",
}

type LanguageContextType = {
  language: Language
  setLanguage: Dispatch<SetStateAction<Language>>
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: {
  children: ReactNode
  defaultLanguage?: Language
}) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  const [localLanguage, setLocalLanguage] = useState<Language>("en")

  const language = context?.language ?? localLanguage
  const setLanguage = context?.setLanguage ?? setLocalLanguage

  return { language, setLanguage, dir: LANGUAGE_DIRECTION[language] }
}

export function useTranslation() {
  const { language, setLanguage, dir } = useLanguage()
  return { language, setLanguage, dir, t: locales[language] }
}

export interface LanguageSelectorProps {
  value: Language
  onValueChange: (value: Language) => void
}

export function LanguageSelector({
  value,
  onValueChange,
  className,
  languages = ["en", "ar", "he"],
}: LanguageSelectorProps & {
  className?: string
  languages?: Language[]
}) {
  return (
    <Select
      items={languageOptions}
      value={value}
      onValueChange={(value) => onValueChange(value as Language)}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          "w-36 border-transparent bg-transparent hover:bg-muted hover:text-foreground dark:bg-transparent dark:hover:bg-muted/50",
          className
        )}
        dir="ltr"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        dir="ltr"
        className="data-open:animate-none data-closed:animate-none"
      >
        <SelectGroup>
          {languageOptions
            .filter((option) => languages.includes(option.value as Language))
            .map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function LanguageSelectorPlugin({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()

  return (
    <LanguageSelector
      value={language}
      onValueChange={setLanguage}
      className={cn("h-6 w-auto gap-1 px-1.5 text-xs", className)}
    />
  )
}
