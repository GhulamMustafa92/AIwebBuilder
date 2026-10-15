import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { changes, generateWebsite, getAll, getWebsiteById } from '../controllers/website.controller.js';

const websitRoutes = express.Router()

websitRoutes.post("/generate",isAuth,generateWebsite)
websitRoutes.post("/update/:id",isAuth,changes)
websitRoutes.get("/get-by-id/:id",isAuth,getWebsiteById)
websitRoutes.get("/get-all",isAuth,getAll)

export default websitRoutes;