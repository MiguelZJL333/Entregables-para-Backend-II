import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 80
        },
        species: {
            type: String,
            required: true,
            enum: ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'],
            default: 'Perro'
        },
        age: {
            type: Number,
            required: true,
            min: 0,
            max: 30
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 500
        },
        status: {
            type: String,
            enum: ['available', 'pending', 'adopted'],
            default: 'available'
        },
        owner: {
            type: String,
            trim: true,
            default: null
        },
        adoptedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

adoptionSchema.index({ species: 1 });
adoptionSchema.index({ status: 1 });

const AdoptionModel = mongoose.model('adoptions', adoptionSchema);

export default AdoptionModel;
