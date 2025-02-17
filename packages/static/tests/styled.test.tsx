import dedent from 'dedent'
import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Infinity
process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

// todo we can make dynamic inline loading potentially not have to actually require() anything

describe('styled() tests', () => {
  test('loads dynamic styled() in file and extracts CSS', async () => {
    const output = await extractForWeb(
      dedent`
      import { MyStack } from '@tamagui/test-design-system'
      import { styled } from '@tamagui/core'
      
      // not exported
      const InlineStyled = styled(MyStack, {
        backgroundColor: 'orange'
      })
      
      export function Test() {
        return <InlineStyled />
      }
    `
    )
    if (!output) {
      throw new Error(`No output`)
    }

    expect(output.js).toMatchInlineSnapshot(`
      "import { MyStack } from '@tamagui/test-design-system';
      import { styled } from '@tamagui/core';

      // not exported
      const InlineStyled = styled(MyStack, {
        \\"backgroundColor\\": \\"_bg-orange\\"
      });
      export function Test() {
        return <InlineStyled />;
      }"
    `)
    expect(output.styles).toMatchInlineSnapshot('"._bg-orange{background-color:orange;}"')
  })

  test('extracts to className at call-site', async () => {
    const output = await extractForWeb(`
      import { MyStack } from '@tamagui/test-design-system'
      
      export function Test() {
        return <MyStack />
      }
    `)
    if (!output) {
      throw new Error(`No output`)
    }

    expect(output.js).toMatchInlineSnapshot(`
      "const _cn = \\"  _bg-green _fd-column _miw-0px _mih-0px _pos-relative _fb-auto _dsp-flex _fs-0 _ai-stretch \\";
      import { MyStack } from '@tamagui/test-design-system';
      export function Test() {
        return <div className={_cn} />;
      }"
    `)
    expect(output.styles).toMatchInlineSnapshot(`
      "._bg-green{background-color:green;}
      ._fd-column{flex-direction:column;}
      ._miw-0px{min-width:0px;}
      ._mih-0px{min-height:0px;}
      ._pos-relative{position:relative;}
      ._fb-auto{flex-basis:auto;}
      ._dsp-flex{display:flex;}
      ._fs-0{flex-shrink:0;}
      ._ai-stretch{align-items:stretch;}"
    `)
  })
})
