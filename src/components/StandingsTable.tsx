import React from 'react';
import { Standing } from '../types';

interface StandingsTableProps {
  standings: Standing[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Team</th>
          <th className="py-2 px-4 border-b">P</th>
          <th className="py-2 px-4 border-b">W</th>
          <th className="py-2 px-4 border-b">D</th>
          <th className="py-2 px-4 border-b">L</th>
          <th className="py-2 px-4 border-b">GF</th>
          <th className="py-2 px-4 border-b">GA</th>
          <th className="py-2 px-4 border-b">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((standing, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{standing.teamName}</td>
            <td className="py-2 px-4 border-b">{standing.played}</td>
            <td className="py-2 px-4 border-b">{standing.won}</td>
            <td className="py-2 px-4 border-b">{standing.drawn}</td>
            <td className="py-2 px-4 border-b">{standing.lost}</td>
            <td className="py-2 px-4 border-b">{standing.goalsFor}</td>
            <td className="py-2 px-4 border-b">{standing.goalsAgainst}</td>
            <td className="py-2 px-4 border-b">{standing.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsTable;
