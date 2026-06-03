import AdoptionModel from '../models/adoption.model.js';

export class AdoptionRepository {
    async findAll(filter = {}) {
        return await AdoptionModel.find(filter);
    }

    async findById(id) {
        return await AdoptionModel.findById(id);
    }

    async create(data) {
        const adoption = new AdoptionModel(data);
        return await adoption.save();
    }

    async update(id, data) {
        return await AdoptionModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await AdoptionModel.findByIdAndDelete(id);
    }

    async findByStatus(status) {
        return await AdoptionModel.find({ status });
    }
}

export default new AdoptionRepository();
