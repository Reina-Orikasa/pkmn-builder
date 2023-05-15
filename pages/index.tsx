import Image from 'next/image';
import { useState } from 'react';

interface Pkmn {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export default function Home() {
  const [pkmnData, setPkmnData] = useState<Pkmn>({
    name: '',
    id: 0,
    sprites: {
      other: {
        'official-artwork': {
          front_default: '',
        },
      },
    },
  });
  const [search, setSearch] = useState('');
  async function SearchPkmn(search: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      console.log(data.sprites.other['official-artwork'].front_default);
      setPkmnData(data);
    } catch (error) {
      console.error('Failed to fetch Pokemon: ', error);
    }
  }

  return (
    <div className="text-center">
      <h1>Pkmn Team Builder</h1>
      <h2>Search for a Pkmn now</h2>
      <input
        type="text"
        placeholder="id or name"
        className="text-black p-2 mt-4 rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <button
        onClick={() => SearchPkmn(search)}
        className="ml-2 border-2 border-white p-1 rounded-lg"
      >
        Search
      </button>
      {pkmnData.sprites ? (
        <div className="mt-4 border-2 border-white rounded-xl p-4 mx-72">
          <Image
            src={pkmnData.sprites.other['official-artwork'].front_default}
            width={475}
            height={475}
            alt={pkmnData.name}
          />
          <h1>{pkmnData.name}</h1>
          <h2>National Dex: {pkmnData.id}</h2>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
