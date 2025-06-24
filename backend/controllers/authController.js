import * as authService from "../services/authService.js";

export async function loginUser(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function signupUser(req, res, next) {
  try {
    const { username, password, name, birth } = req.body;
    const result = await authService.signup(username, password, name, birth);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function checkUsername(req, res, next) {
  try {
    const { username } = req.body;
    const result = await authService.checkUsername(username);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const username = req.user.username;
    const result = await authService.deleteUser(username);
    res.json(result);
  } catch (err) {
    next(err);
  }
}