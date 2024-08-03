import React, { useState, useEffect } from 'react';
import FixtureForm from '../components/FixtureForm';
import FixtureDisplay from '../components/FixtureDisplay';
import StandingsTable from '../components/StandingsTable';
import { Fixture, Standing } from '../types';

const Home: React.FC = () => {
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);

  const generateFixture = async (
    participants: unknown[],
    format: string,
    homeAndAway: boolean,
  ) => {
    const response = await fetch('/api/generate-fixture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participants, format, homeAndAway }),
    });
    const data = await response.json();
    setFixture(data.fixture);
    setStandings(data.standings);
  };

  const updateResult = async (matchId: string, homeScore: number, awayScore: number) => {
    if (!fixture) return;

    const response = await fetch('/api/update-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fixtureId: fixture.id,
        matchId,
        homeScore,
        awayScore,
      }),
    });
    const data = await response.json();
    setFixture(data.updatedFixture);
    setStandings(data.standings);
  };

  useEffect(() => {
    // Cargar fixture inicial si existe un ID en la URL
    const fixtureId = new URLSearchParams(window.location.search).get('fixtureId');
    if (fixtureId) {
      fetch(`/api/get-fixture?fixtureId=${fixtureId}`)
        .then((response) => response.json())
        .then((data) => {
          setFixture(data.fixture);
          setStandings(data.standings);
        })
        .catch((error) => console.error('Error loading fixture:', error));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fixture Generator</h1>
      <FixtureForm onGenerate={generateFixture} />
      {fixture && (
        <>
          <FixtureDisplay fixture={fixture} onUpdateResult={updateResult} />
          <StandingsTable standings={standings} />
        </>
      )}
    </div>
  );
};

export default Home;
