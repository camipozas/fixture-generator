export interface Participant {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  home: string;
  away: string;
  result?: {
    homeScore: number;
    awayScore: number;
  };
}

export interface Round {
  id: string;
  name: string;
  matches: Match[];
}

export interface Fixture {
  id: string;
  format: 'roundRobin' | 'groups' | 'knockout';
  rounds: Round[];
}

export interface Standing {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
