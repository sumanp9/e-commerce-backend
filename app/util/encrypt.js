const bcrypt = require('bcryptjs');

async function hashPassword (password) {

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
   } catch(error) {
    throw new Error('Password hashing failed', error)
   }
}


async function comparePassword(userEnteredPassword, storedHash) {
    try {
         const match = await bcrypt.compare(userEnteredPassword, storedHash)            
              return match;
    } catch (error) {
        throw new Error('Password comparison failed', error);    }
}


module.exports = {hashPassword, comparePassword};