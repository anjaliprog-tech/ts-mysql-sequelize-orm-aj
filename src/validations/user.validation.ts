import joi from 'joi'
import express from 'express';

export const registerUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      name: joi.string().required(),
      password: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }
    next();
  } catch (err) {
    throw err;
  }
}