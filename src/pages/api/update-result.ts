import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/database';
import { getCachedData, setCachedData } from '../../utils/cache';
import { Fixture, Standing, Match } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fixtureId, matchId, homeScore, awayScore } = req.body;

    try {
      const db = await connectToDatabase();
      const fixtureCollection = db.collection('fixtures');

      // Actualizar el resultado en la base de datos
      await fixtureCollection.updateOne(
        { '_id': ObjectId.createFromHexString(fixtureId), 'rounds.matches.id': matchId },
        { $set: { 'rounds.$[].matches.$[match].result': { homeScore, awayScore } } },
        { arrayFilters: [{ 'match.id': matchId }] },
      );

      // Obtener el fixture actualizado
      const updatedFixture = (await fixtureCollection.findOne({
        _id: ObjectId.createFromHexString(fixtureId),
      })) as unknown as Fixture;

      // Calcular las clasificaciones
      const standings = calculateStandings(updatedFixture);

      // Determinar la siguiente ronda
      const nextRound = determineNextRound(updatedFixture);

      // Actualizar el caché
      const cacheKey = `fixture_${fixtureId}`;
      setCachedData(cacheKey, { updatedFixture, standings, nextRound });

      res.status(200).json({ updatedFixture, standings, nextRound });
    } catch (error) {
      console.error('Error updating result:', error);
      res.status(500).json({ error: 'Error updating result' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export function calculateStandings(fixture: Fixture): Standing[] {
  const standings: { [key: string]: Standing } = {};

  fixture.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (match.result) {
        updateStanding(
          standings,
          match.home,
          match.away,
          match.result.homeScore,
          match.result.awayScore,
        );
      }
    });
  });

  return Object.values(standings).sort(
    (a, b) =>
      b.points - a.points || b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst),
  );
}

export function updateStanding(
  standings: { [key: string]: Standing },
  home: string,
  away: string,
  homeScore: number,
  awayScore: number,
) {
  if (!standings[home]) standings[home] = createInitialStanding(home);
  if (!standings[away]) standings[away] = createInitialStanding(away);

  standings[home].played++;
  standings[away].played++;
  standings[home].goalsFor += homeScore;
  standings[home].goalsAgainst += awayScore;
  standings[away].goalsFor += awayScore;
  standings[away].goalsAgainst += homeScore;

  if (homeScore > awayScore) {
    standings[home].won++;
    standings[home].points += 3;
    standings[away].lost++;
  } else if (homeScore < awayScore) {
    standings[away].won++;
    standings[away].points += 3;
    standings[home].lost++;
  } else {
    standings[home].drawn++;
    standings[away].drawn++;
    standings[home].points++;
    standings[away].points++;
  }
}

function createInitialStanding(teamName: string): Standing {
  return {
    teamName,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };
}

export function determineNextRound(fixture: Fixture): string[] {
  if (fixture.format === 'knockout') {
    return fixture.rounds[fixture.rounds.length - 1].matches
      .filter((match) => match.result)
      .map((match) => {
        if (match.result!.homeScore > match.result!.awayScore) {
          return match.home;
        } else if (match.result!.homeScore < match.result!.awayScore) {
          return match.away;
        } else {
          return 'TBD (Tied)';
        }
      });
  }

  // Para formatos de liga o grupos, podrías retornar los mejores clasificados
  return [];
}
