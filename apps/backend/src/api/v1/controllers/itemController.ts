import type { Request, Response, NextFunction } from 'express';
import * as itemService from "../services/itemService.ts";
import { successResponse } from "../models/responseModel.ts";


export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.status(200).json(successResponse('', "It's a workin"))
}

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newItem = await itemService.createItem(req.body);

    res.status(201).json(successResponse(newItem, "Item created successfully"))
  } catch (err) {
    next(err)
  }
}


export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    const updatedItem = await itemService.updateItem(id, item);
    res.status(200).json(successResponse(updatedItem, "Item updated successfully"))
  } catch (err) {
    next(err)
  }
}
