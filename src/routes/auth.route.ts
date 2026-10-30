import express from "express";
import { login, logout, registration } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/dataValidation.middleware";
import {
  loginSchema,
  registrationSchema,
} from "../validators/credential.validator";
const router = express.Router();

router.post("/registration", validateRequest(registrationSchema), registration);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
