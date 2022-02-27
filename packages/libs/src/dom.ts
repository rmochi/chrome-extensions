export const setAttributes = <K extends HTMLElement>(
  element: K,
  attributes: Record<string, string>
) => {
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value)
  )
  return element
}

type TagName = keyof HTMLElementTagNameMap

export const createElement = <K extends TagName>(
  tagName: K,
  attributes?: Record<string, string>
) => {
  const element = document.createElement(tagName)
  return attributes ? setAttributes(element, attributes) : element
}
