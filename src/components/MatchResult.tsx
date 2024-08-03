import React, { useState } from 'react';
import { Match } from '../types';

interface MatchResultProps {
  match: Match;
  onUpdateResult: (home: number, away: number) => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ match, onUpdateResult }) => {
  const [homeScore, setHomeScore] = useState(match.result?.homeScore || 0);
  const [awayScore, setAwayScore] = useState(match.result?.awayScore || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateResult(homeScore, awayScore);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <span>{match.home}</span>
      <input
        type="number"
        value={homeScore}
        onChange={(e) => setHomeScore(Number(e.target.value))}
        className="w-12 p-1 border rounded"
      />
      <span>-</span>
      <input
        type="number"
        value={awayScore}
        onChange={(e) => setAwayScore(Number(e.target.value))}
        className="w-12 p-1 border rounded"
      />
      <span>{match.away}</span>
      <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
        Update
      </button>
    </form>
  );
};
