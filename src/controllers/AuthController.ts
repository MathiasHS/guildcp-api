import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entity/User';
import config from '../config/config';

class AuthController {
    
    /** 
     * @returns -2 if invalid arguments, -1 if not found or invalid password, JWT token if accepted
     */
    static login = async (username: string, password: string) => {
        if (!(username && password)) {
            return -2;
        }
        
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            return -1;
        }

        // Verify that encrypted password matches, if fail send 401 (unauthorized)
        if (!user.checkIfUnencryptedPasswordisValid(password)) {
            return -1;
        }

        // Sign JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        // Send the JWT token in response
        return token;
    };
    
    /**
     * @returns -1 if unauthorized, 0 if bad request, 1 if success
     */
    static changePassword = async (id: any, oldPassword: string, newPassword: string) => {
        if (!(oldPassword && newPassword)) {
            return 0;
        }
        
        // Get user from database, if fail send 401 (unauthorized)
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            return -1;
        }

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordisValid(oldPassword)) {
            return -1;
        }

        // Validate the model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            return 0;
        }

        // Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        // Send 204 in response (No content)
        return 1;
    };
}

export default AuthController;