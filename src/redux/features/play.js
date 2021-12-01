import {createAction} from '@reduxjs/toolkit';

const play = createAction('player/play');

let action = play();

action = play('https:/Tets');

console.log(play.toString());

console.log(`The action type is: ${play}`);