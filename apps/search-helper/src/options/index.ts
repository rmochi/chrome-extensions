import { options } from '@chrome-extensions/search-result-filter'

const wrapper = document.getElementById('search-result-filter')
;(async () => {
  if (!wrapper) {
    return
  }

  const listElem = document.createElement('ul')

  const items = await options.getFilterList()
  items.forEach((item) => {
    const itemElem = document.createElement('li')
    itemElem.innerHTML = item
    itemElem.setAttribute('class', 'searchFilterItem')
    itemElem.setAttribute('data-domain', item)

    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = '-'
    deleteButton.setAttribute('class', 'deleteButton')
    deleteButton.addEventListener('click', (e) => {
      options.deleteFilterDomain(item)
      wrapper.querySelector(`[data-domain="${item}"]`)?.remove()
    })

    itemElem.appendChild(deleteButton)

    listElem.appendChild(itemElem)
  })
  wrapper.appendChild(listElem)

  const clearButton = document.createElement('button')
  clearButton.innerHTML = 'フィルターを全て削除する'
  clearButton.setAttribute('class', 'searchFilterClearButton')
  clearButton.addEventListener('click', () => {
    if (!window.confirm('削除してもよろしいですか？')) {
      return
    }
    options.clearFilterList()
    listElem.remove()
  })
  wrapper.appendChild(clearButton)
})()
