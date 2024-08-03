import React, { useState } from 'react';
import { Participant } from '../types';

interface FixtureFormProps {
  onGenerate: (participants: Participant[], format: string, homeAndAway: boolean) => void;
}

const FixtureForm: React.FC<FixtureFormProps> = ({ onGenerate }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [format, setFormat] = useState<string>('roundRobin');
  const [homeAndAway, setHomeAndAway] = useState<boolean>(false);

  const addParticipant = () => {
    setParticipants([...participants, { id: Date.now().toString(), name: '' }]);
  };

  const updateParticipant = (id: string, name: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(participants, format, homeAndAway);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <button
          type="button"
          onClick={addParticipant}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Participant
        </button>
      </div>
      {participants.map((participant) => (
        <input
          key={participant.id}
          type="text"
          value={participant.name}
          onChange={(e) => updateParticipant(participant.id, e.target.value)}
          placeholder="Participant name"
          className="mb-2 p-2 border rounded"
        />
      ))}
      <div className="mb-4">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="roundRobin">Round Robin</option>
          <option value="groups">Group Stage</option>
          <option value="knockout">Knockout</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={homeAndAway}
            onChange={(e) => setHomeAndAway(e.target.checked)}
            className="mr-2"
          />
          Home and Away
        </label>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Generate Fixture
      </button>
    </form>
  );
};

export default FixtureForm;
