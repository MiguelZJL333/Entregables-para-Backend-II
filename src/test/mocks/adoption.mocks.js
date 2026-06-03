import AdoptionModel from '../../models/adoption.model.js';

export const createFakeAdoption = async (overrides = {}) => {
    const base = {
        name: `Test Pet ${Date.now()}`,
        species: 'Perro',
        age: 3,
        description: 'Animal de prueba para tests funcionales de adoption',
        status: 'available',
        ...overrides
    };
    return await AdoptionModel.create(base);
};

export const createFakeAdoptions = async (count = 5, overrides = {}) => {
    const list = [];
    for (let i = 0; i < count; i++) {
        const pet = await createFakeAdoption({
            name: `Pet ${Date.now()}-${i}`,
            age: i + 1,
            ...overrides
        });
        list.push(pet);
    }
    return list;
};

export const validAdoptionPayload = () => ({
    name: 'Firulais',
    species: 'Perro',
    age: 4,
    description: 'Perro mestizo rescatado, muy cariñoso y juguetón',
    status: 'available'
});

export const invalidAdoptionPayloads = {
    missingFields: { name: 'Firulais' },
    negativeAge: {
        name: 'Firulais',
        species: 'Perro',
        age: -1,
        description: 'Descripción válida con más de 10 caracteres'
    },
    invalidSpecies: {
        name: 'Firulais',
        species: 'Dragón',
        age: 4,
        description: 'Descripción válida con más de 10 caracteres'
    },
    shortDescription: {
        name: 'Firulais',
        species: 'Perro',
        age: 4,
        description: 'corto'
    }
};
