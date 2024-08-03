import React from 'react';
import { Fixture, Match } from '../types';

interface FixtureDisplayProps {
  fixture: Fixture;

  onUpdateResult: (
    matchId: string,
    homeScore: number,
    awayScore: number,
  ) => Promise<void>;
}

const FixtureDisplay: React.FC<FixtureDisplayProps> = ({ fixture }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fixture</h2>
      {fixture.rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Round {roundIndex + 1}</h3>
          {round.matches.map((match, matchIndex) => (
            <div key={matchIndex} className="mb-2">
              <span>{match.home}</span> vs <span>{match.away}</span>
              {match.result && (
                <span className="ml-2">
                  Result: {match.result.homeScore} - {match.result.awayScore}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FixtureDisplay;
