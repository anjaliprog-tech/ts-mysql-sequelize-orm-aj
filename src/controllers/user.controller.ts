import express from 'express';
import {User, UserImage} from '../models/index.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createNewUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).send('Email, name and password are required');
    }
    const user = await User.create({ email, name, password: await bcrypt.hash(password, 10) });
    res.status(201).send(user);
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    const user = await User.findOne({ where: { email }, attributes: ['email', 'password', 'name'] });

    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    const isPasswordValid = await bcrypt.compare(password, user?.dataValues?.password);
    if (!isPasswordValid) {
      return res.status(401).send('Password is incorrect');
    }

    const token = jwt.sign({
      id: user.dataValues.id,
      email: user.dataValues.email,
      name: user.dataValues.name
    }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    })

    delete user.dataValues.password;
    res.setHeader('Authorization', `Bearer ${token}`);
    // res.cookie('refreshtoken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).send({ user: user?.dataValues });
  } catch (err) {
    res.status(500).send('Internal Server Error')
  }
}

export const uploadUserImage = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params?.userId;
    const files = req.files as Express.Multer.File[];
    const result = await Promise.all(
      files.map((file) => {
      return UserImage.create({
        user_id: id,
        filename: file?.filename,
        path: file?.path
      });
    }))
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send('Internal Server Error')
  }
}

export const getImagesForUser = async (req: express.Request, res: express.Response) => {
  try {
    const userImages = await UserImage.findAll({
      include: [
        {
          model: User,
          required: true,
          attributes: {exclude: ['createdAt', 'updatedAt']}
        }
      ],
      // group: ['user_id'],
      
    })
    res.status(200).send(userImages);
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
}