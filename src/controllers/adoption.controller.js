import adoptionService from '../services/adoption.service.js';

export const getAllAdoptions = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.species) filter.species = req.query.species;
        const adoptions = await adoptionService.getAll(filter);
        res.status(200).json({ status: 'success', payload: adoptions });
    } catch (error) {
        next(error);
    }
};

export const getAdoptionById = async (req, res, next) => {
    try {
        const { aid } = req.params;
        const adoption = await adoptionService.getById(aid);
        res.status(200).json({ status: 'success', payload: adoption });
    } catch (error) {
        next(error);
    }
};

export const createAdoption = async (req, res, next) => {
    try {
        const newAdoption = await adoptionService.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Animal registrado en adopción',
            payload: newAdoption
        });
    } catch (error) {
        next(error);
    }
};

export const updateAdoption = async (req, res, next) => {
    try {
        const { aid } = req.params;
        const updated = await adoptionService.update(aid, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Animal actualizado',
            payload: updated
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAdoption = async (req, res, next) => {
    try {
        const { aid } = req.params;
        const deleted = await adoptionService.delete(aid);
        res.status(200).json({
            status: 'success',
            message: 'Animal eliminado del registro',
            payload: deleted
        });
    } catch (error) {
        next(error);
    }
};

export const adoptAnimal = async (req, res, next) => {
    try {
        const { aid } = req.params;
        const owner = req.body?.owner || req.user?.email || req.user?.userId;
        const adopted = await adoptionService.adopt(aid, owner);
        res.status(200).json({
            status: 'success',
            message: 'Adopción registrada',
            payload: adopted
        });
    } catch (error) {
        next(error);
    }
};
