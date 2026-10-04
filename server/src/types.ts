export enum Actions {
  Fire = "fire",
  Charge = "charge",
  Shield = "shield",
  Blast = "blast",
}

export interface Player {
  id: string;
  name: string;
  room: string;
  hp: number;
  charge: number;
  action: Actions | null;
}
