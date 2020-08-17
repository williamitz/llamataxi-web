export interface IChartCards {
  currentTraffic: number;
  oldTraffic: number;
  percentTraffic: number;
  currentNewUsers: number;
  oldNewUsers: number;
  percentNewUsers: number;
  currentServices: number;
  oldServices: number;
  percentServices: number;
  currentVerified: number;
  oldVerified: number;
  percentVerified: number;
  currentDate: number;
  oldMonth: number;
  oldYear: number;
  currentMonth: number;
  currentYear: number;
}

export interface IChartServices {
  transit: number;
  pending: number;
  finished: number;
  canceled: number;
}

export interface IChartUsers {
  clients: number;
  drivers: number;
}
