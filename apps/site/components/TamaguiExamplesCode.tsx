import { createContext, useContext } from 'react'
import { Spacer, YStack } from 'tamagui'

import { getCompilationExamples } from '../lib/getCompilationExamples'
import { HeroContainer } from './HeroContainer'
import { HeroExampleCode } from './HeroExampleCode'

export const TamaguiExamples = createContext<ReturnType<typeof getCompilationExamples> | null>(null)

export function TamaguiExamplesCode() {
  try {
    const examples = useContext(TamaguiExamples)
    return (
      <HeroContainer noPad>
        <Spacer />
        <HeroExampleCode onlyDemo examples={examples?.compilationExamples} />
        <Spacer />
      </HeroContainer>
    )
  } catch {
    return null
  }
}
