import { Fragment, useState } from "react";
import Image from "next/image";

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

export default function Buildpkmn() {
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
  const [error, setError] = useState("");
  async function SearchPkmn(search: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      setPkmnData(data);
      if (error != "") {
        setError("");
      }
    } catch (error) {
      console.error("Failed to fetch Pokemon: ", error);
      setError("Pkmn not found");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }
  let uniqueAbilities = Array.from(
    new Set(pkmnData.abilities.map((abil) => abil.ability.name))
  );

  let abilities = uniqueAbilities.map((abilName) => {
    let abil = pkmnData.abilities.find(
      (abil) => abil.ability.name === abilName
    );
    return (
      <Fragment key={abil?.ability.name}>
        {abil?.is_hidden ? (
          <div>
            <span className="font-light">Hidden: </span>
            <span className="font-bold text-xl">{abil.ability.name}</span>
          </div>
        ) : (
          <div>
            <span className="font-light">Ability: </span>
            <span className="font-bold text-xl">{abil?.ability.name}</span>
          </div>
        )}
      </Fragment>
    );
  });

  // let abilities = pkmnData.abilities.map((abil) => {
  //   return (
  //     <Fragment key={abil.ability.name}>
  //       {abil.is_hidden ? (
  //         <div>
  //           <span className="font-light">Hidden: </span>
  //           <span className="font-bold text-xl">{abil.ability.name}</span>
  //         </div>
  //       ) : (
  //         <div>
  //           <span className="font-light">Ability: </span>
  //           <span className="font-bold text-xl">{abil.ability.name}</span>
  //         </div>
  //       )}
  //     </Fragment>
  //   );
  // });

  let types = pkmnData.types.map((typ) => {
    return (
      <Fragment key={typ.type.name}>
        {pkmnData.types.length > 1 &&
        pkmnData.types.indexOf(typ) !== pkmnData.types.length - 1 ? (
          <span className="font-bold text-xl">{typ.type.name}, </span>
        ) : (
          <span className="font-bold text-xl">{typ.type.name} </span>
        )}
      </Fragment>
    );
  });

  let stats = pkmnData.stats.map((sta) => {
    return (
      <Fragment key={sta.stat.name}>
        <span className="font-light">{sta.stat.name}: </span>
        <span className="font-semibold text-xl">{sta.base_stat} </span>
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
      {error != "" ? <p>{error}</p> : ""}
      {pkmnData.id !== 0 ? (
        <div className="mt-4 rounded-xl p-4 mx-4 md:mx-72 bg-sky-400 text-black mb-4">
          <div className="flex justify-center align-middle">
            {pkmnData.sprites.other["official-artwork"].front_default !== "" ? (
              <Image
                src={pkmnData.sprites.other["official-artwork"].front_default}
                width={475}
                height={475}
                alt={pkmnData.name}
                className="w-1/4"
              />
            ) : (
              ""
            )}
          </div>

          <h1 className="text-4xl font-bold">
            {pkmnData.name[0].toUpperCase() + pkmnData.name.slice(1)}
          </h1>
          <h2 className="text-2xl font-light">National Dex #{pkmnData.id}</h2>

          <div className="grid grid-cols-2 my-4">
            <p>
              <span className="font-light font-xl">Type: </span>
              {types}
            </p>
            <div>{abilities}</div>
          </div>
          <h5 className="text-2xl font-semibold my-3">Base Stats</h5>
          {stats}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
