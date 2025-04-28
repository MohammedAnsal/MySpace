import express from "express";
import {
  walletController,
} from "../../controllers/implements/wallet/wallet.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";

const walletRoute = express.Router();

// walletRoute.post(
//   "/create/:bookingId",
//   authMiddleWare,
//   autherization,
//   authorizeRoles(Roles.USER),
//   walletController.createWallet.bind(walletController)
// );
walletRoute.get(
  "/user-wallet",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  walletController.getUserWallet.bind(walletController)
);
walletRoute.get(
  "/provider-wallet",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  walletController.getProviderWallet.bind(walletController)
);
walletRoute.get(
  "/admin-wallet",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  walletController.getAdminWallet.bind(walletController)
);
walletRoute.get(
  "/transactions",
  authMiddleWare,
  autherization,
  walletController.getTransactions.bind(walletController)
);

export default walletRoute;
