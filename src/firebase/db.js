import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, firstname, lastname, age, degree, city, country, university, subject1, subject2, subject3) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    firstname,
    lastname,
    age,
    degree,
    city,
    country,
    university,
    subject1,
    subject2,
    subject3
  });