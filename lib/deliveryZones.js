export const regions = [
    'Dakar',
    'Diourbel',
    'Fatick',
    'Kaffrine',
    'Kaolack',
    'Kédougou',
    'Kolda',
    'Louga',
    'Matam',
    'Saint-Louis',
    'Sédhiou',
    'Tambacounda',
    'Thiès',
    'Ziguinchor',
].sort();

export const deliveryZones = {
    Dakar: [
        { name: 'Almadies', fee: 2500 },
        { name: 'Amitié', fee: 2000 },
        { name: 'Bargny', fee: 3000 },
        { name: 'Cambérène', fee: 2000 },
        { name: 'Castors', fee: 2000 },
        { name: 'Colobane', fee: 2000 },
        { name: 'Dakar Plateau', fee: 2000 },
        { name: 'Dalifort', fee: 2000 },
        { name: 'Diamniadio', fee: 3500 },
        { name: 'Dieuppeul', fee: 2000 },
        { name: 'Fann', fee: 2000 },
        { name: 'Fass', fee: 2000 },
        { name: 'Gorée', fee: -1 },
        { name: 'Grand Dakar', fee: 2000 },
        { name: 'Grand Yoff', fee: 2000 },
        { name: 'Gueule Tapée', fee: 2000 },
        { name: 'Guédiawaye', fee: 2500 },
        { name: 'Hann Bel-Air', fee: 2000 },
        { name: 'HLM', fee: 2000 },
        { name: 'Keur Massar', fee: 3000 },
        { name: 'Liberté (1 à 6)', fee: 2000 },
        { name: 'Malika', fee: 3000 },
        { name: 'Maristes', fee: 2000 },
        { name: 'Mbao', fee: 3000 },
        { name: 'Médina', fee: 2000 },
        { name: 'Mermoz', fee: 2000 },
        { name: 'Ngor', fee: 2500 },
        { name: 'Ouakam', fee: 2000 },
        { name: 'Parcelles Assainies', fee: 2000 },
        { name: "Patte d'Oie", fee: 2000 },
        { name: 'Pikine', fee: 2500 },
        { name: 'Point E', fee: 2000 },
        { name: 'Rebeuss', fee: 2000 },
        { name: 'Rufisque', fee: 3000 },
        { name: 'Sacré-Cœur', fee: 2000 },
        { name: 'Sangalkam', fee: 3500 },
        { name: 'Sébikotane', fee: 3500 },
        { name: 'Sicap', fee: 2000 },
        { name: 'Thiaroye', fee: 2500 },
        { name: 'Yeumbeul', fee: 3000 },
        { name: 'Yoff', fee: 2500 },
    ].sort((a, b) => a.name.localeCompare(b.name)),
    Thiès: [
        { name: 'Joal-Fadiouth', fee: -1 },
        { name: 'Khombole', fee: -1 },
        { name: 'Mboro', fee: -1 },
        { name: 'Mbour', fee: -1 },
        { name: 'Ngaparou', fee: -1 },
        { name: 'Nianing', fee: -1 },
        { name: 'Popenguine', fee: -1 },
        { name: 'Pout', fee: -1 },
        { name: 'Saly', fee: -1 },
        { name: 'Somone', fee: -1 },
        { name: 'Thiès Ville', fee: -1 },
        { name: 'Tivaouane', fee: -1 },
        { name: 'Toubab Dialaw', fee: -1 },
    ].sort((a, b) => a.name.localeCompare(b.name)),
    Diourbel: [
        { name: 'Bambey', fee: -1 },
        { name: 'Diourbel Ville', fee: -1 },
        { name: 'Mbacké', fee: -1 },
        { name: 'Touba', fee: -1 },
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'Saint-Louis': [
        { name: 'Dagana', fee: -1 },
        { name: 'Ndioum', fee: -1 },
        { name: 'Podor', fee: -1 },
        { name: 'Richard-Toll', fee: -1 },
        { name: 'Saint-Louis', fee: -1 },
        { name: 'Université Gaston Berger (UGB)', fee: -1 },
    ].sort((a, b) => a.name.localeCompare(b.name)),
    // Les autres régions auront une liste générique qui sera triée plus bas
};

/**
 * Récupère les zones pour une région donnée.
 */
export const getZonesForRegion = (region) => {
    if (deliveryZones[region]) {
        return deliveryZones[region];
    }
    return [
        { name: `${region} (Ville Principale)`, fee: -1 },
        { name: 'Autre commune / Département', fee: -1 },
    ];
};
