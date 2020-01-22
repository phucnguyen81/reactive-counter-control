export class TickInput {
  constructor(readonly active: boolean, readonly speed: number) {}

  isEqual(other: TickInput): boolean {
    return (
      this.active === other.active
      && this.speed === other.speed
    );
  }
}

export class TickOutput {}
