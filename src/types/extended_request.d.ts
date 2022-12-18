import * as jwt from 'jsonwebtoken';
import joi from "joi";
import Express from 'express';
import socketio from 'socket.io';
import {decoded} from "./extended_jwt_payload";

declare global{
  namespace Express{
    export interface Request{
      decoded?: decoded,
      token?: string,
      grade?: String
    }
  }
}
