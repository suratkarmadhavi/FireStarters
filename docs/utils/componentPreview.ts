/* eslint-disable no-param-reassign */
import MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token'
import { resolve, dirname } from 'path'
import { readFileSync } from 'fs'
import {
  composeComponentName,
  injectComponentImportScript,
  isCheckingRelativePath,
  transformHighlightCode
} from './utils'

const titleRegex = /title="(.*?)"/
const pathRegex = /path="(.*?)"/
const descriptionRegex = /description="(.*?)"/
const editUrlRegex = /editUrl="(.*?)"/

export interface DefaultProps {
  path: string
  title: string
  description: string
  editUrl: string
}

/**
 * @param md
 * @param token
 * @param env
 * @returns
 */
export const transformPreview = (md: MarkdownIt, token: Token, env: any) => {
  const componentProps: DefaultProps = {
    path: '',
    title: 'FS',
    description: 'FS',
    editUrl: ''
  }

  const titleValue = token.content.match(titleRegex)
  const pathRegexValue = token.content.match(pathRegex)
  const descriptionRegexValue = token.content.match(descriptionRegex)
  const editUrlRegexValue = token.content.match(editUrlRegex)
  

  if (!pathRegexValue) throw new Error('@vitepress-demo-preview/plugin: path is a required parameter')
  // eslint-disable-next-line prefer-destructuring
  componentProps.path = isCheckingRelativePath(pathRegexValue[1])
  componentProps.title = titleValue ? titleValue[1] : ''
  componentProps.description = descriptionRegexValue ? descriptionRegexValue[1] : ''
  componentProps.editUrl = editUrlRegexValue ? editUrlRegexValue[1] : ''

  const componentPath = resolve(dirname(env.path), componentProps.path || '.')

  const componentName = composeComponentName(componentProps.path)
  const suffixName = componentPath.substring(componentPath.lastIndexOf('.') + 1)

  injectComponentImportScript(env, componentProps.path, componentName)

  const componentSourceCode = readFileSync(componentPath, {
    encoding: 'utf-8'
  })
  const compileHighlightCode = transformHighlightCode(md, componentSourceCode, suffixName)

  const code = encodeURI(componentSourceCode)
  const showCode = encodeURIComponent(compileHighlightCode)

  const sourceCode = `<demo-preview title="${componentProps.title}" description="${componentProps.description}" editUrl="${componentProps.editUrl}" code="${code}" showCode="${showCode}" suffixName="${suffixName}" absolutePath="${componentPath}" relativePath="${componentProps.path}">
    <${componentName}></${componentName}>
  </demo-preview>`

  return sourceCode
}
