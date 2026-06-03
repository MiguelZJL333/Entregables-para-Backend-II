import adoptionRepository from '../repositories/adoption.repository.js';

export class AdoptionService {
    async getAll(filter = {}) {
        return await adoptionRepository.findAll(filter);
    }

    async getById(id) {
        const adoption = await adoptionRepository.findById(id);
        if (!adoption) {
            const error = new Error('Animal no encontrado en adopción');
            error.statusCode = 404;
            throw error;
        }
        return adoption;
    }

    async create(data) {
        if (!data.name || !data.species || data.age === undefined || !data.description) {
            const error = new Error('Faltan datos requeridos del animal');
            error.statusCode = 400;
            throw error;
        }
        if (data.age < 0) {
            const error = new Error('La edad no puede ser negativa');
            error.statusCode = 400;
            throw error;
        }
        return await adoptionRepository.create(data);
    }

    async update(id, data) {
        await this.getById(id);
        return await adoptionRepository.update(id, data);
    }

    async delete(id) {
        await this.getById(id);
        return await adoptionRepository.delete(id);
    }

    async adopt(id, owner) {
        if (!owner) {
            const error = new Error('Se requiere el nombre del adoptante');
            error.statusCode = 400;
            throw error;
        }
        const adoption = await this.getById(id);
        if (adoption.status === 'adopted') {
            const error = new Error('El animal ya fue adoptado');
            error.statusCode = 409;
            throw error;
        }
        return await adoptionRepository.update(id, {
            status: 'adopted',
            owner,
            adoptedAt: new Date()
        });
    }
}

export default new AdoptionService();
