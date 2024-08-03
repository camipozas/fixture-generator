import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/database';
import { getCachedData, setCachedData } from '../../utils/cache';
import { calculateStandings, determineNextRound } from './update-result';
import { Fixture } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { fixtureId } = req.query;

    try {
      // Intentar obtener datos del caché
      const cacheKey = `fixture_${fixtureId}`;
      const cachedData = getCachedData(cacheKey);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      // Si no está en caché, obtener de la base de datos
      const db = await connectToDatabase();
      const fixtureCollection = db.collection('fixtures');

      const fixture = (await fixtureCollection.findOne({
        _id: ObjectId.createFromHexString(fixtureId as string),
      })) as unknown as Fixture;

      if (!fixture) {
        return res.status(404).json({ error: 'Fixture not found' });
      }

      const standings = calculateStandings(fixture);
      const nextRound = determineNextRound(fixture);

      // Guardar en caché
      setCachedData(cacheKey, { fixture, standings, nextRound });

      res.status(200).json({ fixture, standings, nextRound });
    } catch (error) {
      console.error('Error getting fixture:', error);
      res.status(500).json({ error: 'Error getting fixture' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
