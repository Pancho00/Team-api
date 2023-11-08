import { jest, describe, expect, afterEach } from '@jest/globals';
import subscriptionErrors from '../../src/errors/subscription.errors';
import { required, mustBe, requiredAndValid } from '../../src/errors/common.messages';

describe('Errors: Subscription Errors', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Validation', () => {
        const { validation } = subscriptionErrors;

        it('should have a name', () => {
            expect(validation.messages.name).toBe(required('name'));
        });

        it('should have a valid price', () => {
            expect(validation.messages.price).toBe(requiredAndValid({ key: 'price', type: 'number' }));
        });

        it('should have a description', () => {
            expect(validation.messages.description).toBe(mustBe({ key: 'dni', type: 'string' }));
        });
    });

    describe('Club Not Found', () => {
        const { clubNotFound } = subscriptionErrors;

        it('should have a name', () => {
            expect(clubNotFound.name).toBe('subscription_club_not_found_error');
        });

        it('should have a message', () => {
            expect(clubNotFound.message).toBe('the club not found');
        });
    });
});