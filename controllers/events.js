const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

async function reserve ( req, res) {
  try {
    const { userId, eventId } = req.body;
    const existingReservation = await prisma.event.findUnique({
      where: { id: eventId },
      include: { users: { where: { id: userId } } },
    });

    if (existingReservation.users.length > 0) {
      return res.status(400).json({ message: 'You have already booked this event.' });
    }
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { users: true },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { users: { connect: { id: userId } } },
    });

    await sendConfirmationEmail(user.email, event);
    res.status(200).json({ message: 'The reservation was made successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
async function sendConfirmationEmail(userEmail, event){
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Event booking confirmation -  "${event.title}"`,
     text:`You have reserved the event "${event.title}",${event.description} which will be held with ${event.date} at ${event.location}.
     
     
----------------------------
Best Regards`
 
  };
  await transporter.sendMail(mailOptions);
}
async function getAllEvents(req, res) {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getEventDetails(req, res) {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, date, location, photoUrl } = req.body;
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        photoUrl,

      },
    });
    res.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateEvent(req, res) {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { title, description, date, location, photoUrl } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        date,
        location,
        photoUrl,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteEvent(req, res) {
  try {
    const eventId = parseInt(req.params.id, 10);
    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  reserve,
  getAllEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
};
