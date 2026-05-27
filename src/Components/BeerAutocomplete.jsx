import {useState} from 'react';
import './BeerAutoComplete.css';

export default function BeerAutocomplete({onSelect}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const BEERS = [// Amstel
        "Amstel Pilsener", "Amstel Radler 2.0%", "Amstel Radler 0.0%", "Amstel Bock", "Amstel Blond", "Amstel 0.0",

        // Bavaria
        "Bavaria Premium Pilsener", "Bavaria 0.0%", "Bavaria Radler", "Bavaria Fruity Rosé", "Bavaria Bokbier", "Bavaria IPA 0.0",

        // Brand
        "Brand Pilsener", "Brand Up", "Brand Weizen", "Brand Weizen 0.0", "Brand IPA", "Brand IPA 0.0", "Brand Oud Bruin", "Brand Lentebock", "Brand Dubbelbock", "Brand Zwaar Blond", "Brand Krachtig Blond",

        // Corona
        "Corona Extra", "Corona Cero 0.0%",

        // Desperados
        "Desperados Original", "Desperados Red", "Desperados Mojito", "Desperados Virgin 0.0%", "Desperados Strawberry Margarita",

        // Duvel
        "Duvel", "Duvel Tripel Hop Citra", "Duvel Tripel Hop Cashmere", "Duvel 6.66%",

        // Grolsch
        "Grolsch Premium Pilsner", "Grolsch 0.0%", "Grolsch Radler", "Grolsch Kanon", "Grolsch Weizen", "Grolsch Herfstbok", "Grolsch Lentebok", "Grolsch Kruidig Blond", "Grolsch Klassieke Blond",

        // Guinness
        "Guinness Draught", "Guinness Extra Stout", "Guinness Hop House 13", "Guinness 0.0",

        // Heineken
        "Heineken Pilsener", "Heineken 0.0", "Heineken Silver", "Heineken Tarwebok",

        // Hertog Jan
        "Hertog Jan Pilsener", "Hertog Jan 0.0", "Hertog Jan Karakter", "Hertog Jan Grand Prestige", "Hertog Jan Tripel", "Hertog Jan Dubbel", "Hertog Jan Weizener", "Hertog Jan Lentebock", "Hertog Jan Bockbier", "Hertog Jan Enkel",

        // Hoegaarden
        "Hoegaarden Wit", "Hoegaarden Rosée", "Hoegaarden Grand Cru", "Hoegaarden Radler", "Hoegaarden 0.0",

        // Jupiler
        "Jupiler Pils", "Jupiler 0.0%", "Jupiler Blue",

        // Kasteel
        "Kasteel Rouge", "Kasteel Donker", "Kasteel Tripel", "Kasteel Xtra", "Kasteel Rubus",

        // La Chouffe (Achouffe)
        "La Chouffe Blond", "Mc Chouffe Bruin", "Chouffe Soleil", "Cherry Chouffe", "N'ice Chouffe", "Chouffe 0.4", "Chouffe Bok",

        // Leffe
        "Leffe Blond", "Leffe Bruin", "Leffe Tripel", "Leffe Rituel 9°", "Leffe Ruby", "Leffe Radieuse", "Leffe Royale", "Leffe 0.0",

        // Pauwel Kwak (Bosteels)
        "Kwak Amber", "Kwak Blonde", "Kwak Rouge",

        // Tripel Karmeliet
        "Tripel Karmeliet",

        // Westmalle
        "Westmalle Dubbel", "Westmalle Tripel", "Westmalle Extra",

        // Texels
        "Texels Skuumkoppe", "Texels Skuumkoppe 0.0", "Texels Springtij", "Texels Tripel", "Texels Goudkoppe", "Texels Zeebries", "Texels Bock", "Texels Overzee IPA", "Texels Vuurbaak", "Texels Geheim"];

    const handleChange = (e) => {
        const userInput = e.target.value;
        setQuery(userInput);

        if (userInput.length > 0) {
            const filtered = BEERS.filter(beer => beer.toLowerCase().includes(userInput.toLowerCase()));
            setSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelect = (beerName) => {
        setQuery(beerName);
        setShowDropdown(false);

        if (onSelect) {
            onSelect(beerName);
        }
    };

    return (
        <div className="autocomplete-container">
        <input
            type="text"
            placeholder="Naam van het biertje"
            value={query}
            onChange={handleChange}
        />

        {showDropdown && suggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
            {suggestions.map((beer, index) => (<li
                key={index}
                className="autocomplete-item"
                onClick={() => handleSelect(beer)}
            >
                {beer}
            </li>))}
        </ul>)}
    </div>);
}