export interface MoneyPart {
  id: string;
  amount: number;
  label?: string;
}

export class Money {

  constructor(private moneyParts: MoneyPart[] = []) { }

  clone(): Money {
    return new Money(this.moneyParts.map(part => ({ ...part })));
  }

  modify(modifyFn: (amount: number) => number): Money {
    this.moneyParts.forEach(part => part.amount = modifyFn(part.amount));
    return this;
  }

  sum(id?: string): number {
    const parts = id ? this.moneyParts.filter(part => part.id === id) : this.moneyParts;
    return parts.reduce((acc, cur) => acc + cur.amount, 0);
  }

  merge(money: Money, coefficient: number = 1): Money {

    const index = this.moneyParts.reduce((acc, cur) => (acc[cur.id] = cur, acc), {} as { [id: string]: MoneyPart })

    money.moneyParts.forEach(part => {
      if (index[part.id]) index[part.id].amount += part.amount * coefficient;
      else {
        index[part.id] = { ...part, amount: part.amount * coefficient };
        this.moneyParts.push(index[part.id]);
      }
    });

    return this;
  }

  // splits of Money from current object and returns splitted object
  slice(slicedMoney: Money, coefficient: number = 1): Money {    
    this.merge(slicedMoney, coefficient * (-1));
    return slicedMoney;
  }

  // subtract proportionall parts
  sliceAmount(slicedAmount: number): Money {
    const sum = this.sum();
    const slice = this.clone();
    slice.modify(amount => amount / sum * slicedAmount)
    return this.slice(slice);
  }

  // subtract proportionall parts
  slicePortion(portion: number): Money {
    const slice = this.clone();
    slice.modify(amount => amount * portion);
    return this.slice(slice);
  }

  // shorthand modifify methods. should not be used, money dont grow on them trees
  multiply(divisor: number): Money {
    return this.modify(amount => amount * divisor);
  }

  divide(divisor: number): Money {
    return this.modify(amount => amount / divisor);
  }

}