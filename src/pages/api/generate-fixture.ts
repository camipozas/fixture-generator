import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Fixture, Participant, Match, Round } from '../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { participants, format, homeAndAway } = req.body;

    let fixture: Fixture;

    switch (format) {
      case 'roundRobin':
        fixture = generateRoundRobin(participants, homeAndAway);
        break;
      case 'groups':
        fixture = generateGroups(participants, homeAndAway);
        break;
      case 'knockout':
        fixture = generateKnockout(participants, homeAndAway);
        break;
      default:
        return res.status(400).json({ error: 'Invalid format' });
    }

    res.status(200).json(fixture);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateRoundRobin(participants: Participant[], homeAndAway: boolean): Fixture {
  const rounds: Round[] = [];
  const n = participants.length;
  const id = uuidv4();

  for (let i = 0; i < (homeAndAway ? 2 * (n - 1) : n - 1); i++) {
    const round: Round = { id, name: 'Round 1', matches: [] };
    for (let j = 0; j < n / 2; j++) {
      const home = participants[(i + j) % (n - 1)];
      const away = participants[(n - 1 - j + i) % (n - 1)];
      if (j === 0) {
        round.matches.push({ id, home: participants[n - 1].name, away: away.name });
      } else {
        round.matches.push({ id, home: home.name, away: away.name });
      }
    }
    rounds.push(round);
    if (homeAndAway) {
      const returnRound: Round = {
        id,
        name: 'Return Round',
        matches: round.matches.map((match) => ({
          id,
          home: match.away,
          away: match.home,
        })),
      };
      rounds.push(returnRound);
    }
  }

  return { id, format: 'roundRobin', rounds };
}

function generateGroups(participants: Participant[], homeAndAway: boolean): Fixture {
  // Implementar lógica para fase de grupos
  // Esta es una implementación simplificada
  const groupSize = 4;
  const groups = [];
  const id = uuidv4();
  for (let i = 0; i < participants.length; i += groupSize) {
    groups.push(participants.slice(i, i + groupSize));
  }

  const rounds: Round[] = [];
  groups.forEach((group, groupIndex) => {
    const groupFixture = generateRoundRobin(group, homeAndAway);
    rounds.push(
      ...groupFixture.rounds.map((round) => ({
        ...round,
        groupName: `Group ${String.fromCharCode(65 + groupIndex)}`,
      })),
    );
  });

  return { id, format: 'groups', rounds };
}

function generateKnockout(participants: Participant[], homeAndAway: boolean): Fixture {
  // Implementar lógica para fase eliminatoria
  // Esta es una implementación simplificada
  const rounds: Round[] = [];
  let roundParticipants = [...participants];
  const id = uuidv4();

  while (roundParticipants.length > 1) {
    const round: Round = { id, name: 'Round', matches: [] };
    for (let i = 0; i < roundParticipants.length; i += 2) {
      const match: Match = {
        id,
        home: roundParticipants[i].name,
        away: roundParticipants[i + 1]?.name || 'BYE',
      };
      round.matches.push(match);
      if (homeAndAway) {
        round.matches.push({ id, home: match.away, away: match.home });
      }
    }
    rounds.push(round);
    roundParticipants = roundParticipants.filter((_, index) => index % 2 === 0);
  }

  return { id, format: 'knockout', rounds };
}
