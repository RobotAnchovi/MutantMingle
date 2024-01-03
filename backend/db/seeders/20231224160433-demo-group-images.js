//*====> backend/db/seeders/20231224160436-demo-group-images.js <====
"use strict";
const { GroupImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1, // Corresponds to 'The Avengers'
          url: "https://www.google.com/aclk?sa=l&ai=DChcSEwiNp_qlmK6DAxU9a0cBHXDVBwoYABABGgJxdQ&ase=2&gclid=Cj0KCQiAkKqsBhC3ARIsAEEjuJgNUH3sIjTi1N4Tc1FKuauI2Z_HSb4wpPp44dESfO19DFacTFAPgZQaAgHZEALw_wcB&sig=AOD64_0ggwVcrYaMsp8bG9CSyFn5yTtgYQ&ctype=5&nis=6&adurl&ved=2ahUKEwjauu-lmK6DAxX0k4kEHf0CD6sQvhd6BAgBEH0",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 2, // Corresponds to 'Science Bros'
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fqph.cf2.quoracdn.net%2Fmain-qimg-79c2c2a196da26754665c4808b547e09-lq&tbnid=0AaMlq3EdkiGHM&vet=12ahUKEwiMgZ3SmK6DAxVrjokEHSmsAjIQMygnegUIARCfAQ..i&imgrefurl=https%3A%2F%2Fwww.quora.com%2FWhat-Marvel-Comics-character-did-you-relate-to-most-as-a-child&docid=LC45kJp0uBI22M&w=602&h=534&itg=1&q=Marvel%20science%20bros&ved=2ahUKEwiMgZ3SmK6DAxVrjokEHSmsAjIQMygnegUIARCfAQ",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 3, // Corresponds to 'Stark Industries R&D'
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fforums.macrumors.com%2Fattachments%2Fstark-b-w-jpg.159712%2F&tbnid=JDqJdHO0LozxdM&vet=12ahUKEwiWguHnmK6DAxU5v4kEHcPwDQIQMygMegUIARCOAQ..i&imgrefurl=https%3A%2F%2Fforums.macrumors.com%2Fthreads%2Fstark-industries-superhero-related-wallpapers.657548%2F&docid=lwbYGFvKrLm5bM&w=1920&h=1200&q=Stark%20industries&ved=2ahUKEwiWguHnmK6DAxU5v4kEHcPwDQIQMygMegUIARCOAQ",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 4, // Corresponds to 'S.H.I.E.L.D. Espionage'
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.etsystatic.com%2F9715836%2Fr%2Fil%2F030dcd%2F1477498432%2Fil_570xN.1477498432_1elo.jpg&tbnid=7xb14xzY6pXtuM&vet=12ahUKEwi91MP3mK6DAxUUk4kEHaBpDLsQMygAegQIARB0..i&imgrefurl=https%3A%2F%2Fwww.etsy.com%2Flisting%2F593600706%2Fmarvels-shield-logo-vinyl-decal-for-cars&docid=ER7tRKLjcuwtVM&w=570&h=561&q=shield%20logo&ved=2ahUKEwi91MP3mK6DAxUUk4kEHaBpDLsQMygAegQIARB0",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 5, // Corresponds to 'Heroes for Justice'
          url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.joshbook.com%2Fwp-content%2Fuploads%2Fcontent-slider-marvel-heroes-marko.jpg&tbnid=e9PSQz384FB1PM&vet=12ahUKEwio0uORma6DAxXen4kEHbDQCbMQMyhZegUIARCpAg..i&imgrefurl=https%3A%2F%2Fwww.joshbook.com%2Fmarvel-heroes-art-direction%2F&docid=Zm2mxbNRGeprEM&w=960&h=540&q=Heroes%20for%20justice%20marvel&ved=2ahUKEwio0uORma6DAxXen4kEHbDQCbMQMyhZegUIARCpAg",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("GroupImages", null, options);
  },
};
