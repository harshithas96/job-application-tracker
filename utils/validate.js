const Joi = require("joi");

const signUpSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters"
    }),

    email: Joi.string().email().required().messages({
        "string.email": "Email is not valid",
        "string.empty": "Email is required"
    }),

    
    phoneNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number must be 10 digits"
        }),
        
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.pattern.base":
                "Password must contain uppercase, lowercase, number & special character"
        })
});

const validateSignUp = async (req, res, next) => {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((err) => err.message),
        });
    }

    next(); 
};

module.exports = { validateSignUp };
