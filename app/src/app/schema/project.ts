import { RedistributionDef } from './redistribution';

export interface ProjectDef {

  name: string;

  sources: { input: string, amount: number }[];

}

export class Project {

  public name:string;
  public sources: ProjectDef["sources"];

  constructor(private def: ProjectDef, private outputName?: string) {
    this.sources = def.sources;
    this.name = def.name;
  }

  inputs(): string[] {
    return this.def.sources.map(source => source.input);
  }

}