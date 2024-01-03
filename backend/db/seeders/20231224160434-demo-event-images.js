//*====> backend/db/seeders/20231224160445-demo-event-images.js <====
"use strict";
const { EventImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(
      [
        {
          eventId: 1, // Image for 'Avengers Assembly' event
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fmarvelcinematicuniverse%2Fimages%2F0%2F0b%2FNew_York_Battle.PNG%2Frevision%2Flatest%3Fcb%3D20171030072036&tbnid=CHksqdg6mVpksM&vet=12ahUKEwjY6aG3ma6DAxUHlIkEHf8GAv8QMygAegQIARBR..i&imgrefurl=https%3A%2F%2Fmarvelcinematicuniverse.fandom.com%2Fwiki%2FBattle_of_New_York&docid=Okxm1YhzG2zOhM&w=1920&h=1080&q=Battle%20for%20New%20York%20Marvel&ved=2ahUKEwjY6aG3ma6DAxUHlIkEHf8GAv8QMygAegQIARBR",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2, // Image for 'S.H.I.E.L.D. Recruitment' event
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F94%2F6b%2Fcf%2F946bcf97a1955a5e474d906fed663ee9.jpg&tbnid=Gd9rh46OjLNxZM&vet=12ahUKEwj5jIjHma6DAxWgkYkEHfh2BLEQMygBegQIARBT..i&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F238550111487820475%2F&docid=QIzbHeWdy-i05M&w=500&h=500&q=SHEILD%20recruitment&ved=2ahUKEwj5jIjHma6DAxWgkYkEHfh2BLEQMygBegQIARBT",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3, // Image for 'Stark Expo' event
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Foyster.ignimgs.com%2Fmediawiki%2Fapis.ign.com%2Fmarvel-studios-cinematic-universe%2Fa%2Fa6%2FStark_expo.jpg&tbnid=9JtCTKAsOMgvMM&vet=12ahUKEwiumoTRma6DAxUdn4kEHQWvAJQQMygBegQIARB1..i&imgrefurl=https%3A%2F%2Fwww.ign.com%2Fwikis%2Fmarvel-studios-cinematic-universe%2FStark_Expo&docid=dnC27CRlMy_W1M&w=500&h=214&q=STARK%20Expo&ved=2ahUKEwiumoTRma6DAxUdn4kEHQWvAJQQMygBegQIARB1",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 4, // Image for 'X-Men Training Session' event
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2F5%2F5b%2FDanger_room.jpg&tbnid=ptsfSkPOgwJ4XM&vet=12ahUKEwiSs7bbma6DAxVJkYkEHa9RAtoQMygAegQIARBS..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDanger_Room&docid=CgmPBrnUUJ9tRM&w=351&h=283&q=XMen%20training%20session&ved=2ahUKEwiSs7bbma6DAxVJkYkEHa9RAtoQMygAegQIARBS",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 5, // Image for 'Fantastic Four Science Fair' event
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.digitaltrends.com%2Fwp-content%2Fuploads%2F2023%2F09%2FFantastic-Four-in-the-cosmos.jpg%3Fp%3D1&tbnid=d34UrJHlw4UwsM&vet=12ahUKEwidmpfmma6DAxUEn4kEHS-BCqoQMygmegUIARCkAQ..i&imgrefurl=https%3A%2F%2Fwww.digitaltrends.com%2Fmovies%2F10-best-fantastic-four-stories-ever-ranked%2F&docid=bophz2YIjojmxM&w=1200&h=675&q=Fantastic%20Four%20science%20fair&ved=2ahUKEwidmpfmma6DAxUEn4kEHS-BCqoQMygmegUIARCkAQ",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("EventImages", null, options);
  },
};
