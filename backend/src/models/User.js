const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password : {
        type: String,
        required: true,
        minlength: 6,
        select: false
    }
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function() {
    if(this.isModified('password')) {
        const hashPassword = await bcrypt.hash(this.password, 10);
        this.password = hashPassword;
    }
})

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
    