import express from "express";
import { walletController } from "../../controllers/implements/wallet/wallet.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { asyncHandler } from "../../utils/asyncHandler";

const walletRoute = express.Router();

walletRoute.get(
  "/user-wallet",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(walletController.getUserWallet.bind(walletController))
);
walletRoute.get(
  "/provider-wallet",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(walletController.getProviderWallet.bind(walletController))
);
walletRoute.get(
  "/admin-wallet",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(walletController.getAdminWallet.bind(walletController))
);
walletRoute.get(
  "/transactions",
  authMiddleWare,
  autherization,
  asyncHandler(walletController.getTransactions.bind(walletController))
);

export default walletRoute;
