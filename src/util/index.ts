function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const uid4digit = () => uuidv4().slice(32)
const uid8digit = () => uuidv4().slice(28)

export { uid4digit, uid8digit, uuidv4 }

export class PasswordValidator {
  private password: string | null = null

  public setPassword(password: string) {
    this.password = password
  }

  public validatePassword(claimedPassword: string) {
    return this.password === claimedPassword
  }
}

export class SeriesSolver {
  private solutions: { [key: string]: string } = {
    '1+2+3+...': '-1/12',
    '1/0!+1/1!+1/2!+...': 'e',
    '1+1/2+1/4+...': '2',
  }

  public solve(terms: string[], operator: string) {
    const series = terms.join(operator)
    return this.solutions[series]
  }

  public add(terms: string[], operator: string, solution: string) {
    const series = terms.join(operator)
    this.solutions[series] = solution
  }
}

const itemPrices: { [itemName: string]: number } = {
  'Autographed Neil deGrasse Tyson book': 100,
  'Rick Astley t-shirt': 22,
  'An idea to replace EVERYTHING with blockchains': 0,
}

export class OnlineSales {
  private listedItems: string[] = []

  public listItem(name: string) {
    this.listedItems.push(name)
  }

  public sellItem(name: string) {
    const itemIndex = this.listedItems.indexOf(name)

    if (itemIndex !== -1) {
      this.listedItems.splice(itemIndex, 1)

      return itemPrices[name]
    } else {
      return null
    }
  }
}
