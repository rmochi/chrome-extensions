import { BlockedDomainList } from './blockDomainList.class'

const domainRegex = new RegExp('^https?://([^/:]+)[/:]?')

const createDeleteButton = () => {
  const deleteButton = document.createElement('button')
  deleteButton.innerText = '-'
  deleteButton.title = 'このサイトを検索結果に表示しない'
  deleteButton.setAttribute(
    'style',
    Object.entries({
      position: 'absolute',
      top: 0,
      left: '-40px',
      border: '2px solid #ddd',
      'border-radius': '50%',
      cursor: 'pointer',
      width: '20px',
      height: '20px',
      padding: 0
    })
      .map(([key, value]) => `${key}:${value}`)
      .join(';')
  )
  return deleteButton
}

const getLinkDomain = (wrapperElement: Element) =>
  wrapperElement
    .querySelector<HTMLAnchorElement>('a[data-ved]')
    ?.href.match(domainRegex)?.[1]

export const contentScript = async () => {
  const contentBody = document.querySelector('[role="main"]')
  if (!contentBody) {
    return
  }

  const blockedDomainList = await BlockedDomainList.init()

  const deleteBlockedDomainResult = () => {
    const groups = contentBody.querySelectorAll('.g')
    Array.from(groups).forEach((groupElem) => {
      const domain = getLinkDomain(groupElem)
      if (!domain) {
        return
      }

      if (blockedDomainList.has(domain)) {
        groupElem.parentElement?.removeChild(groupElem)
        return
      }
    })
  }

  deleteBlockedDomainResult()

  const groups = contentBody.querySelectorAll('.g')
  Array.from(groups).forEach((groupElem) => {
    const domain = getLinkDomain(groupElem)
    if (!domain) {
      return
    }

    const deleteButton = createDeleteButton()
    deleteButton.addEventListener('click', (e) => {
      if (
        window.confirm(
          'このサイトを検索結果に表示しないようにします。\nよろしいですか？'
        )
      ) {
        blockedDomainList.add(domain)
        deleteBlockedDomainResult()
      }
    })

    groupElem.setAttribute('style', 'position: relative')
    groupElem.appendChild(deleteButton)
  })
}
