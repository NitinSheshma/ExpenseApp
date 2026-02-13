const Expense = require('../model/expense');

const expenseDao = {
    /**
     * Create a new expense
     * @param {Object} data - Expense data
     * @returns {Object} Created expense
     */
    createExpense: async (data) => {
        const newExpense = new Expense(data);
        return await newExpense.save();
    },

    /**
     * Get all expenses for a specific group
     * @param {String} groupId - Group ID
     * @returns {Array} Array of expenses
     */
    getExpensesByGroup: async (groupId) => {
        return await Expense.find({ groupId })
            .sort({ createdAt: -1 });
    },

    /**
     * Get expense by ID
     * @param {String} expenseId - Expense ID
     * @returns {Object} Expense object
     */
    getExpenseById: async (expenseId) => {
        return await Expense.findById(expenseId);
    },

    /**
     * Update an expense
     * @param {String} expenseId - Expense ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated expense
     */
    updateExpense: async (expenseId, updateData) => {
        return await Expense.findByIdAndUpdate(
            expenseId,
            { ...updateData, updatedAt: Date.now() },
            { new: true }
        );
    },

    /**
     * Delete an expense
     * @param {String} expenseId - Expense ID
     * @returns {Object} Result of delete operation
     */
    deleteExpense: async (expenseId) => {
        return await Expense.findByIdAndDelete(expenseId);
    },

    /**
     * Calculate settlement details for a group
     * Shows net balance for each member
     * @param {String} groupId - Group ID
     * @returns {Array} Array of member balances
     */
    calculateGroupSettlement: async (groupId) => {
        const expenses = await Expense.find({ groupId });
        
        const memberBalances = {};

        expenses.forEach(expense => {
            // Add amount paid by this member
            if (!memberBalances[expense.paidBy]) {
                memberBalances[expense.paidBy] = 0;
            }
            memberBalances[expense.paidBy] += expense.amount;

            // Subtract amount owed by each member
            expense.splits.forEach(split => {
                if (!memberBalances[split.memberEmail]) {
                    memberBalances[split.memberEmail] = 0;
                }
                memberBalances[split.memberEmail] -= split.amountOwed;
            });
        });

        // Convert to array format: [{member, amount, isNegative}]
        return Object.entries(memberBalances).map(([member, amount]) => ({
            member,
            amount: Math.abs(amount),
            owes: amount < 0 // If negative, they owe money
        }));
    },

    /**
     * Get expenses for a specific member in a group
     * @param {String} groupId - Group ID
     * @param {String} memberEmail - Member email
     * @returns {Array} Array of expenses
     */
    getExpensesByMember: async (groupId, memberEmail) => {
        return await Expense.find({
            groupId,
            splits: {
                $elemMatch: { memberEmail }
            }
        }).sort({ createdAt: -1 });
    }
};

module.exports = expenseDao;
