import Stripe from 'stripe';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { AppError } from '../../../utils/error';
import { IPaymentRepository } from '../../../repositories/interfaces/user/payment.Irepository';
import { Service } from 'typedi';

interface CreateCheckoutSessionParams {
  hostelId: Types.ObjectId;
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  bookingId: Types.ObjectId;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

@Service()
export class StripeService {
  private stripe: Stripe;

  constructor(private paymentRepository: IPaymentRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-03-31.basil",
    });
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: params.currency,
            product_data: {
              name: 'Hostel Booking',
              description: 'Payment for hostel booking'
            },
            unit_amount: Math.round(params.amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          hostelId: params.hostelId.toString(),
          userId: params.userId.toString(),
          providerId: params.providerId.toString(),
          bookingId: params.bookingId.toString(),
          ...params.metadata
        },
      });

      await this.paymentRepository.create({
        userId: params.userId,
        hostelId: params.hostelId,
        providerId: params.providerId,
        bookingId: params.bookingId,
        amount: params.amount,
        currency: params.currency,
        status: 'pending',
        paymentMethod: 'card',
        stripeSessionId: session.id,
        metadata: params.metadata
      });

      return session.url!;
    } catch (error) {
      console.error('Stripe checkout session creation error:', error);
      throw new AppError(
        'Failed to create payment session',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
