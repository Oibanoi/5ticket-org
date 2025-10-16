import { LiteralUnion } from "next-auth/react";
export enum RaceType {
  Marathon = "ROAD_MARATHON",
  HalfMarathon = "ROAD_HALF_MARATHON",
  Trail = "TRAIL_RACE",
  UltraTrail = "ULTRA_RAIL_RACE",
  UltraRoad = "ULTRA_ROAD_RACE",
  Hillroad = "HILLROAD_RACE",
  Ekiden = "EKIDEN_RACE",
  Unkwon = "UNKNOWN",
  Virtual = "VIRTUAL",
}
export type StatusAvaible =
  | "success"
  | "warning"
  | "info"
  | "error"
  | "pink"
  | "primary"
  | "idle"
  | "secondary"
  | "normal";
export class BadgetOption<
  V extends string,
  D extends { value: V; title: string; type: StatusAvaible }
> {
  byStatus: Record<string, D>;
  constructor(public options: D[]) {
    this.byStatus = options.reduce((obj: any, value) => {
      obj[value.value] = value;
      return obj;
    }, {});
  }

  byKey(key: LiteralUnion<V, string>): D & { message: string; type: StatusAvaible } {
    const result = this.byStatus[key];
    if (result) return { ...result, message: result.title, type: result.type };
    return { message: "Không rõ", type: "error" } as any;
  }
}
export enum ListRaceStatus {
  Draft = "DRAFT",
  GeneratedCode = "GENERATED_CODE",
  OnGoing = "ONGOING",
  Complete = "COMPLETE",
  Cancel = "CANCEL",
}
export const raceStatusOption = new BadgetOption([
  { value: ListRaceStatus.Draft, title: "Nháp", type: "idle" },
  { value: ListRaceStatus.GeneratedCode, title: "Sắp diễn ra", type: "info" },
  { value: ListRaceStatus.OnGoing, title: "Đang diễn ra", type: "warning" },
  { value: ListRaceStatus.Complete, title: "Hoàn thành", type: "success" },
  { value: ListRaceStatus.Cancel, title: "Đã huỷ", type: "idle" },
]);
const icon = "/icons/sneaker-move-bold.svg";
export const raceTypeOption = new BadgetOption([
  {
    value: RaceType.Unkwon,
    title: "Chưa biết",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.Marathon,
    title: "Road (Marathon)",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.HalfMarathon,
    title: "Road (Half-Marathon)",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.Trail,
    title: "Trail race",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.UltraTrail,
    title: "Ultra trail race",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.UltraRoad,
    title: "Ultra road race",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.Hillroad,
    title: "Hillroad race",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.Hillroad,
    title: "Hillroad race",
    type: "success",
    icon: icon,
  },
  {
    value: RaceType.Ekiden,
    title: "Ekiden race",
    type: "success",
    icon: icon,
  },
]);
