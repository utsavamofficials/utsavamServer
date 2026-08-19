import { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { seasonRouter } from './season.routes';
import { eventRouter } from './event.routes';
import { eventOrganizerRouter } from './eventOrganizer.routes';
import { collectionExecutiveRouter } from './collectionExecutive.routes';
import { donorRouter } from './donor.routes';
import { donationRouter } from './donation.routes';
import { expenseCategoryRouter } from './expenseCategory.routes';
import { expenseRouter } from './expense.routes';
import { expenseApprovalRouter } from './expenseApproval.routes';
import { receiptTemplateRouter } from './receiptTemplate.routes';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Utsavam Portal API v1',
    data: null,
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/seasons', seasonRouter);
apiRouter.use('/events', eventRouter);
apiRouter.use('/event-organizers', eventOrganizerRouter);
apiRouter.use('/collection-executives', collectionExecutiveRouter);
apiRouter.use('/donors', donorRouter);
apiRouter.use('/donations', donationRouter);
apiRouter.use('/expense-categories', expenseCategoryRouter);
apiRouter.use('/expenses', expenseRouter);
apiRouter.use('/expense-approvals', expenseApprovalRouter);
apiRouter.use('/receipt-templates', receiptTemplateRouter);
