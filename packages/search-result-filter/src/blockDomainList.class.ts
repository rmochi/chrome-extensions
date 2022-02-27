export class BlockedDomainList {
  private storageKey = 'blockedDomainList'
  private items: string[]

  constructor() {
    this.items = []
  }

  public static async init() {
    const blockedDomainList = new BlockedDomainList()
    blockedDomainList.items = await blockedDomainList.getFromStorage()

    return blockedDomainList
  }

  get() {
    return this.items
  }

  has(targetDomain: string) {
    return this.items.includes(targetDomain)
  }

  async add(targetDomain: string) {
    this.items.push(targetDomain)
    this.items.sort()

    this.saveToStorage()
  }

  async delete(targetDomain: string) {
    this.items = this.items.filter((item) => item !== targetDomain)
    this.saveToStorage()
  }

  async clear() {
    this.items = []
    this.storageKey && chrome.storage.sync.remove(this.storageKey)
  }

  private async getFromStorage(): Promise<string[]> {
    return (
      (await chrome.storage.sync.get(this.storageKey))[this.storageKey] ?? []
    )
  }

  private async saveToStorage() {
    chrome.storage.sync.set({ [this.storageKey]: this.items })
  }
}
