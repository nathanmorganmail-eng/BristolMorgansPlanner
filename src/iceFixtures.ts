// Bristol Snowdogs & Pups 2026-27 fixtures.
// Miles/drive from home (BS40 8SP). Distances are typical off-peak.

export type Team = 'SD' | 'Pups';
export type HomeAway = 'Home' | 'Away';

export interface Fixture {
  day: string;      // Sun, Sat
  date: string;     // YYYY-MM-DD
  time: string;     // HH:MM 24h
  team: Team;
  vs: string;
  ha: HomeAway;
  postcode?: string;
  miles?: number;
  drive?: string;
}

export const FIXTURES: Fixture[] = [
  { day: 'Sun', date: '2026-09-06', time: '16:45', team: 'Pups', vs: 'Chelmsford',        ha: 'Away', postcode: 'CM1 1FG', miles: 175, drive: '3h 20m' },
  { day: 'Sun', date: '2026-09-13', time: '15:30', team: 'Pups', vs: 'MK',                ha: 'Home' },
  { day: 'Sat', date: '2026-09-19', time: '16:45', team: 'Pups', vs: 'Haringey',          ha: 'Away', postcode: 'N22 7AY', miles: 140, drive: '2h 50m' },
  { day: 'Sun', date: '2026-09-20', time: '15:30', team: 'SD',   vs: 'Swindon u16s',      ha: 'Home' },
  { day: 'Sat', date: '2026-09-26', time: '17:50', team: 'SD',   vs: 'Swindon u16s',      ha: 'Away', postcode: 'SN5 7DL', miles: 55,  drive: '1h 15m' },
  { day: 'Sat', date: '2026-10-10', time: '16:15', team: 'SD',   vs: 'Milton Keynes u16s', ha: 'Away', postcode: 'MK9 1DL', miles: 125, drive: '2h 20m' },
  { day: 'Sun', date: '2026-10-25', time: '15:20', team: 'Pups', vs: 'IceBees',           ha: 'Away', postcode: 'RG12 8LU', miles: 100, drive: '2h 00m' },
  { day: 'Sat', date: '2026-11-07', time: '18:45', team: 'SD',   vs: 'Romford u16s',      ha: 'Away', postcode: 'RM1 3JT', miles: 150, drive: '3h 00m' },
  { day: 'Sun', date: '2026-11-08', time: '15:30', team: 'Pups', vs: 'Oxford',            ha: 'Home' },
  { day: 'Sat', date: '2026-11-14', time: '16:30', team: 'Pups', vs: 'Oxford',            ha: 'Away', postcode: 'OX1 1RX', miles: 85,  drive: '1h 45m' },
  { day: 'Sun', date: '2026-11-22', time: '15:30', team: 'SD',   vs: 'Haringey u16s',     ha: 'Home' },
  { day: 'Sun', date: '2026-12-06', time: '15:30', team: 'Pups', vs: 'Telford',           ha: 'Home' },
  { day: 'Sat', date: '2026-12-12', time: '18:15', team: 'SD',   vs: 'Cambridge u16s',    ha: 'Away', postcode: 'CB5 8AA', miles: 175, drive: '3h 15m' },
  { day: 'Sun', date: '2026-12-20', time: '15:30', team: 'SD',   vs: 'Solent u16s',       ha: 'Home' },
  { day: 'Sun', date: '2027-01-03', time: '15:30', team: 'SD',   vs: 'Cambridge u16s',    ha: 'Home' },
  { day: 'Sun', date: '2027-01-17', time: '15:30', team: 'SD',   vs: 'Oxford u16s',       ha: 'Home' },
  { day: 'Sat', date: '2027-01-23', time: '16:15', team: 'Pups', vs: 'MK',                ha: 'Away', postcode: 'MK9 1DL', miles: 125, drive: '2h 20m' },
  { day: 'Sat', date: '2027-01-30', time: '18:25', team: 'SD',   vs: 'Oxford u16s',       ha: 'Away', postcode: 'OX1 1RX', miles: 85,  drive: '1h 45m' },
  { day: 'Sun', date: '2027-02-28', time: '15:30', team: 'SD',   vs: 'Milton Keynes u16s', ha: 'Home' },
  { day: 'Sun', date: '2027-03-14', time: '15:30', team: 'Pups', vs: 'Swindon',           ha: 'Home' },
  { day: 'Sun', date: '2027-04-11', time: '18:15', team: 'SD',   vs: 'Haringey u16s',     ha: 'Away', postcode: 'N22 7AY', miles: 140, drive: '2h 50m' },
  { day: 'Sun', date: '2027-04-18', time: '15:30', team: 'SD',   vs: 'Romford u16s',      ha: 'Home' },
  { day: 'Sun', date: '2027-04-18', time: '17:50', team: 'Pups', vs: 'Swindon',           ha: 'Away', postcode: 'SN5 7DL', miles: 55,  drive: '1h 15m' },
  { day: 'Sun', date: '2027-04-25', time: '15:30', team: 'SD',   vs: 'Invicta u16s',      ha: 'Home' },
  { day: 'Sat', date: '2027-05-01', time: '16:45', team: 'SD',   vs: 'Invicta u16s',      ha: 'Away', postcode: 'ME8 0PU', miles: 180, drive: '3h 20m' },
  { day: 'Sun', date: '2027-05-02', time: '15:30', team: 'Pups', vs: 'IceBees',           ha: 'Home' },
  { day: 'Sat', date: '2027-05-08', time: '18:30', team: 'Pups', vs: 'Haringey',          ha: 'Home' },
];
