import { Request, Response } from "express";
import { NotificationService } from "../../../services/implements/notification/notification.service";
import { AppError } from "../../../utils/error";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import Container, { Service } from "typedi";

@Service()
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  //  Create notification :-

  async createNotification(req: Request, res: Response) {
    try {
      const notification = await this.service.createNotification(req.body);
      res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: responseMessage.SUCCESS_MESSAGE,
        data: notification,
      });
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get single notification :-

  async getNotificationById(req: Request, res: Response) {
    try {
      const notification = await this.service.getNotificationById(
        req.params.id
      );
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: responseMessage.SUCCESS_MESSAGE,
        data: notification,
      });
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Update notification :-

  async updateNotification(req: Request, res: Response) {
    try {
      const notification = await this.service.updateNotification(
        req.params.id,
        req.body
      );
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: responseMessage.SUCCESS_MESSAGE,
        data: notification,
      });
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Delete notification :-

  async deleteNotification(req: Request, res: Response) {
    try {
      await this.service.deleteNotification(req.params.id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get notification by recipient :-

  async getNotificationsByRecipient(req: Request, res: Response) {
    try {
      const notifications = await this.service.getNotificationsByRecipient(
        req.params.recipientId
      );
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: responseMessage.SUCCESS_MESSAGE,
        data: notifications,
      });
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const notificationController = Container.get(NotificationController);
