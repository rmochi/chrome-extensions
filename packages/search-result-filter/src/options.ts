import { BlockedDomainList } from './blockDomainList.class'

const getBlockedDomainList = (() => {
  let blockedDomainList: BlockedDomainList

  return async () => {
    if (!blockedDomainList) {
      blockedDomainList = await BlockedDomainList.init()
    }
    return blockedDomainList
  }
})()

export const getFilterList = async () => (await getBlockedDomainList()).get()
export const clearFilterList = async () =>
  (await getBlockedDomainList()).clear()

export const deleteFilterDomain = async (targetDomain: string) => {
  const blockedDomainList = await getBlockedDomainList()
  if (blockedDomainList.has(targetDomain)) {
    blockedDomainList.delete(targetDomain)
  }
}
