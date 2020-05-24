const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validators = require('../helpers/validators');
const {
    EMPTY_EMAIL,
    EMPTY_JENIS_KLAIM,
} = require('../configs/message_strings');

const ClaimSchema = new Schema({
    nama: { type: String, required: true },
    nik: { type: String, required: true },
    no_kpj: { type: String, required: true },
    no_telp: { type: String, required: true },
    email: {
        type: String,
        required: [true, EMPTY_EMAIL],
        validate: {
            validator: validators.isValidEmail,
            message: () => EMPTY_EMAIL,
        },
    },
    tanggal_terima: Date,
    jenis_klaim: {
        type: String,
        enum: ['JHT', 'JKK', 'JKM', 'JP'],
        default: 'JHT',
        required: [true, EMPTY_JENIS_KLAIM],
    },
    tanggal_penetapan: Date,
    no_penetapan: String,
    saldo: Number,
    rekening_bank: { type: String, required: true },
    no_rekening: { type: String, required: true },
    tanggal_kirim: Date,
    bpu: {
        type: Schema.Types.ObjectId,
        ref: 'Bpu',
    },
    maker: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    created: Date,
});

const Claim = mongoose.model('Claim', ClaimSchema);

module.exports = Claim;
