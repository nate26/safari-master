import React, { FC, useRef, useState } from 'react';
import './SafariZone.css';
import PokeCard from './PokeCard/PokeCard';
import PokePC from './PokePC/PokePC';
import { Pokemon } from '../../interfaces/pokemon.interface';

interface SafariZoneProps { }

const SafariZone: FC<SafariZoneProps> = () => {

    const [pc, setPC] = useState(new Map<string, Pokemon[]>(Array(151).fill([]).map((v, idx) => [(idx + 1 + ''), v])));
    const loadButtonRef = useRef<HTMLInputElement>(null);

    const handleCaughtPokemon = (caughtPokemon: Pokemon) => {
        const id = caughtPokemon.id + '';
        const pokeArr = pc.get(id);
        const newPokeArr = pokeArr ? [...pokeArr, caughtPokemon] : [caughtPokemon];
        setPC(new Map<string, Pokemon[]>(pc).set(id, newPokeArr));
    };

    const saveGame = () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(Object.fromEntries(pc)));
        const dlAnchorElem = document.getElementById('saveGameEl')!;
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', `Safari_Zone_Save_(${new Date().toLocaleString().replace(/ /gi, '')}).json`);
        dlAnchorElem.click();
    };

    const loadGame = () => {
        loadButtonRef.current?.click();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadGameFile = (e: any) => {
        const fileReader = new FileReader();
        const blob = e.target.files[0];
        if (!blob) return;
        fileReader.readAsText(blob, 'UTF-8');
        fileReader.onload = e => {
            const data = e.target?.result as string;
            // TODO: more validations
            if (data) {
                const parsedData: ({ [id: number]: Pokemon[] }) = JSON.parse(data);
                setPC(new Map(Object.entries(parsedData)));
            }
        };
    };

    return (
        <div className="safari-zone" data-testid="SafariZone">
            <a id="saveGameEl" style={{ 'display': 'none' }}></a>
            <div className="header-buttons">
                <button className="poke-button" onClick={saveGame}>Save Game</button>
                <button className="poke-button" onClick={loadGame}>Load Game</button>
                <input type="file" onChange={uploadGameFile} ref={loadButtonRef}  hidden/>
            </div>
            <div></div>
            <div className="poke-card-window" data-testid="PokeCardWindow">
                <PokeCard handleCaughtPokemon={handleCaughtPokemon} />
            </div>
            <PokePC pc={pc} />
        </div>
    );
};

export default SafariZone;
