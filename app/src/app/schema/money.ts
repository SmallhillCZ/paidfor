export interface MoneyPart {
  id: string;
  amount: number;
  label?: string;
}

/**
 * This class defines a structure to save money from different sources and defines
 * arithmetics to persist the source mix while proceeding with redistributions.
 * The object is mutable and before sending it clone muste be used.
 */
export class Money {

  constructor(private moneyParts: MoneyPart[] = []) { }

  /**
   * Clone the current money object. Modifications to the clone will not affect the original
   */
  clone(): Money {
    return new Money(this.moneyParts.map(part => ({ ...part })));
  }

  /**
   * Modify each labelled money using a function
   */
  modify(modifyFn: (amount: number) => number): Money {
    this.moneyParts.forEach(part => part.amount = modifyFn(part.amount));
    return this;
  }

  /**
   * Sum the actual value of money. Optionally filtered by id.
   * @param id The id of the specific money to get. If ommitted all money will be added.
   */
  sum(id?: string): number {
    const parts = id ? this.moneyParts.filter(part => part.id === id) : this.moneyParts;
    return parts.reduce((acc, cur) => acc + cur.amount, 0);
  }

  /**
   * Merge one money object into another by adding the amounts of the same id.
   * @param money the Money object to be merged
   * @param coefficient Optional coefficient, i.e. 0.5 for merging only half of each id. Used mainly for -1 in Money.slice()
   */
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

  /**
   * Subtracts amounts defined by splitted Money object.
   * @param slicedMoney 
   * @param coefficient 
   * @returns slicedMoney
   */
  slice(slicedMoney: Money, coefficient: number = 1): Money {
    this.merge(slicedMoney, coefficient * (-1));
    return slicedMoney;
  }

  /**
   * Subtract fixed amount proportionally by money bin sizes.
   * @param slicedAmount The amount to be subtracted.
   * @returns Money object consisting of the proportionally distributed subtracted amounts.
   */
  sliceAmount(slicedAmount: number): Money {
    const sum = this.sum();
    const slice = this.clone();
    slice.modify(amount => amount / sum * slicedAmount)
    return this.slice(slice);
  }

  // subtract proportionall parts
  /**
   * Subtarcts same portion of each money bin.
   * @param portion The percentage (1 = 100%) portion to be sliced
   * @returns Money object consisting of the subtracted amounts.
   */
  slicePortion(portion: number): Money {
    const slice = this.clone();
    slice.modify(amount => amount * portion);
    return this.slice(slice);
  }

  /**
   * Changes the original object so that every amount is multiplied by the multiplier.
   * @param multiplier 
   */
  multiply(multiplier: number): Money {
    return this.modify(amount => amount * multiplier);
  }

  /**
   * Changes the original object so that every amount is divided by the multiplier.
   * @param divisor 
   */
  divide(divisor: number): Money {
    return this.modify(amount => amount / divisor);
  }

  /**
   * Returns sum of all money amounts.
   * Enables comparison of Money objects
   */
  valueOf(): number {
    return this.sum();
  }
}