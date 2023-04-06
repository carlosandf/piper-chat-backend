import { Chat } from '../models/index.js';
import boom from '@hapi/boom';

async function create (req, res) {
  try {
    const { member_one, member_two } = req.body;

    const foundOne = await Chat.findOne({
      member_one,
      member_two
    });
    const foundTwo = await Chat.findOne({
      member_one: member_two,
      member_two: member_one
    });

    if (foundOne || foundTwo) {
      return res.status(200).json({ message: 'Ya tienes un chat con este usuario' });
    }

    const chat = new Chat({
      member_one,
      member_two
    });

    const chatSaved = await chat.save();
    res.status(201).json(chatSaved);
  } catch (error) {
    res.status(400).send({ message: 'Ha ocurrido un error' });
  }
}

async function getAll (req, res) {
  const { userId } = req.user;

  try {
    const chats = await Chat.find({
      $or: [{ member_one: userId }, { member_two: userId }]
    }).populate(['member_one', 'member_two']).exec();
    if (!chats) throw boom.notFound();
    res.status(200).send(chats);
  } catch (error) {
    error.isBoom // preguntar si el error es enviado por Boom
      ? res.status(error.output.statusCode).json({ error, message: error.message })
      : res.status(400).json({ error: error.message });
  }
}

async function deleteChat (req, res) {
  res.status(200).send('Hola Mundo');
}

export const ChatController = {
  create,
  getAll,
  deleteChat
};