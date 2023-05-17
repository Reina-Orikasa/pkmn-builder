import Image from "next/image";
import { Fragment, useState } from "react";

interface Pkmn {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: [
    {
      base_stat: number;
      stat: {
        name: string;
      };
    }
  ];
  abilities: [
    {
      ability: {
        name: string;
      };
      is_hidden: boolean;
    }
  ];
  types: [
    {
      type: {
        name: string;
      };
    }
  ];
}

export default function Home() {
  const [pkmnData, setPkmnData] = useState<Pkmn>({
    name: "",
    id: 0,
    sprites: {
      other: {
        "official-artwork": {
          front_default: "",
        },
      },
    },
    abilities: [
      {
        ability: {
          name: "",
        },
        is_hidden: false,
      },
    ],
    stats: [
      {
        base_stat: 0,
        stat: { name: "" },
      },
    ],
    types: [
      {
        type: {
          name: "",
        },
      },
    ],
  });
  const [search, setSearch] = useState("");
  async function SearchPkmn(search: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      console.log(data.stats[0].base_stat);
      setPkmnData(data);
    } catch (error) {
      console.error("Failed to fetch Pokemon: ", error);
    }
  }

  let abilities = pkmnData.abilities.map((abil) => {
    return (
      <Fragment key={abil.ability.name}>
        <span className="text-lg">
          {abil.is_hidden
            ? `Hidden: ${abil.ability.name} `
            : `Ability: ${abil.ability.name} `}
        </span>
      </Fragment>
    );
  });

  let types = pkmnData.types.map((typ) => {
    return (
      <Fragment key={typ.type.name}>
        {pkmnData.types.length > 1 &&
        pkmnData.types.indexOf(typ) !== pkmnData.types.length - 1 ? (
          <span className="font-bold">{typ.type.name}, </span>
        ) : (
          <span className="font-bold">{typ.type.name} </span>
        )}
      </Fragment>
    );
  });

  let stats = pkmnData.stats.map((sta) => {
    return (
      <Fragment key={sta.stat.name}>
        <span className="font-light">{sta.stat.name}: </span>
        <span className="font-semibold">{sta.base_stat} </span>
        {pkmnData.stats.indexOf(sta) !== pkmnData.stats.length - 1 ? (
          <span> | </span>
        ) : (
          ""
        )}
      </Fragment>
    );
  });

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
      {pkmnData.id !== 0 ? (
        <div className="mt-4 rounded-xl p-4 mx-72 bg-sky-400 text-black">
          <div className="flex justify-center align-middle">
            {pkmnData.sprites.other["official-artwork"].front_default !== "" ? (
              <Image
                src={pkmnData.sprites.other["official-artwork"].front_default}
                width={475}
                height={475}
                alt={pkmnData.name}
              />
            ) : (
              ""
            )}
          </div>

          <h1 className="text-4xl font-bold">
            {pkmnData.name[0].toUpperCase() + pkmnData.name.slice(1)}
          </h1>
          <h2 className="text-3xl">National Dex #{pkmnData.id}</h2>
          {abilities}
          <p>
            <span className="font-light font-xl">Type: </span>
          </p>
          {types}
          <h5 className="text-xl">Base Stats</h5>
          {stats}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
