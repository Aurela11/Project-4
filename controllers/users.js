const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function registerUser(req, res) {
  try {
    const { name, email } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.json({ message: 'User registration successful', user: newUser });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getUserDetails(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  registerUser,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
};
